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

import {action} from '@storybook/addon-actions';
import Info from '@spectrum-icons/workflow/Info';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {TextField} from '../';

storiesOf('TextField', module)
  .addParameters({providerSwitcher: {status: 'positive'}})
  .add(
    'Default',
    () => render()
  )
  .add(
    'value: Test (controlled)',
    () => render({value: 'Test'})
  )
  .add(
    'defaultValue: Test (uncontrolled)',
    () => render({defaultValue: 'Test'})
  )
  .add(
    'isQuiet: true',
    () => render({isQuiet: true})
  )
  .add(
    'isDisabled: true',
    () => render({isDisabled: true})
  )
  .add(
    'isQuiet, isDisabled',
    () => render({isDisabled: true, isQuiet: true})
  )
  .add(
    'validationState: invalid',
    () => render({validationState: 'invalid'})
  )
  .add(
    'validationState: valid',
    () => render({validationState: 'valid'})
  )
  .add(
    'type: email',
    () => render({type: 'email'})
  )
  .add(
    'pattern: [0-9]+',
    () => render({pattern: '[0-9]+'})
  )
  .add(
    'isReadOnly: true',
    () => render({isReadOnly: true})
  )
  .add(
    'isReadOnly: true, value: read only value',
    () => render({value: 'read only value', isReadOnly: true})
  )
  .add(
    'isRequired: true',
    () => render({isRequired: true})
  )
  .add(
    'isRequired: true, necessityIndicator: label',
    () => render({isRequired: true, necessityIndicator: 'label'})
  )
  .add(
    'isRequired: false, necessityIndicator: label',
    () => render({isRequired: false, necessityIndicator: 'label'})
  )
  .add(
    'autoFocus: true',
    () => render({autoFocus: true})
  )
  .add(
    'icon: Info',
    () => render({icon: <Info />})
  )
  .add(
    'icon: Info, isQuiet',
    () => render({icon: <Info />, isQuiet: true})
  )
  .add(
    'icon: Info, isDisabled',
    () => render({icon: <Info />, isDisabled: true})
  )
  .add(
    'icon: Info, isQuiet, isDisabled',
    () => render({icon: <Info />, isQuiet: true, isDisabled: true})
  )
  .add(
    'icon: Info, validationState: invalid, isQuiet',
    () => render({icon: <Info />, validationState: 'invalid', isQuiet: true})
  )
  .add(
    'labelAlign: end',
    () => render({labelAlign: 'end'})
  )
  .add(
    'labelPosition: side',
    () => render({labelPosition: 'side'})
  )
  .add(
    'no visible label',
    () => render({label: null, 'aria-label': 'Street address'})
  )
  .add(
    'with description',
    () => render({description: 'Please enter your street address.'})
  )
  .add(
    'with error message',
    () => render({errorMessage: 'Please enter a valid street address.', validationState: 'invalid'})
  )
  .add(
    'with description, error message and validation',
    () => renderWithDescriptionErrorMessageAndValidation()
  )
  .add('custom width',
    () => render({icon: <Info />, validationState: 'invalid', width: '300px'})
  )
  .add('custom width small',
    () => render({icon: <Info />, validationState: 'invalid', width: '30px'})
  )
  .add('custom width, quiet',
    () => render({icon: <Info />, validationState: 'invalid', width: '300px', isQuiet: true})
  )
  .add('custom width, labelPosition: side',
    () => render({icon: <Info />, validationState: 'invalid', width: '500px', labelPosition: 'side'})
  )
  .add('custom width small, labelPosition: side',
    () => render({icon: <Info />, validationState: 'invalid', width: '30px', labelPosition: 'side'})
  );

function render(props = {}) {
  return (
    <TextField
      label="Street address"
      onChange={action('change')}
      onFocus={action('focus')}
      onBlur={action('blur')}
      UNSAFE_className="custom_classname"
      {...props} />
  );
}

function renderWithDescriptionErrorMessageAndValidation() {
  function Example() {
    let [value, setValue] = React.useState('0');
    let isValid = React.useMemo(() => /^\d$/.test(value), [value]);
  
    return (
      <TextField
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

  return <Example />;
}
