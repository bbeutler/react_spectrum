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

import {act, fireEvent, render, typeText, waitFor} from '@react-spectrum/test-utils';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import React from 'react';
import {SearchField} from '@react-spectrum/searchfield';
import {TextArea, TextField} from '../';
import userEvent from '@testing-library/user-event';

let testId = 'test-id';
let inputText = 'blah';

function renderComponent(Component, props) {
  return render(<Component {...props} data-testid={testId} />);
}

// Note: Running this test suite will result in some warnings of the following class:
// 1. "Textfield contains an input of type search with both value and defaultValue props.  This is a v2 SearchField issue
// 2. Various warnings about componentWillReceiveProps and componentDidUpdate. Prob a TODO to update v2 components so we don't use these renamed/deprecated lifecycle methods

describe('Shared TextField behavior', () => {
  let onBlur = jest.fn();
  let onChange = jest.fn();
  let onFocus = jest.fn();

  afterEach(() => {
    onChange.mockClear();
    onBlur.mockClear();
    onFocus.mockClear();
  });

  // Omitting v3 TextField and TextArea for now since we need https://jira.corp.adobe.com/browse/RSP-1182 to compensate
  it.each`
    Name                | Component         | props
    ${'v3 SearchField'} | ${SearchField}    | ${{UNSAFE_className: 'custom-class-name', 'aria-label': 'mandatory label'}}
  `('$Name supports appending custom classnames onto the root element', ({Component, props}) => {
    let tree = renderComponent(Component, props);
    expect(tree.container.querySelector('body>div> .custom-class-name')).toBeTruthy();
  });

  it.each`
    Name                | Component        | expectedType | expectedTagName
    ${'v3 TextField'}   | ${TextField}     | ${'text'}    | ${'INPUT'}
    ${'v3 TextArea'}    | ${TextArea}      | ${'text'}    | ${'TEXTAREA'}
    ${'v3 SearchField'} | ${SearchField}   | ${'search'}  | ${'INPUT'}
  `('$Name renders with default textfield behavior', ({Name, Component, expectedType, expectedTagName}) => {
    let tree = renderComponent(Component, {'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    expect(input.value).toBe('');
    typeText(input, inputText);
    expect(input.value).toBe(inputText);
    if (Name === 'v3 TextArea') {
      expect(input).not.toHaveAttribute('type');
    } else {
      expect(input).toHaveAttribute('type', expectedType);
    }
    expect(input.tagName).toBe(expectedTagName);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name allow custom naming', ({Name, Component}) => {
    let name = 'blah';
    let tree = renderComponent(Component, {name, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    expect(input).toHaveAttribute('name', name);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name renders with placeholder text and shows warning', ({Name, Component}) => {
    let spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    let tree = renderComponent(Component, {placeholder: inputText, 'aria-label': 'mandatory label'});
    expect(tree.getByPlaceholderText(inputText)).toBeTruthy();
    let input = tree.getByTestId(testId);
    expect(input.placeholder).toBe(inputText);
    expect(spyWarn).toHaveBeenCalledWith(`Placeholders are deprecated due to accessibility issues. Please use help text instead. See the docs for details: https://react-spectrum.adobe.com/react-spectrum/${Name.replace('v3 ', '')}.html#help-text`);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name calls onChange when text changes', ({Name, Component}) => {
    let tree = renderComponent(Component, {onChange, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    fireEvent.change(input, {target: {value: inputText}});
    expect(onChange).toHaveBeenCalledTimes(1);

    expect(onChange.mock.calls[0][0]).toBe(inputText);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name calls onFocus when the the input field is focused', ({Name, Component}) => {
    let tree = renderComponent(Component, {onFocus, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    userEvent.click(input);
    expect(onFocus).toHaveBeenCalledTimes(2);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name calls onBlur when the input field loses focus', ({Name, Component}) => {
    let tree = renderComponent(Component, {onBlur, autoFocus: true, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    act(() => input.blur());
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name is uncontrolled if defaultValue prop is provided', ({Name, Component}) => {
    let defaultValue = 'test';
    let newValue = 'blah';
    let tree = renderComponent(Component, {onChange, defaultValue, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    userEvent.type(input, newValue);
    expect(onChange).toHaveBeenCalledTimes(newValue.length);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name is controlled if value prop is provided', ({Name, Component}) => {
    let value = 'test';
    let newValue = 'blah';
    let tree = renderComponent(Component, {onChange, value, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    expect(input.value).toBe(value);
    userEvent.type(input, newValue);
    expect(input.value).toBe(value);
    expect(onChange).toHaveBeenCalledTimes(newValue.length);
  });

  // Omitting SearchField because I don't think we support this use case. If we do, will need to change css a bit
  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
  `('$Name has the proper aria-invalid value and renders a invalid icon if validationState=invalid', ({Name, Component}) => {
    let tree = renderComponent(Component, {validationState: 'invalid', 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    let invalidIcon = tree.getByRole('img', {hidden: true});
    expect(invalidIcon).toBeTruthy();
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
  `('$Name passes through aria-errormessage', ({Name, Component}) => {
    let tree = renderComponent(Component, {validationState: 'invalid', 'aria-label': 'mandatory label', 'aria-errormessage': 'error'});
    let input = tree.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', 'error');
  });

  // Omitting SearchField because I don't think we support this use case. If we do, will need to change css a bit
  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
  `('$Name has the proper aria-invalid value and renders a valid icon if validationState=valid', ({Name, Component}) => {
    let tree = renderComponent(Component, {validationState: 'valid', 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
    let validIcon = tree.getByRole('img', {hidden: true});
    expect(validIcon).toBeTruthy();
  });

  it.each`
    Name                | Component        | props                                                  | expected
    ${'v3 TextField'}   | ${TextField}     | ${{isRequired: true, 'aria-label': 'mandatory label'}} | ${'aria-required'}
    ${'v3 TextArea'}    | ${TextArea}      | ${{isRequired: true, 'aria-label': 'mandatory label'}} | ${'aria-required'}
    ${'v3 SearchField'} | ${SearchField}   | ${{isRequired: true, 'aria-label': 'mandatory label'}} | ${'aria-required'}
  `('$Name supports a isRequired prop', ({Name, Component, props, expected}) => {
    let tree = renderComponent(Component, props);
    let input = tree.getByTestId(testId);
    expect(input).toHaveAttribute(expected);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name automatically focuses the input field if autoFocus=true', ({Name, Component}) => {
    let tree = renderComponent(Component, {autoFocus: true, onFocus, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);

    expect(document.activeElement).toEqual(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it.each`
    Name                | Component        | props
    ${'v3 TextField'}   | ${TextField}     | ${{isReadOnly: true, 'aria-label': 'mandatory label'}}
    ${'v3 TextArea'}    | ${TextArea}      | ${{isReadOnly: true, 'aria-label': 'mandatory label'}}
    ${'v3 SearchField'} | ${SearchField}   | ${{isReadOnly: true, 'aria-label': 'mandatory label'}}
  `('$Name should support isReadOnly', ({Name, Component, props}) => {
    let tree = renderComponent(Component, props);
    let input = tree.getByTestId(testId);
    expect(input).toHaveAttribute('readonly');
    userEvent.click(input);
    expect(document.activeElement).toEqual(input);

    // Note: simulating text input via fireEvent or "type"(userEvent library) still causes the input value to change
    // Seems like this is a framework issue rather than a bug with TextField so omitting the test case
  });

  it.each`
    Name                | Component        | props
    ${'v3 TextField'}   | ${TextField}     | ${{isDisabled: true, 'aria-label': 'mandatory label'}}
    ${'v3 TextArea'}    | ${TextArea}      | ${{isDisabled: true, 'aria-label': 'mandatory label'}}
    ${'v3 SearchField'} | ${SearchField}   | ${{isDisabled: true, 'aria-label': 'mandatory label'}}
  `('$Name should disable the input field if isDisabled=true', ({Name, Component, props}) => {
    let tree = renderComponent(Component, props);
    let input = tree.getByTestId(testId);
    expect(input).toHaveAttribute('disabled');
    userEvent.click(input);
    expect(document.activeElement).not.toEqual(input);
    // Note: simulating text input via fireEvent or "type"(userEvent library) still causes the input value to change
    // Seems like this is a framework issue rather than a bug with TextField so omitting the test case
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
  `('$Name allow the user to render a custom icon', ({Component}) => {
    let iconId = 'icon-yo';
    let tree = renderComponent(Component, {icon: <Checkmark data-testid={iconId} />, 'aria-label': 'mandatory label'});
    let icon = tree.getByTestId(iconId);
    expect(icon).toHaveAttribute('role', 'img');
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name will attach a ref to the input field if provided as a prop', ({Component}) => {
    let ref = React.createRef();
    let tree = renderComponent(Component, {ref, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    expect(ref.current.getInputElement()).toEqual(input);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name supports labeling', ({Component}) => {
    let ref = React.createRef();
    let tree = renderComponent(Component, {ref, label: 'Textfield label'});
    let input = tree.getByTestId(testId);
    expect(ref.current.getInputElement()).toEqual(input);

    let labelId = input.getAttribute('aria-labelledby');
    expect(labelId).toBeDefined();
    let label = document.getElementById(labelId);
    expect(label).toHaveTextContent('Textfield label');
    expect(label).toHaveAttribute('for', input.id);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name supports description or error message', ({Component}) => {
    function Example(props) {
      let [value, setValue] = React.useState('0');
      let isValid = React.useMemo(() => /^\d$/.test(value), [value]);

      return (
        <Component
          {...props}
          validationState={isValid ? 'valid' : 'invalid'}
          value={value}
          onChange={setValue}
          label="Favorite number"
          maxLength={1}
          description="Enter a single digit number."
          errorMessage={
            value === ''
              ? 'Empty input not allowed.'
              : 'Single digit numbers are 0-9.'
          } />
      );
    }
    let tree = renderComponent(Example);
    let input = tree.getByTestId(testId);
    let helpText = tree.getByText('Enter a single digit number.');
    expect(helpText).toHaveAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', `${helpText.id}`);
    expect(input.value).toBe('0');
    let newValue = 's';
    fireEvent.change(input, {target: {value: newValue}});
    expect(input.value).toBe(newValue);
    helpText = tree.getByText('Single digit numbers are 0-9.');
    expect(helpText).toHaveAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', `${helpText.id}`);
    newValue = '';
    fireEvent.change(input, {target: {value: newValue}});
    expect(input.value).toBe(newValue);
    helpText = tree.getByText('Empty input not allowed.');
    expect(helpText).toHaveAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', `${helpText.id}`);
    newValue = '4';
    fireEvent.change(input, {target: {value: newValue}});
    expect(input.value).toBe(newValue);
    helpText = tree.getByText('Enter a single digit number.');
    expect(helpText).toHaveAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', `${helpText.id}`);
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name supports error message', async ({Component}) => {
    function Example(props) {
      let [value, setValue] = React.useState('0');
      let isValid = React.useMemo(() => /^\d$/.test(value), [value]);

      return (
        <Component
          {...props}
          validationState={isValid ? 'valid' : 'invalid'}
          value={value}
          onChange={setValue}
          label="Favorite number"
          maxLength={1}
          errorMessage={
            value === ''
              ? 'Empty input not allowed.'
              : 'Single digit numbers are 0-9.'
          } />
      );
    }
    let tree = renderComponent(Example);
    let input = tree.getByTestId(testId);
    let helpText;
    expect(tree.getByTestId(testId)).not.toHaveAttribute('aria-describedby');

    fireEvent.change(input, {target: {value: 's'}});

    await waitFor(() => {
      input = tree.getByTestId(testId);
      expect(input.value).toEqual('s');
    });

    helpText = tree.getByText('Single digit numbers are 0-9.');
    expect(helpText).toHaveAttribute('id');
    expect(tree.getByTestId(testId)).toHaveAttribute('aria-describedby', `${helpText.id}`);

    fireEvent.change(input, {target: {value: ''}});

    await waitFor(() => {
      input = tree.getByTestId(testId);
      expect(input.value).toEqual('');
    });

    helpText = tree.getByText('Empty input not allowed.');
    expect(helpText).toHaveAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', `${helpText.id}`);

    fireEvent.change(input, {target: {value: '4'}});

    await waitFor(() => {
      input = tree.getByTestId(testId);
      expect(input.value).toEqual('4');
    });

    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name passes through ARIA props', ({Name, Component}) => {
    let tree = renderComponent(Component, {'aria-label': 'mandatory label', 'aria-activedescendant': 'test', 'aria-autocomplete': 'list', 'aria-haspopup': 'menu'});
    let input = tree.getByTestId(testId);
    expect(input).toHaveAttribute('aria-activedescendant', 'test');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-haspopup', 'menu');
  });

  it.each`
    Name                | Component
    ${'v3 TextField'}   | ${TextField}
    ${'v3 TextArea'}    | ${TextArea}
    ${'v3 SearchField'} | ${SearchField}
  `('$Name supports excludeFromTabOrder', ({Name, Component}) => {
    let tree = renderComponent(Component, {excludeFromTabOrder: true, 'aria-label': 'mandatory label'});
    let input = tree.getByTestId(testId);
    expect(input).toHaveAttribute('tabIndex', '-1');
  });
});
