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

import AlertMedium from '@spectrum-icons/ui/AlertMedium';
import {AriaButtonProps} from '@react-types/button';
import CheckmarkMedium from '@spectrum-icons/ui/CheckmarkMedium';
import {classNames} from '@react-spectrum/utils';
import {ClearButton} from '@react-spectrum/button';
import {ComboBoxState, useComboBoxState} from '@react-stately/combobox';
import {DismissButton} from '@react-aria/overlays';
import {Field} from '@react-spectrum/label';
import {FocusableRef, ValidationState} from '@react-types/shared';
import {FocusRing, FocusScope} from '@react-aria/focus';
import {focusSafely} from '@react-aria/focus';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {ListBoxBase, useListBoxLayout} from '@react-spectrum/listbox';
import Magnifier from '@spectrum-icons/ui/Magnifier';
import {mergeProps, useId} from '@react-aria/utils';
import {ProgressCircle} from '@react-spectrum/progress';
import React, {HTMLAttributes, ReactElement, ReactNode, RefObject, useCallback, useEffect, useRef, useState} from 'react';
import searchAutocompleteStyles from './searchautocomplete.css';
import searchStyles from '@adobe/spectrum-css-temp/components/search/vars.css';
import {setInteractionModality, useHover} from '@react-aria/interactions';
import {SpectrumSearchAutocompleteProps} from '@react-types/autocomplete';
import styles from '@adobe/spectrum-css-temp/components/inputgroup/vars.css';
import {TextFieldBase} from '@react-spectrum/textfield';
import textfieldStyles from '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {Tray} from '@react-spectrum/overlays';
import {useButton} from '@react-aria/button';
import {useDialog} from '@react-aria/dialog';
import {useFilter, useMessageFormatter} from '@react-aria/i18n';
import {useFocusableRef} from '@react-spectrum/utils';
import {useLabel} from '@react-aria/label';
import {useOverlayTrigger} from '@react-aria/overlays';
import {useProviderProps} from '@react-spectrum/provider';
import {useSearchAutocomplete} from '@react-aria/autocomplete';

export const MobileSearchAutocomplete = React.forwardRef(function MobileSearchAutocomplete<T extends object>(props: SpectrumSearchAutocompleteProps<T>, ref: FocusableRef<HTMLElement>) {
  props = useProviderProps(props);

  let {
    isQuiet,
    isDisabled,
    validationState,
    isReadOnly,
    onSubmit = () => {}
  } = props;

  let {contains} = useFilter({sensitivity: 'base'});
  let state = useComboBoxState({
    ...props,
    defaultFilter: contains,
    allowsEmptyCollection: true,
    // Needs to be false here otherwise we double up on commitSelection/commitCustomValue calls when
    // user taps on underlay (i.e. initial tap will call setFocused(false) -> commitSelection/commitCustomValue via onBlur,
    // then the closing of the tray will call setFocused(false) again due to cleanup effect)
    shouldCloseOnBlur: false,
    allowsCustomValue: true,
    onSelectionChange: (key) => key !== null && onSubmit(null, key),
    selectedKey: undefined,
    defaultSelectedKey: undefined
  });
  
  let buttonRef = useRef<HTMLElement>();
  let domRef = useFocusableRef(ref, buttonRef);
  let {triggerProps, overlayProps} = useOverlayTrigger({type: 'listbox'}, state, buttonRef);

  let {labelProps, fieldProps} = useLabel({
    ...props,
    labelElementType: 'span'
  });

  // Focus the button and show focus ring when clicking on the label
  labelProps.onClick = () => {
    if (!props.isDisabled) {
      buttonRef.current.focus();
      setInteractionModality('keyboard');
    }
  };

  let onClose = () => state.commit();

  return (
    <>
      <Field
        {...props}
        labelProps={labelProps}
        elementType="span"
        ref={domRef}
        includeNecessityIndicatorInAccessibilityName>
        <SearchAutocompleteButton
          {...mergeProps(triggerProps, fieldProps, {autoFocus: props.autoFocus})}
          ref={buttonRef}
          isQuiet={isQuiet}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          isPlaceholder={!state.inputValue}
          validationState={validationState}
          inputValue={state.inputValue}
          clearInput={() => state.setInputValue('')}
          onPress={() => !isReadOnly && state.open(null, 'manual')}>
          {state.inputValue || props.placeholder || ''}
        </SearchAutocompleteButton>
      </Field>
      <Tray isOpen={state.isOpen} onClose={onClose} isFixedHeight isNonModal {...overlayProps}>
        <SearchAutocompleteTray
          {...props}
          onClose={onClose}
          overlayProps={overlayProps}
          state={state} />
      </Tray>
    </>
  );
});

