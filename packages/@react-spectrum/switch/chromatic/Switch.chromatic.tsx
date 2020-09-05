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

import React from 'react';
import {storiesOf} from '@storybook/react';
import {Switch} from '../';
import {View} from '@react-spectrum/view';

storiesOf('Switch', module)
  .add(
    'Default',
    () => render()
  )
  .add(
    'isDisabled: true',
    () => render({isDisabled: true})
  )
  .add(
    'isEmphasized: true',
    () => render({isEmphasized: true})
  )
  .add(
    'isEmphasized: true, isDisabled: true',
    () => render({isEmphasized: true, isDisabled: true})
  )
  .add(
    'isReadOnly: true',
    () => render({isReadOnly: true})
  )
  .add(
    'custom label',
    () => renderCustomLabel()
  )
  .add(
    'long label',
    () => (
      <View width="size-2000">
        <Switch>
          Super long switch label. Sample text. Arma virumque cano, Troiae qui primus ab oris.
        </Switch>
      </View>
    )
  )
  .add(
    'no label',
    () => renderNoLabel({'aria-label': 'This checkbox has no visible label'})
  );

// need selected + indeterminate because there is a sibling selector `checked + ...` so being careful
function render(props = {}) {
  return (
    <>
      <Switch
        {...props}>
        Label
      </Switch>
      <Switch
        isSelected
        {...props}>
        Selected Label
      </Switch>
    </>
  );
}

function renderCustomLabel(props = {}) {
  return (
    <>
      <Switch
        {...props}>
        <span><i>Italicized</i> Switch Label</span>
      </Switch>
      <Switch
        isSelected
        {...props}>
        <span><i>Italicized</i> and Selected Switch Label</span>
      </Switch>
    </>
  );
}

function renderNoLabel(props = {}) {
  return (
    <>
      <Switch {...props} />
      <Switch isSelected {...props} />
    </>
  );
}
