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

import {act, fireEvent, render, waitFor} from '@react-spectrum/test-utils';
import {Dialog} from '@react-spectrum/dialog';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {theme} from '@react-spectrum/theme-default';
import {Tray} from '../';

describe('Tray', function () {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it('should render nothing if isOpen is not set', function () {
    let {queryByRole} = render(
      <Provider theme={theme}>
        <Tray>
          <div role="dialog">contents</div>
        </Tray>
      </Provider>
    );

    expect(queryByRole('dialog')).toBeNull();
    expect(document.documentElement).not.toHaveStyle('overflow: hidden');
  });

  it('should render when isOpen is true', function () {
    let {getByRole} = render(
      <Provider theme={theme}>
        <Tray isOpen>
          <div role="dialog">contents</div>
        </Tray>
      </Provider>
    );

    let dialog = getByRole('dialog');
    expect(dialog).toBeVisible();
    expect(document.documentElement).toHaveStyle('overflow: hidden');
  });

  it('hides the tray when pressing the escape key', async function () {
    let onClose = jest.fn();
    let {getByRole} = render(
      <Provider theme={theme}>
        <Tray isOpen onClose={onClose}>
          <div role="dialog">contents</div>
        </Tray>
      </Provider>
    );

    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    }); // wait for animation
    act(() => {jest.runAllTimers();});

    let dialog = await getByRole('dialog');
    fireEvent.keyDown(dialog, {key: 'Escape'});
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides the tray when clicking outside', async function () {
    let onClose = jest.fn();
    let {getByRole} = render(
      <Provider theme={theme}>
        <Tray isOpen onClose={onClose}>
          <div role="dialog">contents</div>
        </Tray>
      </Provider>
    );

    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    }); // wait for animation
    act(() => {jest.runAllTimers();});

    fireEvent.mouseDown(document.body);
    fireEvent.mouseUp(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides the tray on blur when shouldCloseOnBlur is true', async function () {
    let onClose = jest.fn();
    let {getByRole} = render(
      <Provider theme={theme}>
        <Tray isOpen onClose={onClose} shouldCloseOnBlur>
          <Dialog>contents</Dialog>
        </Tray>
      </Provider>
    );

    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    }); // wait for animation
    act(() => {jest.runAllTimers();});

    let dialog = await getByRole('dialog');
    expect(document.activeElement).toBe(dialog);
    // The iOS Safari workaround blurs and refocuses the dialog after 0.5s
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => {dialog.blur();});
    // (The iOS Safari workaround) + (the actual onClose) = 2
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
