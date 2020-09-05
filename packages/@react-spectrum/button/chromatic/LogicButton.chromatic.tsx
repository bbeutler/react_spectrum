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

import {Flex} from '@react-spectrum/layout';
import {LogicButton} from '../';
import React from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('Button/LogicButton', module)
  .add(
    'logic variant: and',
    () => render({variant: 'and', label: 'and'})
  )
  .add(
    'logic variant: or',
    () => render({variant: 'or', label: 'or'})
  );

function render(props: any = {}) {
  return (
    <Flex gap="size-100">
      <LogicButton {...props}>
        Default
      </LogicButton>
      <LogicButton isDisabled {...props}>
        Disabled
      </LogicButton>
    </Flex>
  );
}
