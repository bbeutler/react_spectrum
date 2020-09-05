/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaColorAreaProps, ColorChannel} from '@react-types/color';
import {ColorAreaState} from '@react-stately/color';
import {focusWithoutScrolling, isAndroid, isIOS, mergeProps, useGlobalListeners, useLabels} from '@react-aria/utils';
// @ts-ignore
import intlMessages from '../intl/*.json';
import React, {ChangeEvent, HTMLAttributes, InputHTMLAttributes, RefObject, useCallback, useRef} from 'react';
import {useColorAreaGradient} from './useColorAreaGradient';
import {useFocus, useFocusWithin, useKeyboard, useMove} from '@react-aria/interactions';
import {useLocale, useMessageFormatter} from '@react-aria/i18n';
import {useVisuallyHidden} from '@react-aria/visually-hidden';

interface ColorAreaAria {
  /** Props for the color area container element. */
  colorAreaProps: HTMLAttributes<HTMLElement>,
  /** Props for the color area gradient foreground element. */
  gradientProps: HTMLAttributes<HTMLElement>,
  /** Props for the thumb element. */
  thumbProps: HTMLAttributes<HTMLElement>,
  /** Props for the visually hidden horizontal range input element. */
  xInputProps: InputHTMLAttributes<HTMLInputElement>,
  /** Props for the visually hidden vertical range input element. */
  yInputProps: InputHTMLAttributes<HTMLInputElement>
}

interface ColorAreaAriaProps extends AriaColorAreaProps {
  /** A ref to the input that represents the x axis of the color area. */
  inputXRef: RefObject<HTMLElement>,
  /** A ref to the input that represents the y axis of the color area. */
  inputYRef: RefObject<HTMLElement>,
  /** A ref to the color area containing element. */
  containerRef: RefObject<HTMLElement>
}

/**
 * Provides the behavior and accessibility implementation for a color wheel component.
 * Color wheels allow users to adjust the hue of an HSL or HSB color value on a circular track.
 */
