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
import {ActionButton, Button} from '@react-spectrum/button';
import {ActionGroup, Item} from '@react-spectrum/actiongroup';
import {Flex} from '@react-spectrum/layout';
import {Link} from '@react-spectrum/link';
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {Tooltip, TooltipTrigger} from '../src';

storiesOf('TooltipTrigger', module)
  .add(
    'default',
    () => render({})
  )
  .add(
    'placement: left',
    () => render({placement: 'left'})
  )
  .add(
    'placement: right',
    () => render({placement: 'right'})
  )
  .add(
    'placement: start',
    () => render({placement: 'start'})
  )
  .add(
    'placement: top',
    () => render({placement: 'top'})
  )
  .add(
    'placement: bottom',
    () => render({placement: 'bottom'})
  )
  .add(
    'placement: top with offset',
    () => render({placement: 'top', offset: 50})
  )
  .add(
    'placement: bottom with crossOffset',
    () => render({placement: 'bottom', crossOffset: 50})
  )
  .add(
    'isDisabled',
    () => render({placement: 'start', isDisabled: true})
  )
  .add(
    'zero delay',
    () => render({delay: 0})
  )
  .add(
    'focus only',
    () => render({trigger: 'focus'})
  )
  .add(
    'multiple tooltips',
    () => renderMultipleTriggers({placement: 'start'})
  )
  .add(
    'zero delay multiple tooltips',
    () => renderMultipleTriggers({delay: 0})
  )
  .add(
    'controlled',
    () => <ControlledButtons />
  )
  .add(
    'trigger disabled',
    () => renderDisabledTrigger()
  )
  .add(
    'arrow positioning at edge',
    () => (
      <div style={{width: '100%'}}>
        <TooltipTrigger onOpenChange={action('openChange')}>
          <ActionButton>Trigger Tooltip</ActionButton>
          <Tooltip>
            Long tooltip message that just goes on and on.
          </Tooltip>
        </TooltipTrigger>
      </div>
    )
  )
  .add(
    'tooltip with other hoverables',
    () => (
      <Flex gap="size-100">
        <TooltipTrigger onOpenChange={action('openChange')}>
          <ActionButton>Trigger Tooltip</ActionButton>
          <Tooltip>
            Long tooltip message that just goes on and on.
          </Tooltip>
        </TooltipTrigger>
        <Button variant="secondary">No Tooltip</Button>
      </Flex>
    )
  )
  .add(
    'tooltrip trigger inside action group',
    () => ActionGroupTrigger()
  )
  .add(
    'crossoffset examples',
    () => (
      <Flex gap="size-200">
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left Top</span>
          <TooltipTrigger delay={0} placement="left top" crossOffset={10}>
            <ActionButton>Tooltip Trigger 10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left top">
            <ActionButton>Tooltip Trigger 0</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left top" crossOffset={-10}>
            <ActionButton>Tooltip Trigger -10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left top" crossOffset={10}>
            <ActionButton>Tooltip 10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left top">
            <ActionButton>Tooltip 0</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left top" crossOffset={-10}>
            <ActionButton>Tooltip -10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
        </Flex>
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left</span>
          <TooltipTrigger delay={0} placement="left" crossOffset={10}>
            <ActionButton>Tooltip Trigger 10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left">
            <ActionButton>Tooltip Trigger 0 </ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left" crossOffset={-10}>
            <ActionButton>Tooltip Trigger -10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left" crossOffset={10}>
            <ActionButton>Tooltip 10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left">
            <ActionButton>Tooltip 0</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left" crossOffset={-10}>
            <ActionButton>Tooltip -10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
        </Flex>
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left Bottom</span>
          <TooltipTrigger delay={0} placement="left bottom" crossOffset={10}>
            <ActionButton>Tooltip Trigger 10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left bottom">
            <ActionButton>Tooltip Trigger 0</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left bottom" crossOffset={-10}>
            <ActionButton>Tooltip Trigger -10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left bottom" crossOffset={10}>
            <ActionButton>Tooltip 10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left bottom">
            <ActionButton>Tooltip 0</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={0} placement="left bottom" crossOffset={-10}>
            <ActionButton>Tooltip -10</ActionButton>
            <Tooltip>Tooltip message.</Tooltip>
          </TooltipTrigger>
        </Flex>
      </Flex>
    )
  )
  .add(
    'tooltip on link',
    () => <LinkWithTooltip />
  );

