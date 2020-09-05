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
import {Color} from '@react-types/color';
import {ColorField} from '../';
import {Flex} from '@react-spectrum/layout';
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {useId} from '@react-aria/utils';
import {View} from '@react-spectrum/view';
import {VisuallyHidden} from '@react-aria/visually-hidden';

storiesOf('ColorField', module)
  .add(
    'Default',
    () => render()
  )
  .add(
    'has default value',
    () => render({defaultValue: '#abcdef'})
  )
  .add(
    'value',
    () => render({
      value: '#FF00AA',
      onChange: action('change')
    })
  )
  .add(
    'isQuiet',
    () => render({isQuiet: true})
  )
  .add(
    'isReadOnly',
    () => render({isReadOnly: true, defaultValue: '#abcdef'})
  )
  .add(
    'isDisabled',
    () => render({isDisabled: true, defaultValue: '#abcdef'})
  )
  .add(
    'validationState valid',
    () => render({validationState: 'valid'})
  )
  .add(
    'validationState invalid',
    () => render({validationState: 'invalid'})
  )
  .add(
    'required, label, optional',
    () => (
      <Flex direction="column" gap="size-100">
        {render({isRequired: 'true'})}
        {render({isRequired: 'true', necessityIndicator: 'label'})}
        {render({necessityIndicator: 'label'})}
      </Flex>
    )
  )
  .add(
    'controlled value',
    () => (
      <ControlledColorField
        value="#FF00AA"
        onChange={action('change')} />
    )
  )
  .add(
    'autofocus',
    () => render({autoFocus: true})
  )
  .add(
    'label side',
    () => render({labelPosition: 'side'})
  )
  .add(
    'no visible label',
    () => renderNoLabel({isRequired: true, 'aria-label': 'Primary Color'})
  )
  .add(
    'aria-labelledby',
    () => (
      <>
        <label htmlFor="colorfield" id="label">Primary Color</label>
        {renderNoLabel({isRequired: true, id: 'colorfield', 'aria-labelledby': 'label'})}
      </>
    )
  )
  .add(
    'custom width',
    () => render({width: 'size-3000'})
  )
  .add(
    'custom width no visible label',
    () => renderNoLabel({width: 'size-3000', isRequired: true, 'aria-label': 'Primary Color'})
  )
  .add(
    'custom width, labelPosition=side',
    () => render({width: 'size-3000', labelPosition: 'side'})
  )
  .add(
    'custom width, 10px for min-width',
    () => (
      <Flex direction="column" gap="size-100">
        {render({width: '10px'})}
        <div style={{width: '10px'}}>
          {render()}
        </div>
      </Flex>
    )
  );

function ControlledColorField(props: any = {}) {
  let [color, setColor] = useState(props.value || null);
  let onChange = (color: Color) => {
    setColor(color);
    if (props.onChange) { props.onChange(color); }
  };
  let style = color ? {backgroundColor: color.toString('rgb')} : {};
  let id = useId();
  return (
    <Flex direction="row" gap="size-100" alignItems="end">
      <ColorField
        id={id}
        label="Primary Color"
        onChange={onChange}
        value={color} />
      <View width="size-400" height="size-400" UNSAFE_style={style}>
        <VisuallyHidden>
          <output htmlFor={id} aria-live="off">
            {color ? color.toString('hex') : ''}
          </output>
        </VisuallyHidden>
      </View>
    </Flex>
  );
}

function render(props: any = {}) {
  return (
    <ColorField
      label="Primary Color"
      onChange={action('change')}
      {...props} />
  );
}

function renderNoLabel(props: any = {}) {
  return (
    <ColorField {...props} onChange={action('onChange')} />
  );
}
