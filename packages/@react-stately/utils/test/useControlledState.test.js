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

import {actHook as act, act as actDOM, render, renderHook} from '@react-spectrum/test-utils';
import React, {useEffect, useState} from 'react';
import {useControlledState} from '../src';
import userEvent from '@testing-library/user-event';

describe('useControlledState tests', function () {
  it('can handle default setValue behavior, wont invoke onChange for the same value twice in a row', () => {
    let onChangeSpy = jest.fn();
    let {result} = renderHook(() => useControlledState(undefined, 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('defaultValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    act(() => setValue('newValue'));
    [value, setValue] = result.current;
    expect(value).toBe('newValue');
    expect(onChangeSpy).toHaveBeenLastCalledWith('newValue');

    act(() => setValue('newValue2'));
    [value, setValue] = result.current;
    expect(value).toBe('newValue2');
    expect(onChangeSpy).toHaveBeenLastCalledWith('newValue2');

    // clear it so we can check more easily that it's not called in the next expect
    onChangeSpy.mockClear();

    act(() => setValue('newValue2'));
    [value, setValue] = result.current;
    expect(value).toBe('newValue2');
    expect(onChangeSpy).not.toHaveBeenCalled();

    // it should call onChange with a new but not immediately previously run value
    act(() => setValue('newValue'));
    [value, setValue] = result.current;
    expect(value).toBe('newValue');
    expect(onChangeSpy).toHaveBeenLastCalledWith('newValue');
  });

  it('using NaN will only trigger onChange once', () => {
    let onChangeSpy = jest.fn();
    let {result} = renderHook(() => useControlledState(undefined, undefined, onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).not.toBeDefined();
    expect(onChangeSpy).not.toHaveBeenCalled();
    act(() => setValue(NaN));
    [value, setValue] = result.current;
    expect(value).toBe(NaN);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenLastCalledWith(NaN);

    act(() => setValue(NaN));
    [value, setValue] = result.current;
    expect(value).toBe(NaN);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('can handle callback setValue behavior', () => {
    let onChangeSpy = jest.fn();
    let consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    let {result} = renderHook(() => useControlledState(undefined, 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('defaultValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    act(() => setValue((prevValue) => {
      expect(prevValue).toBe('defaultValue');
      return 'newValue';
    }));
    [value, setValue] = result.current;
    expect(value).toBe('newValue');
    expect(onChangeSpy).toHaveBeenLastCalledWith('newValue');
    expect(consoleWarnSpy).toHaveBeenLastCalledWith('We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320');
  });

  it('does not trigger too many renders', () => {
    let renderSpy = jest.fn();

    let TestComponent = (props) => {
      let [state, setState] = useControlledState(props.value, props.defaultValue, props.onChange);
      useEffect(() => renderSpy(), [state]);
      return <button onClick={() => setState((prev) => prev + 1)} data-testid={state} />;
    };

    let TestComponentWrapper = (props) => {
      let [state, setState] = useState(props.defaultValue);
      return <TestComponent onChange={(value) => setState(value)} value={state} />;
    };

    let {getByRole, getByTestId} = render(<TestComponentWrapper defaultValue={5} />);
    let button = getByRole('button');
    getByTestId('5');
    expect(renderSpy).toBeCalledTimes(1);
    actDOM(() =>
      userEvent.click(button)
    );
    getByTestId('6');
    expect(renderSpy).toBeCalledTimes(2);
  });

  it('can handle controlled setValue behavior', () => {
    let onChangeSpy = jest.fn();
    let {result} = renderHook(() => useControlledState('controlledValue', 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();

    act(() => setValue('newValue'));
    [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).toHaveBeenLastCalledWith('newValue');

    onChangeSpy.mockClear();

    act(() => setValue('controlledValue'));
    [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('can handle controlled callback setValue behavior', () => {
    let onChangeSpy = jest.fn();
    let consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    let {result} = renderHook(() => useControlledState('controlledValue', 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();

    act(() => setValue((prevValue) => {
      expect(prevValue).toBe('controlledValue');
      return 'newValue';
    }));
    [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).toHaveBeenLastCalledWith('newValue');

    onChangeSpy.mockClear();

    act(() => setValue((prevValue) => {
      expect(prevValue).toBe('controlledValue');
      return 'controlledValue';
    }));
    [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenLastCalledWith('We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320');
  });

  it('can handle controlled callback setValue behavior after prop change', () => {
    let onChangeSpy = jest.fn();
    let propValue = 'controlledValue';
    let consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    let {result, rerender} = renderHook(() => useControlledState(propValue, 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();

    propValue = 'updated';
    rerender();

    act(() => setValue((prevValue) => {
      expect(prevValue).toBe('updated');
      return 'newValue';
    }));
    [value, setValue] = result.current;
    expect(value).toBe('updated');
    expect(onChangeSpy).toHaveBeenLastCalledWith('newValue');

    onChangeSpy.mockClear();

    act(() => setValue((prevValue) => {
      expect(prevValue).toBe('updated');
      return 'updated';
    }));
    [value, setValue] = result.current;
    expect(value).toBe('updated');
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
    expect(consoleWarnSpy).toHaveBeenLastCalledWith('We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320');

  });

  it('will console warn if the programmer tries to switch from controlled to uncontrolled', () => {
    let onChangeSpy = jest.fn();
    let consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    let {result, rerender} = renderHook(
      ({value, defaultValue, onChange}) => useControlledState(value, defaultValue, onChange),
      {
        initialProps: {
          value: 'controlledValue',
          defaultValue: 'defaultValue',
          onChange: onChangeSpy
        }
      }
    );
    let [value] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    rerender({value: undefined, defaultValue: 'defaultValue', onChange: onChangeSpy});
    expect(consoleWarnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');
  });

  it('will console warn if the programmer tries to switch from uncontrolled to controlled', () => {
    let onChangeSpy = jest.fn();
    let consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    let {result, rerender} = renderHook(
      ({value, defaultValue, onChange}) => useControlledState(value, defaultValue, onChange),
      {
        initialProps: {
          value: undefined,
          defaultValue: 'defaultValue',
          onChange: onChangeSpy
        }
      }
    );
    let [value] = result.current;
    expect(value).toBe('defaultValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    rerender({value: 'controlledValue', defaultValue: 'defaultValue', onChange: onChangeSpy});
    expect(consoleWarnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
  });
});
