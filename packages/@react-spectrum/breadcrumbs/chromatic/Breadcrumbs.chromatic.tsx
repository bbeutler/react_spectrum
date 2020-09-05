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

import {Breadcrumbs, Item} from '../';
import {Meta, Story} from '@storybook/react';
import React from 'react';
import {SpectrumBreadcrumbsProps} from '@react-types/breadcrumbs';

const meta: Meta<SpectrumBreadcrumbsProps<object>> = {
  title: 'Breadcrumbs',
  component: Breadcrumbs
};

export default meta;


const Template = <T extends object>(): Story<SpectrumBreadcrumbsProps<T>> => (args) => (
  <Breadcrumbs {...args}>
    <Item key="Folder 1">The quick brown fox jumps over</Item>
    <Item key="Folder 2">My Documents</Item>
    <Item key="Folder 3">Kangaroos jump high</Item>
    <Item key="Folder 4">Koalas are very cute</Item>
    <Item key="Folder 5">Wombat's noses</Item>
    <Item key="Folder 6">Wattle trees</Item>
    <Item key="Folder 7">April 7</Item>
  </Breadcrumbs>
);


export const Default = Template().bind({});
Default.args = {};

export const IsMultiline = Template().bind({});
IsMultiline.args = {isMultiline: true};

export const SizeS = Template().bind({});
SizeS.args = {size: 'S'};

export const SizeM = Template().bind({});
SizeM.args = {size: 'M'};

export const Truncated = Template().bind({});
Truncated.args = {truncated: true};
Truncated.decorators = [(Story) => <div style={{width: '100px'}}><Story /></div>];

export const ShowRoot = Template().bind({});
ShowRoot.args = {showRoot: true};
