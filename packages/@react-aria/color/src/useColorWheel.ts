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

import {AriaColorWheelProps} from '@react-types/color';
import {ColorWheelState} from '@react-stately/color';
import {focusWithoutScrolling, mergeProps, useGlobalListeners, useLabels} from '@react-aria/utils';
import React, {ChangeEvent, HTMLAttributes, InputHTMLAttributes, RefObject, useCallback, useRef} from 'react';
import {useKeyboard, useMove} from '@react-aria/interactions';
import {useLocale} from '@react-aria/i18n';

interface ColorWheelAriaProps extends AriaColorWheelProps {
  /** The outer radius of the color wheel. */
  outerRadius: number,
  /** The inner radius of the color wheel. */
  innerRadius: number
}

interface ColorWheelAria {
  /** Props for the track element. */
  trackProps: HTMLAttributes<HTMLElement>,
  /** Props for the thumb element. */
  thumbProps: HTMLAttributes<HTMLElement>,
  /** Props for the visually hidden range input element. */
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

/**
 * Provides the behavior and accessibility implementation for a color wheel component.
 * Color wheels allow users to adjust the hue of an HSL or HSB color value on a circular track.
 */
export function useColorWheel(props: ColorWheelAriaProps, state: ColorWheelState, inputRef: RefObject<HTMLElement>): ColorWheelAria {
  let {
    isDisabled,
    innerRadius,
    outerRadius,
    'aria-label': ariaLabel
  } = props;

  let {addGlobalListener, removeGlobalListener} = useGlobalListeners();

  let thumbRadius = (innerRadius + outerRadius) / 2;

  let focusInput = useCallback(() => {
    if (inputRef.current) {
      focusWithoutScrolling(inputRef.current);
    }
  }, [inputRef]);

  let stateRef = useRef<ColorWheelState>(null);
  stateRef.current = state;

  let currentPosition = useRef<{x: number, y: number}>(null);

  let {keyboardProps} = useKeyboard({
    onKeyDown(e) {
      // these are the cases that useMove doesn't handle
      if (!/^(PageUp|PageDown)$/.test(e.key)) {
        e.continuePropagation();
        return;
      }
      // same handling as useMove, don't need to stop propagation, useKeyboard will do that for us
      e.preventDefault();
      // remember to set this and unset it so that onChangeEnd is fired
      stateRef.current.setDragging(true);
      switch (e.key) {
        case 'PageUp':
          e.preventDefault();
          state.increment(stateRef.current.pageStep);
          break;
        case 'PageDown':
          e.preventDefault();
          state.decrement(stateRef.current.pageStep);
          break;
      }
      stateRef.current.setDragging(false);
    }
  });

  let moveHandler = {
    onMoveStart() {
      currentPosition.current = null;
      state.setDragging(true);
    },
    onMove({deltaX, deltaY, pointerType, shiftKey}) {
      if (currentPosition.current == null) {
        currentPosition.current = stateRef.current.getThumbPosition(thumbRadius);
      }
      currentPosition.current.x += deltaX;
      currentPosition.current.y += deltaY;
      if (pointerType === 'keyboard') {
        if (deltaX > 0 || deltaY < 0) {
          state.increment(shiftKey ? stateRef.current.pageStep : stateRef.current.step);
        } else if (deltaX < 0 || deltaY > 0) {
          state.decrement(shiftKey ? stateRef.current.pageStep : stateRef.current.step);
        }
      } else {
        stateRef.current.setHueFromPoint(currentPosition.current.x, currentPosition.current.y, thumbRadius);
      }
    },
    onMoveEnd() {
      isOnTrack.current = undefined;
      state.setDragging(false);
      focusInput();
    }
  };
  let {moveProps: movePropsThumb} = useMove(moveHandler);

  let currentPointer = useRef<number | null | undefined>(undefined);
  let isOnTrack = useRef<boolean>(false);
  let {moveProps: movePropsContainer} = useMove({
    onMoveStart() {
      if (isOnTrack.current) {
        moveHandler.onMoveStart();
      }
    },
    onMove(e) {
      if (isOnTrack.current) {
        moveHandler.onMove(e);
      }
    },
    onMoveEnd() {
      if (isOnTrack.current) {
        moveHandler.onMoveEnd();
      }
    }
  });

  let onThumbDown = (id: number | null) => {
    if (!state.isDragging) {
      currentPointer.current = id;
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
      focusInput();
      state.setDragging(false);
      currentPointer.current = undefined;
      isOnTrack.current = false;

      if (typeof PointerEvent !== 'undefined') {
        removeGlobalListener(window, 'pointerup', onThumbUp, false);
      } else {
        removeGlobalListener(window, 'mouseup', onThumbUp, false);
        removeGlobalListener(window, 'touchend', onThumbUp, false);
      }
    }
  };

  let onTrackDown = (track: Element, id: number | null, pageX: number, pageY: number) => {
    let rect = track.getBoundingClientRect();
    let x = pageX - rect.x - rect.width / 2;
    let y = pageY - rect.y - rect.height / 2;
    let radius = Math.sqrt(x * x + y * y);
    if (innerRadius < radius && radius < outerRadius && !state.isDragging && currentPointer.current === undefined) {
      isOnTrack.current = true;
      currentPointer.current = id;
      stateRef.current.setHueFromPoint(x, y, radius);

      focusInput();
      state.setDragging(true);

      if (typeof PointerEvent !== 'undefined') {
        addGlobalListener(window, 'pointerup', onTrackUp, false);
      } else {
        addGlobalListener(window, 'mouseup', onTrackUp, false);
        addGlobalListener(window, 'touchend', onTrackUp, false);
      }
    }
  };

  let onTrackUp = (e) => {
    let id = e.pointerId ?? e.changedTouches?.[0].identifier;
    if (isOnTrack.current && id === currentPointer.current) {
      isOnTrack.current = false;
      currentPointer.current = undefined;
      state.setDragging(false);
      focusInput();


      if (typeof PointerEvent !== 'undefined') {
        removeGlobalListener(window, 'pointerup', onTrackUp, false);
      } else {
        removeGlobalListener(window, 'mouseup', onTrackUp, false);
        removeGlobalListener(window, 'touchend', onTrackUp, false);
      }
    }
  };

  let trackInteractions = isDisabled ? {} : mergeProps({
    ...(typeof PointerEvent !== 'undefined' ? {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse' && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
          return;
        }
        onTrackDown(e.currentTarget, e.pointerId, e.clientX, e.clientY);
      }} : {
        onMouseDown: (e: React.MouseEvent) => {
          if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey) {
            return;
          }
          onTrackDown(e.currentTarget, undefined, e.clientX, e.clientY);
        },
        onTouchStart: (e: React.TouchEvent) => {
          onTrackDown(e.currentTarget, e.changedTouches[0].identifier, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      })
  }, movePropsContainer);

