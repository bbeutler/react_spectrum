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
import Bell from '@spectrum-icons/workflow/Bell';
import {Button} from '../';
import {Flex} from '@react-spectrum/layout';
import React, {ElementType} from 'react';
import {SpectrumButtonProps} from '@react-types/button';
import {storiesOf} from '@storybook/react';
import {Text} from '@react-spectrum/text';

storiesOf('Button', module)
  .addParameters({providerSwitcher: {status: 'positive'}})
  .add(
    'variant: cta',
    () => render({variant: 'cta'})
  )
  .add(
    'with icon',
    () => (
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          variant="primary">
          <Bell />
          <Text>Default</Text>
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          variant="primary">
          <Text>Disabled</Text>
          <Bell />
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isQuiet
          variant="primary">
          <Bell />
          <Text>Quiet</Text>
        </Button>
      </Flex>
    )
  )
  .add(
    'variant: overBackground',
    () => (
      <div style={{backgroundColor: 'rgb(15, 121, 125)', color: 'rgb(15, 121, 125)', padding: '15px 20px', display: 'inline-block'}}>
        {render({variant: 'overBackground'})}
      </div>
    )
  )
  .add(
    'variant: primary',
    () => render({variant: 'primary'})
  )
  .add(
    'variant: secondary',
    () => render({variant: 'secondary'})
  )
  .add(
    'variant: negative',
    () => render({variant: 'negative'})
  )
  .add(
    'element: a',
    () => render({elementType: 'a', variant: 'primary'})
  )
  .add(
    'element: a, href: \'//example.com\', target: \'_self\'',
    () => render({elementType: 'a', href: '//example.com', target: '_self', variant: 'primary'})
  )
  .add(
    'element: a, rel: \'noopener noreferrer\'',
    () => render({elementType: 'a', href: '//example.com', rel: 'noopener noreferrer', variant: 'primary'})
  )
  .add(
    'user-select:none on press test',
    () => <Example />,
    {description: {data: 'Pressing and holding on either buttons shouldn\'t trigger text selection on the button labels (wait for buttons to turn red).'}}
  )
  .add(
    'styles to check WHCM support',
    () => renderStyles()
  );

function render<T extends ElementType = 'button'>(props: SpectrumButtonProps<T> = {variant: 'primary'}) {
  return (
    <Flex gap="size-200">
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}>
        Default
      </Button>
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}>
        Disabled
      </Button>
      {props.variant !== 'cta' && (
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isQuiet
        {...props}>
        Quiet
      </Button>
      )}
    </Flex>
  );
}

function Example() {
  let [show, setShow] = React.useState(false);
  let [show2, setShow2] = React.useState(false);

  return (
    <Flex gap="size-200">
      <Button
        variant="cta"
        UNSAFE_style={show ? undefined : {background: 'red', userSelect: 'text'}}
        onPressStart={() => setTimeout(() => setShow(true), 3000)}>
        Press and hold (overwrite)
      </Button>
      <Button
        variant="cta"
        UNSAFE_style={show2 ? undefined : {background: 'red'}}
        onPressStart={() => setTimeout(() => setShow2(true), 3000)}>
        Press and hold (no overwrite)
      </Button>
    </Flex>
  );
}

function renderStyles<T extends ElementType = 'button'>(props: SpectrumButtonProps<T> = {variant: 'primary'}) {
  return (
    <Flex direction="column" gap="size-200">
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          {...props}
          variant="cta">
          CTA
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          {...props}
          variant="cta">
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          {...props}>
          Primary
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          {...props}>
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          {...props}
          variant="secondary">
          Secondary
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          {...props}
          variant="secondary">
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          {...props}
          variant="negative">
          Warning
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          {...props}
          variant="negative">
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isQuiet
          {...props}>
          Primary Quiet
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          isQuiet
          {...props}>
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isQuiet
          {...props}
          variant="secondary">
          Secondary Quiet
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          isQuiet
          {...props}
          variant="secondary">
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isQuiet
          {...props}
          variant="negative">
          Warning Quiet
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          isQuiet
          {...props}
          variant="negative">
          Disabled
        </Button>
      </Flex>
    </Flex>
  );
}
