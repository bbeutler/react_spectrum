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

import {ActionGroup} from '@react-spectrum/actiongroup';
import {ActionMenu} from '@react-spectrum/menu';
import Add from '@spectrum-icons/workflow/Add';
import {Content, View} from '@react-spectrum/view';
import Delete from '@spectrum-icons/workflow/Delete';
import {generatePowerset} from '@react-spectrum/story-utils';
import {Grid, repeat} from '@react-spectrum/layout';
import {Heading, Text} from '@react-spectrum/text';
import {IllustratedMessage} from '@react-spectrum/illustratedmessage';
import {Image} from '@react-spectrum/image';
import Info from '@spectrum-icons/workflow/Info';
import {Item, ListView} from '../';
import {Meta, Story} from '@storybook/react';
import React from 'react';
import {useSlotProps, useStyleProps} from '@react-spectrum/utils';

let states = [
  {isQuiet: true},
  {selectionMode: 'multiple'},
  {density: ['compact', 'spacious']},
  {selectionStyle: 'highlight'},
  {overflowMode: 'wrap'}
];

let combinations = generatePowerset(states);
let chunkSize = Math.ceil(combinations.length / 3);

function shortName(key, value) {
  let returnVal = '';
  switch (key) {
    case 'isQuiet':
      returnVal = 'quiet';
      break;
    case 'selectionMode':
      returnVal = `sm: ${value === undefined ? 'none' : value}`;
      break;
    case 'density':
      returnVal = `den: ${value === undefined ? 'regular' : value}`;
      break;
    case 'selectionStyle':
      returnVal = 'highlight';
      break;
  }
  return returnVal;
}

const meta: Meta = {
  title: 'ListView',
  component: ListView,
  parameters: {
    chromaticProvider: {colorSchemes: ['light', 'dark'], locales: ['en-US'], scales: ['medium', 'large'], disableAnimations: true},
    // noticed a small shifting before final layout, delaying so chromatic doesn't hit that
    chromatic: {delay: 10000}
  }
};

export default meta;

const renderActions = (
  <>
    <ActionGroup buttonLabelBehavior="hide">
      <Item key="info">
        <Info />
        <Text>Info</Text>
      </Item>
    </ActionGroup>
    <ActionMenu>
      <Item key="add">
        <Add />
        <Text>Add</Text>
      </Item>
      <Item key="delete">
        <Delete />
        <Text>Delete</Text>
      </Item>
    </ActionMenu>
  </>
);

function IllustrationContainer(props) {
  props = useSlotProps(props, 'illustration');
  let {styleProps} = useStyleProps(props);
  return (
    <div {...styleProps}>
      {props.children}
    </div>
  );
}

function Folder() {
  return (
    <IllustrationContainer>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95.23 67" height="110">
        <path fill="var(--spectrum-global-color-gray-600)" d="M94.47,27a4.45,4.45,0,0,0-3.72-2H20.34a5.45,5.45,0,0,0-5.05,3.37L3.12,57.68V3.88A.89.89,0,0,1,4,3H23.21a2.51,2.51,0,0,1,1.69.66l9.7,8.94a1.56,1.56,0,0,0,1,.4h40a1.5,1.5,0,0,1,1.5,1.5v6a1.5,1.5,0,0,0,3,0v-6a4.51,4.51,0,0,0-4.5-4.5H36.21L26.93,1.46A5.48,5.48,0,0,0,23.21,0H4A3.88,3.88,0,0,0,.12,3.88v61h0A1.51,1.51,0,0,0,1.5,67H79a1.49,1.49,0,0,0,1.38-.92L94.89,31.19A4.45,4.45,0,0,0,94.47,27ZM92.12,30,78,64H3.75L18.06,29.52A2.46,2.46,0,0,1,20.34,28H90.75a1.48,1.48,0,0,1,1.37,2Z" />
      </svg>
    </IllustrationContainer>
  );
}

