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

// @ts-ignore
import intlMessages from '../intl/*.json';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {renderHook} from '@react-spectrum/test-utils';
import {theme} from '@react-spectrum/theme-default';
import {useToast} from '../';

describe('useToast', () => {
  let onClose = jest.fn();
  let onAction = jest.fn();
  let onRemove = jest.fn();

  afterEach(() => {
    onClose.mockClear();
    onAction.mockClear();
  });

  let renderToastHook = (props, state, wrapper) => {
    let {result} = renderHook(() => useToast(props, state), {wrapper});
    return result.current;
  };

  it('handles defaults', function () {
    let {actionButtonProps, closeButtonProps, iconProps, toastProps} = renderToastHook({}, {onRemove});

    expect(toastProps.role).toBe('alert');
    expect(iconProps['aria-label']).toBe(undefined);
    expect(typeof actionButtonProps.onPress).toBe('function');
    expect(closeButtonProps['aria-label']).toBe('Close');
    expect(typeof closeButtonProps.onPress).toBe('function');
  });

  it('variant sets icon aria-label property', function () {
    let {iconProps} = renderToastHook({variant: 'info'}, {onRemove});

    expect(iconProps['aria-label']).toBe('Info');
  });

  it('with a localized aria-label', () => {
    let locale = 'de-DE';
    let wrapper = ({children}) => <Provider locale={locale} theme={theme}>{children}</Provider>;
    let expectedIntl = intlMessages[locale]['info'];
    let {iconProps} = renderToastHook({variant: 'info'}, {onRemove}, wrapper);
    expect(iconProps['aria-label']).toBe(expectedIntl);
  });

  it('handles onClose', function () {
    let {closeButtonProps} = renderToastHook({onClose}, {onRemove});
    closeButtonProps.onPress();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('handles shouldCloseOnAction', function () {
    let {actionButtonProps} = renderToastHook({onClose, onAction, shouldCloseOnAction: true}, {onRemove});
    actionButtonProps.onPress();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('onRemove is called with toastKey', function () {
    let {closeButtonProps} = renderToastHook({toastKey: 'key1'}, {onRemove});
    closeButtonProps.onPress();

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenLastCalledWith('key1');
  });
});
