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
import {ColorWheel} from '../';
import {Flex} from '@adobe/react-spectrum';
import {parseColor} from '@react-stately/color';
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('ColorWheel', module)
  .add(
    'default',
    () => <ColorWheel defaultValue="hsl(0, 100%, 50%)')" onChange={action('change')} />
  )
  .add(
    'disabled',
    () => <ColorWheel isDisabled defaultValue="hsl(0, 100%, 50%)" />
  )
  .add(
    'custom size',
    () => {
      let [size, setSize] = useState('size-2400');
      return (<Flex direction="column" alignItems="center" gap="size-200">
        <Flex direction="row">
          <button onClick={() => setSize('size-2400')}>size-2400</button>
          <button onClick={() => setSize('size-5000')}>size-5000</button>
          <button onClick={() => setSize('50vh')}>50vh</button>
        </Flex>
        <ColorWheel defaultValue="hsl(0, 100%, 50%)" size={size} />
      </Flex>);
    }
  )
  .add(
    'controlled',
    () => {
      let [color, setColor] = useState(parseColor('hsl(0, 100%, 50%)'));
      let colorCSS = color.toString('css');
      return (<Flex gap={'size-500'} direction="row" alignItems="center">
        <ColorWheel onChange={setColor} value={color} />
        <div style={{width: '50px', height: '50px', backgroundColor: colorCSS, border: '1px solid black'}} />
      </Flex>);
    }
  )
  .add(
    'controlled hsl',
    () => <Flex gap={'size-500'} direction="row" alignItems="center"><ControlledHSL onChangeEnd={action('onChangeEnd')} /></Flex>
  );

export function ControlledHSL(props) {
  let [color, setColor] = useState(props.defaultValue || parseColor('hsl(0, 100%, 50%)'));
  let colorCSS = color.toString('css');
  let onChangeEnd = (color) => {
    props.onChangeEnd && props.onChangeEnd(color);
    setColor(color);
  };
  let onChange = (color) => {
    props.onChange && props.onChange(color);
    setColor(color);
  };
  return (
    <>
      <ColorWheel onChange={onChange} onChangeEnd={onChangeEnd} value={color.toString('hsl')} />
      <div style={{width: '50px', height: '50px', backgroundColor: colorCSS, border: '1px solid black'}} />
    </>
  );
}