const Template = (): Story => ({combos, ...args}) => (
  <Grid columns={repeat(3, '1fr')} autoFlow="row" gap="size-300">
    {combos.map(c => {
      let key = Object.keys(c).map(k => shortName(k, c[k])).join(' ');
      if (!key) {
        key = 'empty';
      }
      return (
        <View flexGrow={1} maxWidth="size-5000" maxHeight={700} id={key}>
          <ListView aria-label={key} width="size-3600" height="100%" selectedKeys={['a', 'd']} disabledKeys={['c']} {...args} {...c}>
            <Item key="a" textValue="Utilities" hasChildItems>
              <Folder />
              <Text>Utilities</Text>
              <Text slot="description">16 items</Text>
              {renderActions}
            </Item>
            <Item key="b" textValue="long example 1">
              <Image src="https://random.dog/191091b2-7d69-47af-9f52-6605063f1a47.jpg" />
              <Text>multi word content that is very long</Text>
              <Text slot="description">long description that is multiple words</Text>
              {renderActions}
            </Item>
            <Item key="c" textValue="long example 2">
              <Text>multi word content that is very very long </Text>
              <Text slot="description">singledescriptionthatisonewordblah</Text>
              {renderActions}
            </Item>
            <Item key="d" textValue="long example 3">
              <Text>supercalifragilisticexpialidocious</Text>
              <Text slot="description">long description that is multiple words</Text>
              {renderActions}
            </Item>
          </ListView>
        </View>
      );
    })}
  </Grid>
);

function renderEmptyState() {
  return (
    <IllustratedMessage>
      <svg width="150" height="103" viewBox="0 0 150 103">
        <path d="M133.7,8.5h-118c-1.9,0-3.5,1.6-3.5,3.5v27c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5V23.5h119V92c0,0.3-0.2,0.5-0.5,0.5h-118c-0.3,0-0.5-0.2-0.5-0.5V69c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v23c0,1.9,1.6,3.5,3.5,3.5h118c1.9,0,3.5-1.6,3.5-3.5V12C137.2,10.1,135.6,8.5,133.7,8.5z M15.2,21.5V12c0-0.3,0.2-0.5,0.5-0.5h118c0.3,0,0.5,0.2,0.5,0.5v9.5H15.2z M32.6,16.5c0,0.6-0.4,1-1,1h-10c-0.6,0-1-0.4-1-1s0.4-1,1-1h10C32.2,15.5,32.6,15.9,32.6,16.5z M13.6,56.1l-8.6,8.5C4.8,65,4.4,65.1,4,65.1c-0.4,0-0.8-0.1-1.1-0.4c-0.6-0.6-0.6-1.5,0-2.1l8.6-8.5l-8.6-8.5c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l8.6,8.5l8.6-8.5c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L15.8,54l8.6,8.5c0.6,0.6,0.6,1.5,0,2.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4L13.6,56.1z" />
      </svg>
      <Heading>No results</Heading>
      <Content>No results found</Content>
    </IllustratedMessage>
  );
}

const TemplateEmptyState = (): Story => () => (
  <ListView width="size-3400" height="size-6000" renderEmptyState={renderEmptyState}>
    {[]}
  </ListView>
);

export const Default = Template().bind({});
Default.storyName = 'all visual option combos 1 of 3';
Default.args = {combos: combinations.slice(0, chunkSize)};

export const ComboPt2 = Template().bind({});
ComboPt2.args = {combos: combinations.slice(chunkSize, chunkSize * 2)};
ComboPt2.storyName = 'all visual option combos 2 of 3';

export const ComboPt3 = Template().bind({});
ComboPt3.args = {combos: combinations.slice(chunkSize * 2, chunkSize * 3)};
ComboPt3.storyName = 'all visual option combos 3 of 3';

export const Empty = TemplateEmptyState().bind({});
Empty.storyName = 'empty state';