  let thumbInteractions = isDisabled ? {} : mergeProps({
    onMouseDown: (e: React.MouseEvent) => {
      if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }
      onThumbDown(undefined);
    },
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse' && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
        return;
      }
      onThumbDown(e.pointerId);
    },
    onTouchStart: (e: React.TouchEvent) => {
      onThumbDown(e.changedTouches[0].identifier);
    }
  }, keyboardProps, movePropsThumb);
  let {x, y} = state.getThumbPosition(thumbRadius);

  // Provide a default aria-label if none is given
  let {locale} = useLocale();
  if (ariaLabel == null && props['aria-labelledby'] == null) {
    ariaLabel = state.value.getChannelName('hue', locale);
  }

  let inputLabellingProps = useLabels({
    ...props,
    'aria-label': ariaLabel
  });

  let {minValue, maxValue, step} = state.value.getChannelRange('hue');
  return {
    trackProps: {
      ...trackInteractions,
      style: {
        position: 'relative',
        touchAction: 'none',
        width: outerRadius * 2,
        height: outerRadius * 2,
        background: `
          conic-gradient(
            from 90deg,
            hsl(0, 100%, 50%),
            hsl(30, 100%, 50%),
            hsl(60, 100%, 50%),
            hsl(90, 100%, 50%),
            hsl(120, 100%, 50%),
            hsl(150, 100%, 50%),
            hsl(180, 100%, 50%),
            hsl(210, 100%, 50%),
            hsl(240, 100%, 50%),
            hsl(270, 100%, 50%),
            hsl(300, 100%, 50%),
            hsl(330, 100%, 50%),
            hsl(360, 100%, 50%)
          )
        `,
        clipPath: `path(evenodd, "${circlePath(outerRadius, outerRadius, outerRadius)} ${circlePath(outerRadius, outerRadius, innerRadius)}")`
      }
    },
    thumbProps: {
      ...thumbInteractions,
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        touchAction: 'none'
      }
    },
    inputProps: mergeProps(
      inputLabellingProps,
      {
        type: 'range',
        min: String(minValue),
        max: String(maxValue),
        step: String(step),
        'aria-valuetext': state.value.formatChannelValue('hue', locale),
        disabled: isDisabled,
        value: `${state.value.getChannelValue('hue')}`,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          state.setHue(parseFloat(e.target.value));
        }
      }
    )
  };
}

// Creates an SVG path string for a circle.
function circlePath(cx: number, cy: number, r: number) {
  return `M ${cx}, ${cy} m ${-r}, 0 a ${r}, ${r}, 0, 1, 0, ${r * 2}, 0 a ${r}, ${r}, 0, 1, 0 ${-r * 2}, 0`;
}