interface SearchAutocompleteButtonProps extends AriaButtonProps {
  isQuiet?: boolean,
  isDisabled?: boolean,
  isReadOnly?: boolean,
  isPlaceholder?: boolean,
  validationState?: ValidationState,
  inputValue?: string,
  clearInput?: () => void,
  children?: ReactNode,
  style?: React.CSSProperties,
  className?: string
}

const SearchAutocompleteButton = React.forwardRef(function SearchAutocompleteButton(props: SearchAutocompleteButtonProps, ref: RefObject<HTMLElement>) {
  let {
    isQuiet,
    isDisabled,
    isReadOnly,
    isPlaceholder,
    validationState,
    inputValue,
    clearInput,
    children,
    style,
    className
} = props;
  let formatMessage = useMessageFormatter(intlMessages);
  let valueId = useId();
  let invalidId = useId();
  let validationIcon = validationState === 'invalid'
    ? <AlertMedium id={invalidId} aria-label={formatMessage('invalid')} />
    : <CheckmarkMedium />;

  let searchIcon = (
    <Magnifier data-testid="searchicon" />
  );

  let icon = React.cloneElement(searchIcon, {
    UNSAFE_className: classNames(
      textfieldStyles,
      'spectrum-Textfield-icon'
    ),
    size: 'S'
  });

  let clearButton = (
    <ClearButton
      onPress={(e) => {
        clearInput();
        props.onPress(e);
      }}
      preventFocus
      aria-label={formatMessage('clear')}
      excludeFromTabOrder
      UNSAFE_className={
        classNames(
          searchStyles,
          'spectrum-ClearButton'
        )
      }
      isDisabled={isDisabled} />
  );


  let validation = React.cloneElement(validationIcon, {
    UNSAFE_className: classNames(
      textfieldStyles,
      'spectrum-Textfield-validationIcon',
      classNames(
        styles,
        'spectrum-InputGroup-input-validationIcon'
      )
    )
  });

  let {hoverProps, isHovered} = useHover({});
  let {buttonProps} = useButton({
    ...props,
    'aria-labelledby': [
      props['aria-labelledby'],
      props['aria-label'] && !props['aria-labelledby'] ? props.id : null,
      valueId,
      validationState === 'invalid' ? invalidId : null
    ].filter(Boolean).join(' '),
    elementType: 'div'
  }, ref);

  return (
    <FocusRing
      focusClass={classNames(styles, 'is-focused')}
      focusRingClass={classNames(styles, 'focus-ring')}>
      <div
        {...mergeProps(hoverProps, buttonProps)}
        aria-haspopup="dialog"
        ref={ref as RefObject<HTMLDivElement>}
        style={{...style, outline: 'none'}}
        className={
          classNames(
            styles,
            'spectrum-InputGroup',
            {
              'spectrum-InputGroup--quiet': isQuiet,
              'is-disabled': isDisabled,
              'spectrum-InputGroup--invalid': validationState === 'invalid',
              'is-hovered': isHovered
            },
            classNames(
              searchAutocompleteStyles,
              'mobile-searchautocomplete'
            ),
            className
          )
        }>
        <div
          className={
            classNames(
              textfieldStyles,
              'spectrum-Textfield',
              {
                'spectrum-Textfield--invalid': validationState === 'invalid',
                'spectrum-Textfield--valid': validationState === 'valid',
                'spectrum-Textfield--quiet': isQuiet
              },
              classNames(
                searchStyles,
                'spectrum-Search',
                {
                  'is-disabled': isDisabled,
                  'is-quiet': isQuiet,
                  'spectrum-Search--invalid': validationState === 'invalid',
                  'spectrum-Search--valid': validationState === 'valid'
                }
              )
            )
          }>
          <div
            className={
              classNames(
                textfieldStyles,
                'spectrum-Textfield-input',
                'spectrum-Textfield-inputIcon',
                {
                  'is-hovered': isHovered,
                  'is-placeholder': isPlaceholder,
                  'is-disabled': isDisabled,
                  'is-quiet': isQuiet
                },
                classNames(
                  searchStyles,
                  'spectrum-Search-input'
                )
              )
            }>
            {icon}
            <span
              id={valueId}
              className={
                classNames(
                  searchAutocompleteStyles,
                  'mobile-value'
                )
              }>
              {children}
            </span>
          </div>
          {validationState ? validation : null}
          {(inputValue !== '' || validationState != null) && !isReadOnly && clearButton}
        </div>
      </div>
    </FocusRing>
  );
});

