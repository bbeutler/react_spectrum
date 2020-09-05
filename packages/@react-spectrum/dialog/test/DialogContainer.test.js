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

import {act, fireEvent, render, triggerPress, within} from '@react-spectrum/test-utils';
import {DialogContainerExample, MenuExample} from '../stories/DialogContainerExamples';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {theme} from '@react-spectrum/theme-default';

describe('DialogContainer', function () {
  beforeAll(() => {
    jest.useFakeTimers('legacy');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });

  afterEach(() => {
    jest.runAllTimers();
    window.requestAnimationFrame.mockRestore();
  });

  it('should open and close a dialog based on controlled state', function () {
    let {getByRole, queryByRole} = render(
      <Provider theme={theme}>
        <DialogContainerExample />
      </Provider>
    );

    let button = getByRole('button');
    expect(queryByRole('dialog')).toBeNull();

    triggerPress(button);
    act(() => {jest.runAllTimers();});

    let dialog = getByRole('dialog');
    expect(document.activeElement).toBe(dialog);

    button = within(dialog).getByText('Confirm');

    triggerPress(button);
    act(() => {jest.runAllTimers();});

    expect(queryByRole('dialog')).toBeNull();
  });

  it('should support closing a dialog via the Escape key', function () {
    let {getByRole, queryByRole} = render(
      <Provider theme={theme}>
        <DialogContainerExample />
      </Provider>
    );

    let button = getByRole('button');
    expect(queryByRole('dialog')).toBeNull();

    triggerPress(button);
    act(() => {jest.runAllTimers();});

    let dialog = getByRole('dialog');
    expect(document.activeElement).toBe(dialog);

    fireEvent.keyDown(dialog, {key: 'Escape'});
    fireEvent.keyUp(dialog, {key: 'Escape'});
    act(() => {jest.runAllTimers();});

    expect(queryByRole('dialog')).toBeNull();
  });

  it('should not close a dialog via the Escape key if isKeyboardDismissDisabled', function () {
    let {getByRole, queryByRole} = render(
      <Provider theme={theme}>
        <DialogContainerExample isKeyboardDismissDisabled />
      </Provider>
    );

    let button = getByRole('button');
    expect(queryByRole('dialog')).toBeNull();

    triggerPress(button);
    act(() => {jest.runAllTimers();});

    let dialog = getByRole('dialog');
    expect(document.activeElement).toBe(dialog);

    fireEvent.keyDown(dialog, {key: 'Escape'});
    fireEvent.keyUp(dialog, {key: 'Escape'});
    act(() => {jest.runAllTimers();});

    expect(getByRole('dialog')).toBeVisible();
  });

  it('should not close when clicking outside the dialog by default', function () {
    let {getByRole, queryByRole} = render(
      <Provider theme={theme}>
        <DialogContainerExample />
      </Provider>
    );

    let button = getByRole('button');
    expect(queryByRole('dialog')).toBeNull();

    triggerPress(button);
    act(() => {jest.runAllTimers();});

    expect(getByRole('dialog')).toBeVisible();

    triggerPress(document.body);
    act(() => {jest.runAllTimers();});

    expect(getByRole('dialog')).toBeVisible();
  });

  it('should close when clicking outside the dialog when isDismissible', function () {
    let {getByRole, queryByRole} = render(
      <Provider theme={theme}>
        <DialogContainerExample isDismissable />
      </Provider>
    );

    let button = getByRole('button');
    expect(queryByRole('dialog')).toBeNull();

    triggerPress(button);
    act(() => {jest.runAllTimers();});

    expect(getByRole('dialog')).toBeVisible();

    triggerPress(document.body);
    act(() => {jest.runAllTimers();});

    expect(queryByRole('dialog')).toBeNull();
  });

  it('should not close the dialog when a trigger unmounts', function () {
    let {getByRole, queryByRole} = render(
      <Provider theme={theme}>
        <MenuExample />
      </Provider>
    );

    let button = getByRole('button');
    expect(queryByRole('dialog')).toBeNull();

    triggerPress(button);
    act(() => {jest.runAllTimers();});

    expect(queryByRole('dialog')).toBeNull();

    let menu = getByRole('menu');
    let menuitem = within(menu).getByRole('menuitem');

    triggerPress(menuitem);
    act(() => {jest.runAllTimers();});

    expect(queryByRole('menu')).toBeNull();
    expect(queryByRole('menuitem')).toBeNull();

    let dialog = getByRole('dialog');
    button = within(dialog).getByText('Confirm');

    triggerPress(button);
    act(() => {jest.runAllTimers();});

    expect(queryByRole('dialog')).toBeNull();
  });
});
