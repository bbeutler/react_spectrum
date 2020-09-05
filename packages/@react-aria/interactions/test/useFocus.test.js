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

import {act, render, waitFor} from '@react-spectrum/test-utils';
import React from 'react';
import {useFocus} from '../';

function Example(props) {
  let {focusProps} = useFocus(props);
  return <div tabIndex={-1} {...focusProps} data-testid="example">{props.children}</div>;
}

describe('useFocus', function () {
  it('handles focus events on the immediate target', function () {
    let events = [];
    let addEvent = (e) => events.push({type: e.type, target: e.target});
    let tree = render(
      <Example
        onFocus={addEvent}
        onBlur={addEvent}
        onFocusChange={isFocused => events.push({type: 'focuschange', isFocused})} />
    );

    let el = tree.getByTestId('example');
    act(() => {el.focus();});
    act(() => {el.blur();});

    expect(events).toEqual([
      {type: 'focus', target: el},
      {type: 'focuschange', isFocused: true},
      {type: 'blur', target: el},
      {type: 'focuschange', isFocused: false}
    ]);
  });

  it('does not handle focus events on children', function () {
    let events = [];
    let addEvent = (e) => events.push({type: e.type, target: e.target});
    let tree = render(
      <Example
        onFocus={addEvent}
        onBlur={addEvent}
        onFocusChange={isFocused => events.push({type: 'focuschange', isFocused})}>
        <div data-testid="child" tabIndex={-1} />
      </Example>
    );

    let el = tree.getByTestId('example');
    let child = tree.getByTestId('child');
    act(() => {child.focus();});
    act(() => {child.blur();});

    expect(events).toEqual([]);

    act(() => {el.focus();});
    act(() => {child.focus();});

    expect(events).toEqual([
      {type: 'focus', target: el},
      {type: 'focuschange', isFocused: true},
      {type: 'blur', target: el},
      {type: 'focuschange', isFocused: false}
    ]);
  });

  it('does not handle focus events if disabled', function () {
    let events = [];
    let addEvent = (e) => events.push({type: e.type, target: e.target});
    let tree = render(
      <Example
        isDisabled
        onFocus={addEvent}
        onBlur={addEvent}
        onFocusChange={isFocused => events.push({type: 'focuschange', isFocused})} />
    );

    let el = tree.getByTestId('example');
    act(() => {el.focus();});
    act(() => {el.blur();});

    expect(events).toEqual([]);
  });

  it('events do not bubble when stopPropagation is called', function () {
    let onWrapperFocus = jest.fn();
    let onWrapperBlur = jest.fn();
    let onInnerFocus = jest.fn(e => e.stopPropagation());
    let onInnerBlur = jest.fn(e => e.stopPropagation());
    let tree = render(
      <div onFocus={onWrapperFocus} onBlur={onWrapperBlur}>
        <Example
          onFocus={onInnerFocus}
          onBlur={onInnerBlur} />
      </div>
    );

    let el = tree.getByTestId('example');
    act(() => {el.focus();});
    act(() => {el.blur();});

    expect(onInnerFocus).toHaveBeenCalledTimes(1);
    expect(onInnerBlur).toHaveBeenCalledTimes(1);
    expect(onWrapperFocus).not.toHaveBeenCalled();
    expect(onWrapperBlur).not.toHaveBeenCalled();
  });

  it('events bubble by default', function () {
    let onWrapperFocus = jest.fn();
    let onWrapperBlur = jest.fn();
    let onInnerFocus = jest.fn();
    let onInnerBlur = jest.fn();
    let tree = render(
      <div onFocus={onWrapperFocus} onBlur={onWrapperBlur}>
        <Example
          onFocus={onInnerFocus}
          onBlur={onInnerBlur} />
      </div>
    );

    let el = tree.getByTestId('example');
    act(() => {el.focus();});
    act(() => {el.blur();});

    expect(onInnerFocus).toHaveBeenCalledTimes(1);
    expect(onInnerBlur).toHaveBeenCalledTimes(1);
    expect(onWrapperFocus).toHaveBeenCalledTimes(1);
    expect(onWrapperBlur).toHaveBeenCalledTimes(1);
  });

  it('should fire onBlur when a focused element is disabled', async function () {
    function Example(props) {
      let {focusProps} = useFocus(props);
      return <button disabled={props.disabled} {...focusProps}>Button</button>;
    }

    let onFocus = jest.fn();
    let onBlur = jest.fn();
    let tree = render(<Example onFocus={onFocus} onBlur={onBlur} />);
    let button = tree.getByRole('button');

    act(() => {button.focus();});
    expect(onFocus).toHaveBeenCalled();
    tree.rerender(<Example disabled onFocus={onFocus} onBlur={onBlur} />);
    // MutationObserver is async
    await waitFor(() => expect(onBlur).toHaveBeenCalled());
  });
});