interface SearchAutocompleteTrayProps extends SpectrumSearchAutocompleteProps<unknown> {
  state: ComboBoxState<unknown>,
  overlayProps: HTMLAttributes<HTMLElement>,
  loadingIndicator?: ReactElement,
  onClose: () => void
}

function SearchAutocompleteTray(props: SearchAutocompleteTrayProps) {
  let {
    // completionMode = 'suggest',
    state,
    isDisabled,
    validationState,
    label,
    overlayProps,
    loadingState,
    onLoadMore,
    onClose,
    onSubmit
  } = props;

  let timeout = useRef(null);
  let [showLoading, setShowLoading] = useState(false);
  let inputRef = useRef<HTMLInputElement>();
  let popoverRef = useRef<HTMLDivElement>();
  let listBoxRef = useRef<HTMLDivElement>();
  let layout = useListBoxLayout(state);
  let formatMessage = useMessageFormatter(intlMessages);

  let {inputProps, listBoxProps, labelProps, clearButtonProps} = useSearchAutocomplete(
    {
      ...props,
      keyboardDelegate: layout,
      popoverRef: popoverRef,
      listBoxRef,
      inputRef
    },
    state
  );

  React.useEffect(() => {
    focusSafely(inputRef.current);

    // When the tray unmounts, set state.isFocused (i.e. the tray input's focus tracker) to false.
    // This is to prevent state.isFocused from being set to true when the tray closes via tapping on the underlay
    // (FocusScope attempts to restore focus to the tray input when tapping outside the tray due to "contain")
    // Have to do this manually since React doesn't call onBlur when a component is unmounted: https://github.com/facebook/react/issues/12363
    return () => {
      state.setFocused(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let {dialogProps} = useDialog({
    'aria-labelledby': useId(labelProps.id)
  }, popoverRef);

  // Override the role of the input to "searchbox" instead of "combobox".
  // Since the listbox is always visible, the combobox role doesn't really give us anything.
  // VoiceOver on iOS reads "double tap to collapse" when focused on the input rather than
  // "double tap to edit text", as with a textbox or searchbox. We'd like double tapping to
  // open the virtual keyboard rather than closing the tray.
  inputProps.role = 'searchbox';
  inputProps['aria-haspopup'] = 'listbox';
  delete inputProps.onTouchEnd;

  let clearButton = (
    <ClearButton
      {...clearButtonProps}
      preventFocus
      aria-label={formatMessage('clear')}
      excludeFromTabOrder
      UNSAFE_className={
        classNames(
          searchStyles,
          'spectrum-ClearButton'
        )
      }
      isDisabled={isDisabled} />
  );

  let loadingCircle = (
    <ProgressCircle
      aria-label={formatMessage('loading')}
      size="S"
      isIndeterminate
      UNSAFE_className={classNames(
        searchStyles,
        'spectrum-Search-circleLoader',
        classNames(
          textfieldStyles,
          'spectrum-Textfield-circleLoader'
        )
      )} />
  );

  // Close the software keyboard on scroll to give the user a bigger area to scroll.
  // But only do this if scrolling with touch, otherwise it can cause issues with touch
  // screen readers.
  let isTouchDown = useRef(false);
  let onTouchStart = () => {
    isTouchDown.current = true;
  };

  let onTouchEnd = () => {
    isTouchDown.current = false;
  };

  let onScroll = useCallback(() => {
    if (!inputRef.current || document.activeElement !== inputRef.current || !isTouchDown.current) {
      return;
    }

    popoverRef.current.focus();
  }, [inputRef, popoverRef, isTouchDown]);

  let inputValue = inputProps.value;
  let lastInputValue = useRef(inputValue);
  useEffect(() => {
    if (loadingState === 'filtering' && !showLoading) {
      if (timeout.current === null) {
        timeout.current = setTimeout(() => {
          setShowLoading(true);
        }, 500);
      }

      // If user is typing, clear the timer and restart since it is a new request
      if (inputValue !== lastInputValue.current) {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          setShowLoading(true);
        }, 500);
      }
    } else if (loadingState !== 'filtering') {
      // If loading is no longer happening, clear any timers and hide the loading circle
      setShowLoading(false);
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    lastInputValue.current = inputValue;
  }, [loadingState, inputValue, showLoading]);

  let onKeyDown = (e) => {
    // Close virtual keyboard, close tray, and fire onSubmit if user hits Enter w/o any focused options
    if (e.key === 'Enter' && state.selectionManager.focusedKey == null) {
      popoverRef.current.focus();
      onClose();
      onSubmit(inputValue.toString(), null);
    } else {
      inputProps.onKeyDown(e);
    }
  };

  let searchIcon = (
    <Magnifier data-testid="searchicon" />
  );

  let icon = React.cloneElement(searchIcon, {
    UNSAFE_className: classNames(
        textfieldStyles,
        'spectrum-Textfield-icon'
        ),
    size: 'S'
  });

  return (
    <FocusScope restoreFocus contain>
      <div
        {...mergeProps(overlayProps, dialogProps)}
        ref={popoverRef}
        className={
          classNames(
            searchAutocompleteStyles,
            'tray-dialog'
          )
        }>
        <DismissButton onDismiss={onClose} />
        <TextFieldBase
          label={label}
          labelProps={labelProps}
          inputProps={{...inputProps, onKeyDown}}
          inputRef={inputRef}
          isDisabled={isDisabled}
          isLoading={showLoading && loadingState === 'filtering'}
          loadingIndicator={loadingState != null && loadingCircle}
          validationState={validationState}
          wrapperChildren={(state.inputValue !== '' || loadingState === 'filtering' || validationState != null) && !props.isReadOnly && clearButton}
          icon={icon}
          UNSAFE_className={
            classNames(
              searchStyles,
              'spectrum-Search',
              'spectrum-Textfield',
              'spectrum-Search--loadable',
              {
                'spectrum-Search--invalid': validationState === 'invalid',
                'spectrum-Search--valid': validationState === 'valid'
              },
              classNames(
                searchAutocompleteStyles,
                'tray-textfield',
                {
                  'has-label': !!props.label
                }
              )
            )
          }
          inputClassName={
            classNames(
              searchStyles,
              'spectrum-Search-input'
            )
          }
          validationIconClassName={
            classNames(
              searchStyles,
              'spectrum-Search-validationIcon'
            )
          } />
        <ListBoxBase
          {...listBoxProps}
          domProps={{onTouchStart, onTouchEnd}}
          disallowEmptySelection
          shouldSelectOnPressUp
          focusOnPointerEnter
          layout={layout}
          state={state}
          shouldUseVirtualFocus
          renderEmptyState={() => loadingState !== 'loading' && (
            <span className={classNames(searchAutocompleteStyles, 'no-results')}>
              {formatMessage('noResults')}
            </span>
          )}
          UNSAFE_className={
            classNames(
              searchAutocompleteStyles,
              'tray-listbox'
            )
          }
          ref={listBoxRef}
          onScroll={onScroll}
          onLoadMore={onLoadMore}
          isLoading={loadingState === 'loading' || loadingState === 'loadingMore'} />
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
}