function render(props = {}) {
  return (
    <TooltipTrigger {...props} onOpenChange={action('openChange')}>
      <ActionButton>Trigger Tooltip</ActionButton>
      <Tooltip>
        Tooltip message.
      </Tooltip>
    </TooltipTrigger>
  );
}

function renderDisabledTrigger() {
  return (
    <TooltipTrigger onOpenChange={action('openChange')}>
      <ActionButton isDisabled>Trigger Tooltip</ActionButton>
      <Tooltip>
        Tooltip message.
      </Tooltip>
    </TooltipTrigger>
  );
}

function renderMultipleTriggers(props = {}) {
  return (
    <Flex gap="size-100" direction="column">
      <TooltipTrigger {...props} onOpenChange={action('openChange')}>
        <ActionButton>
          Neutral Tooltip
        </ActionButton>
        <Tooltip showIcon>
          Neutral message.
        </Tooltip>
      </TooltipTrigger>
      <TooltipTrigger {...props} onOpenChange={action('openChange')}>
        <ActionButton>
          Positive Tooltip
        </ActionButton>
        <Tooltip variant="positive" showIcon>
          Positive message.
        </Tooltip>
      </TooltipTrigger>
      <TooltipTrigger {...props} onOpenChange={action('openChange')}>
        <ActionButton>
          Negative Tooltip
        </ActionButton>
        <Tooltip variant="negative" showIcon>
          Negative message.
        </Tooltip>
      </TooltipTrigger>
      <TooltipTrigger {...props} onOpenChange={action('openChange')}>
        <ActionButton>
          Info Tooltip
        </ActionButton>
        <Tooltip variant="info" showIcon>
          Informative message.
        </Tooltip>
      </TooltipTrigger>
    </Flex>
  );
}

function ActionGroupTrigger() {
  let onSelectionChange = action('onSelectionChange');

  return (
    <ActionGroup
      selectionMode="single"
      disallowEmptySelection
      onSelectionChange={s => onSelectionChange([...s])}>
      <TooltipTrigger delay={0}>
        <Item key="item1">Trigger Tooltip</Item>
        <Tooltip>Tooltip is inside an ActionGroup</Tooltip>
      </TooltipTrigger>
    </ActionGroup>
  );
}

function ControlledButtons(props = {}) {
  let [one, setOne] = useState(false);
  let [two, setTwo] = useState(false);
  let [three, setThree] = useState(false);
  let [four, setFour] = useState(false);
  return (
    <Flex gap="size-100" direction="column">
      <TooltipTrigger {...props} isOpen={one} onOpenChange={setOne}>
        <ActionButton>
          Neutral Tooltip
        </ActionButton>
        <Tooltip showIcon>
          Neutral message.
        </Tooltip>
      </TooltipTrigger>
      <TooltipTrigger {...props} isOpen={two} onOpenChange={setTwo}>
        <ActionButton>
          Positive Tooltip
        </ActionButton>
        <Tooltip variant="positive" showIcon>
          Positive message.
        </Tooltip>
      </TooltipTrigger>
      <TooltipTrigger {...props} isOpen={three} onOpenChange={setThree}>
        <ActionButton>
          Negative Tooltip
        </ActionButton>
        <Tooltip variant="negative" showIcon>
          Negative message.
        </Tooltip>
      </TooltipTrigger>
      <TooltipTrigger {...props} isOpen={four} onOpenChange={setFour}>
        <ActionButton>
          Info Tooltip
        </ActionButton>
        <Tooltip variant="info" showIcon>
          Informative message.
        </Tooltip>
      </TooltipTrigger>
    </Flex>
  );
}

function LinkWithTooltip(props = {}) {
  return (
    <TooltipTrigger {...props}>
      <Link>
        <a
          href="https://react-spectrum.adobe.com/"
          target="_blank"
          rel="noreferrer">
          Why did dinosaurs have feathers?
        </a>
      </Link>
      <Tooltip>Dinosaurs had feathers, find out more.</Tooltip>
    </TooltipTrigger>
  );
}