export function useColorArea(props: ColorAreaAriaProps, state: ColorAreaState): ColorAreaAria {
  let {
    isDisabled,
    inputXRef,
    inputYRef,
    containerRef,
    'aria-label': ariaLabel
  } = props;
  let formatMessage = useMessageFormatter(intlMessages);

  let {addGlobalListener, removeGlobalListener} = useGlobalListeners();

  let {direction, locale} = useLocale();

  let focusedInputRef = useRef<HTMLElement>(null);

  let focusInput = useCallback((inputRef:RefObject<HTMLElement> = inputXRef) => {
    if (inputRef.current) {
      focusWithoutScrolling(inputRef.current);
    }
  }, [inputXRef]);

  let stateRef = useRef<ColorAreaState>(null);
  stateRef.current = state;
  let {xChannel, yChannel, zChannel} = stateRef.current.channels;
  let xChannelStep = stateRef.current.xChannelStep;
  let yChannelStep = stateRef.current.yChannelStep;

  let currentPosition = useRef<{x: number, y: number}>(null);

  let {keyboardProps} = useKeyboard({
    onKeyDown(e) {
      // these are the cases that useMove doesn't handle
      if (!/^(PageUp|PageDown|Home|End)$/.test(e.key)) {
        e.continuePropagation();
        return;
      }
      // same handling as useMove, don't need to stop propagation, useKeyboard will do that for us
      e.preventDefault();
      // remember to set this and unset it so that onChangeEnd is fired
      stateRef.current.setDragging(true);
      valueChangedViaKeyboard.current = true;
      switch (e.key) {
        case 'PageUp':
          stateRef.current.incrementY(stateRef.current.yChannelPageStep);
          focusedInputRef.current = inputYRef.current;
          break;
        case 'PageDown':
          stateRef.current.decrementY(stateRef.current.yChannelPageStep);
          focusedInputRef.current = inputYRef.current;
          break;
        case 'Home':
          direction === 'rtl' ? stateRef.current.incrementX(stateRef.current.xChannelPageStep) : stateRef.current.decrementX(stateRef.current.xChannelPageStep);
          focusedInputRef.current = inputXRef.current;
          break;
        case 'End':
          direction === 'rtl' ? stateRef.current.decrementX(stateRef.current.xChannelPageStep) : stateRef.current.incrementX(stateRef.current.xChannelPageStep);
          focusedInputRef.current = inputXRef.current;
          break;
      }
      stateRef.current.setDragging(false);
      if (focusedInputRef.current) {
        focusInput(focusedInputRef.current ? focusedInputRef : inputXRef);
      }
    }
  });

  let moveHandler = {
    onMoveStart() {
      currentPosition.current = null;
      stateRef.current.setDragging(true);
    },
    onMove({deltaX, deltaY, pointerType, shiftKey}) {
      let {
        incrementX,
        decrementX,
        incrementY,
        decrementY,
        xChannelPageStep,
        xChannelStep,
        yChannelPageStep,
        yChannelStep,
        getThumbPosition,
        setColorFromPoint
      } = stateRef.current;
      if (currentPosition.current == null) {
        currentPosition.current = getThumbPosition();
      }
      let {width, height} = containerRef.current.getBoundingClientRect();
      let valueChanged = deltaX !== 0 || deltaY !== 0;
      if (pointerType === 'keyboard') {
        let deltaXValue = shiftKey && xChannelPageStep > xChannelStep ? xChannelPageStep : xChannelStep;
        let deltaYValue = shiftKey && yChannelPageStep > yChannelStep ? yChannelPageStep : yChannelStep;
        if ((deltaX > 0 && direction === 'ltr') || (deltaX < 0 && direction === 'rtl')) {
          incrementX(deltaXValue);
        } else if ((deltaX < 0 && direction === 'ltr') || (deltaX > 0 && direction === 'rtl')) {
          decrementX(deltaXValue);
        } else if (deltaY > 0) {
          decrementY(deltaYValue);
        } else if (deltaY < 0) {
          incrementY(deltaYValue);
        }
        valueChangedViaKeyboard.current = valueChanged;
        // set the focused input based on which axis has the greater delta
        focusedInputRef.current = valueChanged && Math.abs(deltaY) > Math.abs(deltaX) ? inputYRef.current : inputXRef.current;
      } else {
        currentPosition.current.x += (direction === 'rtl' ? -1 : 1) * deltaX / width ;
        currentPosition.current.y += deltaY / height;
        setColorFromPoint(currentPosition.current.x, currentPosition.current.y);
      }
    },
    onMoveEnd() {
      isOnColorArea.current = undefined;
      stateRef.current.setDragging(false);
      focusInput(focusedInputRef.current ? focusedInputRef : inputXRef);
    }
  };
  let {moveProps: movePropsThumb} = useMove(moveHandler);

  let valueChangedViaKeyboard = useRef<boolean>(false);
  let {focusWithinProps} = useFocusWithin({
    onFocusWithinChange: (focusWithin:boolean) => {
      if (!focusWithin) {
        valueChangedViaKeyboard.current = false;
        focusedInputRef.current === undefined;
      }
    }
  });

  let currentPointer = useRef<number | null | undefined>(undefined);
  let isOnColorArea = useRef<boolean>(false);
  let {moveProps: movePropsContainer} = useMove({
    onMoveStart() {
      if (isOnColorArea.current) {
        moveHandler.onMoveStart();
      }
    },
    onMove(e) {
      if (isOnColorArea.current) {
        moveHandler.onMove(e);
      }
    },
    onMoveEnd() {
      if (isOnColorArea.current) {
        moveHandler.onMoveEnd();
      }
    }
  });

  let onThumbDown = (id: number | null) => {
    if (!state.isDragging) {
      currentPointer.current = id;
      valueChangedViaKeyboard.current = false;
      focusInput();
      state.setDragging(true);
      if (typeof PointerEvent !== 'undefined') {
        addGlobalListener(window, 'pointerup', onThumbUp, false);
      } else {
        addGlobalListener(window, 'mouseup', onThumbUp, false);
        addGlobalListener(window, 'touchend', onThumbUp, false);
      }
    }
  };

  let onThumbUp = (e) => {
    let id = e.pointerId ?? e.changedTouches?.[0].identifier;
    if (id === currentPointer.current) {
      valueChangedViaKeyboard.current = false;
      focusInput();
      state.setDragging(false);
      currentPointer.current = undefined;
      isOnColorArea.current = false;

      if (typeof PointerEvent !== 'undefined') {
        removeGlobalListener(window, 'pointerup', onThumbUp, false);
      } else {
        removeGlobalListener(window, 'mouseup', onThumbUp, false);
        removeGlobalListener(window, 'touchend', onThumbUp, false);
      }
    }
  };

  let onColorAreaDown = (colorArea: Element, id: number | null, clientX: number, clientY: number) => {
    let rect = colorArea.getBoundingClientRect();
    let {width, height} = rect;
    let x = (clientX - rect.x) / width;
    let y = (clientY - rect.y) / height;
    if (direction === 'rtl') {
      x = 1 - x;
    }
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1 && !state.isDragging && currentPointer.current === undefined) {
      isOnColorArea.current = true;
      valueChangedViaKeyboard.current = false;
      currentPointer.current = id;
      state.setColorFromPoint(x, y);

      focusInput();
      state.setDragging(true);

      if (typeof PointerEvent !== 'undefined') {
        addGlobalListener(window, 'pointerup', onColorAreaUp, false);
      } else {
        addGlobalListener(window, 'mouseup', onColorAreaUp, false);
        addGlobalListener(window, 'touchend', onColorAreaUp, false);
      }
    }
  };

  let onColorAreaUp = (e) => {
    let id = e.pointerId ?? e.changedTouches?.[0].identifier;
    if (isOnColorArea.current && id === currentPointer.current) {
      isOnColorArea.current = false;
      valueChangedViaKeyboard.current = false;
      currentPointer.current = undefined;
      state.setDragging(false);
      focusInput();

      if (typeof PointerEvent !== 'undefined') {
        removeGlobalListener(window, 'pointerup', onColorAreaUp, false);
      } else {
        removeGlobalListener(window, 'mouseup', onColorAreaUp, false);
        removeGlobalListener(window, 'touchend', onColorAreaUp, false);
      }
    }
  };

  let colorAreaInteractions = isDisabled ? {} : mergeProps({
    ...(typeof PointerEvent !== 'undefined' ? {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse' && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
          return;
        }
        onColorAreaDown(e.currentTarget, e.pointerId, e.clientX, e.clientY);
      }} : {
        onMouseDown: (e: React.MouseEvent) => {
          if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey) {
            return;
          }
          onColorAreaDown(e.currentTarget, undefined, e.clientX, e.clientY);
        },
        onTouchStart: (e: React.TouchEvent) => {
          onColorAreaDown(e.currentTarget, e.changedTouches[0].identifier, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      })
  }, movePropsContainer);

  let thumbInteractions = isDisabled ? {} : mergeProps({
    ...(typeof PointerEvent !== 'undefined' ? {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse' && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
          return;
        }
        onThumbDown(e.pointerId);
      }} : {
        onMouseDown: (e: React.MouseEvent) => {
          if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey) {
            return;
          }
          onThumbDown(undefined);
        },
        onTouchStart: (e: React.TouchEvent) => {
          onThumbDown(e.changedTouches[0].identifier);
        }
      })
  }, focusWithinProps, keyboardProps, movePropsThumb);

  let {focusProps: xInputFocusProps} = useFocus({
    onFocus: () => {
      focusedInputRef.current = inputXRef.current;
    }
  });

  let {focusProps: yInputFocusProps} = useFocus({
    onFocus: () => {
      focusedInputRef.current = inputYRef.current;
    }
  });

  let isMobile = isIOS() || isAndroid();

  function getAriaValueTextForChannel(channel:ColorChannel) {
    return (
      valueChangedViaKeyboard.current ?
      formatMessage('colorNameAndValue', {name: state.value.getChannelName(channel, locale), value: state.value.formatChannelValue(channel, locale)})
      :
      [
        formatMessage('colorNameAndValue', {name: state.value.getChannelName(channel, locale), value: state.value.formatChannelValue(channel, locale)}),
        formatMessage('colorNameAndValue', {name: state.value.getChannelName(channel === yChannel ? xChannel : yChannel, locale), value: state.value.formatChannelValue(channel === yChannel ? xChannel : yChannel, locale)})
      ].join(', ')
    );
  }

  let colorPickerLabel = formatMessage('colorPicker');

  let xInputLabellingProps = useLabels({
    ...props,
    'aria-label': ariaLabel ? formatMessage('colorInputLabel', {label: ariaLabel, channelLabel: colorPickerLabel}) : colorPickerLabel
  });

  let yInputLabellingProps = useLabels({
    ...props,
    'aria-label': ariaLabel ? formatMessage('colorInputLabel', {label: ariaLabel, channelLabel: colorPickerLabel}) : colorPickerLabel
  });

  let colorAriaLabellingProps = useLabels(
    {
      ...props,
      'aria-label': ariaLabel ? `${ariaLabel} ${colorPickerLabel}` : undefined
    },
    isMobile ? colorPickerLabel : undefined
  );

  let ariaRoleDescription = formatMessage('twoDimensionalSlider');

  let {visuallyHiddenProps} = useVisuallyHidden({style: {
    opacity: '0.0001',
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  }});

  let {
    colorAreaStyleProps,
    gradientStyleProps,
    thumbStyleProps
  } = useColorAreaGradient({
    direction,
    state,
    xChannel,
    zChannel,
    isDisabled: props.isDisabled
  });

  return {
    colorAreaProps: {
      ...colorAriaLabellingProps,
      ...colorAreaInteractions,
      ...colorAreaStyleProps,
      role: 'group'
    },
    gradientProps: {
      ...gradientStyleProps,
      role: 'presentation'
    },
    thumbProps: {
      ...thumbInteractions,
      ...thumbStyleProps,
      role: 'presentation'
    },
    xInputProps: {
      ...xInputLabellingProps,
      ...visuallyHiddenProps,
      ...xInputFocusProps,
      type: 'range',
      min: state.value.getChannelRange(xChannel).minValue,
      max: state.value.getChannelRange(xChannel).maxValue,
      step: xChannelStep,
      'aria-roledescription': ariaRoleDescription,
      'aria-valuetext': getAriaValueTextForChannel(xChannel),
      disabled: isDisabled,
      value: state.value.getChannelValue(xChannel),
      tabIndex: (isMobile || !focusedInputRef.current || focusedInputRef.current === inputXRef.current ? undefined : -1),
      /*
        So that only a single "2d slider" control shows up when listing form elements for screen readers,
        add aria-hidden="true" to the unfocused control when the value has not changed via the keyboard,
        but remove aria-hidden to reveal the input for each channel when the value has changed with the keyboard.
      */
      'aria-hidden': (!isMobile && focusedInputRef.current === inputYRef.current && !valueChangedViaKeyboard.current ? 'true' : undefined),
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        state.setXValue(parseFloat(e.target.value));
      }
    },
    yInputProps: {
      ...yInputLabellingProps,
      ...visuallyHiddenProps,
      ...yInputFocusProps,
      type: 'range',
      min: state.value.getChannelRange(yChannel).minValue,
      max: state.value.getChannelRange(yChannel).maxValue,
      step: yChannelStep,
      'aria-roledescription': ariaRoleDescription,
      'aria-valuetext': getAriaValueTextForChannel(yChannel),
      'aria-orientation': 'vertical',
      disabled: isDisabled,
      value: state.value.getChannelValue(yChannel),
      tabIndex: (isMobile || focusedInputRef.current === inputYRef.current ? undefined : -1),
      /*
        So that only a single "2d slider" control shows up when listing form elements for screen readers,
        add aria-hidden="true" to the unfocused input when the value has not changed via the keyboard,
        but remove aria-hidden to reveal the input for each channel when the value has changed with the keyboard.
      */
      'aria-hidden': (isMobile || focusedInputRef.current === inputYRef.current || valueChangedViaKeyboard.current ? undefined : 'true'),
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        state.setYValue(parseFloat(e.target.value));
      }
    }
  };
}
