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

import {actHook as act, renderHook} from '@react-spectrum/test-utils';
import React from 'react';
import {usePaginationState} from '../';

describe('usePaginationState tests', function () {

  let setValue = jest.fn();
  let onIncrement = jest.fn();
  let onDecrement = jest.fn();
  let state = {};
  let maxValue = 20;

  beforeEach(() => {
    state.value = 1;
    state.onChange = setValue;
    state.onIncrement = onIncrement;
    state.onDecrement = onDecrement;
    state.ref = {current: 1};
  });

  afterEach(() => {
    setValue.mockClear();
    state.value = 1;
    state.ref = {};
    state.onChange.mockClear();
    state.onIncrement.mockClear();
    state.onDecrement.mockClear();
  });

  it('should have correct type', function () {
    let props = {defaultValue: 1};
    const {result} = renderHook(() => usePaginationState(props, state));
    expect(typeof result.current.ref).toBe('object');
    expect(typeof result.current.onChange).toBe('function');
    expect(typeof result.current.value).toBe('number');
    expect(typeof result.current.onDecrement).toBe('function');
    expect(typeof result.current.onIncrement).toBe('function');
  });

  it('renders with default value', function () {
    let props = {defaultValue: 1};
    const {result} = renderHook(() => usePaginationState(props));
    expect(result.current.value).toEqual(props.defaultValue);
    expect(result.current.ref.current).toEqual(props.defaultValue);
  });

  it('renders with changed value', function () {
    let props = {value: 2, defaultValue: 1};
    const {result} = renderHook(() => usePaginationState(props));
    expect(result.current.value).toEqual(2);
    expect(result.current.ref.current).toEqual(2);
  });

  it('test onPageInputChange', function () {
    let props = {defaultValue: 1, maxValue: maxValue};
    const {result} = renderHook(() => usePaginationState(props));
    act(() => result.current.onChange(5));
    expect(result.current.value).toEqual(5);
    expect(result.current.ref.current).toEqual(5);
  });

  it('should be controlled if props.value is defined', function () {
    let props = {value: 2, defaultValue: 1, maxValue: maxValue};
    const {result} = renderHook(() => usePaginationState(props));
    act(() => result.current.onChange(5));
    expect(result.current.value).toEqual(props.value);
  });

  it('test invalid state value : character', function () {
    let props = {defaultValue: 1, maxValue: maxValue};
    const {result} = renderHook(() => usePaginationState(props));
    act(() => result.current.onChange('a'));
    expect(result.current.value).toEqual(props.defaultValue);
    expect(result.current.ref.current).toEqual(props.defaultValue);
  });

  it('test invalid state value : value > maxValue', function () {
    let props = {defaultValue: 1, maxValue: maxValue};
    const {result} = renderHook(() => usePaginationState(props));
    act(() => result.current.onChange(maxValue + 1));
    expect(result.current.value).toEqual(props.defaultValue);
    expect(result.current.ref.current).toEqual(props.defaultValue);
  });

  it('test empty state value', function () {
    let props = {defaultValue: 1, maxValue: maxValue};
    const {result} = renderHook(() => usePaginationState(props));
    act(() => result.current.onChange(''));
    expect(result.current.value).toEqual('');
    expect(result.current.ref.current).toEqual('');
  });

  it('test onIncrement', function () {
    let props = {defaultValue: 1, maxValue: maxValue};
    const {result} = renderHook(() => usePaginationState(props));
    act(() => result.current.onIncrement());
    expect(result.current.value).toEqual(2);
    expect(result.current.ref.current).toEqual(2);
  });

  it('test onDecrement', function () {
    state.value = 2;
    let props = {defaultValue: 1, maxValue: maxValue};
    const {result} = renderHook(() => usePaginationState(props));
    act(() => result.current.onDecrement());
    expect(result.current.value).toEqual(1);
    expect(result.current.ref.current).toEqual(1);
  });
});
