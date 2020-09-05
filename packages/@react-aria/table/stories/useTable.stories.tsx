/*
 * Copyright 2021 Adobe. All rights reserved.
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
import {Table as BackwardCompatTable} from './example-backwards-compat';
import {Cell, Column, Row, TableBody, TableHeader} from '@react-stately/table';
import {Meta, Story} from '@storybook/react';
import React from 'react';
import {SpectrumTableProps} from '@react-types/table';
import {Table} from './example';

const meta: Meta<SpectrumTableProps<any>> = {
  title: 'useTable'
};

export default meta;

let columns = [
  {name: 'Name', uid: 'name'},
  {name: 'Type', uid: 'type'},
  {name: 'Level', uid: 'level'}
];

let rows = [
  {id: 1, name: 'Charizard', type: 'Fire, Flying', level: '67'},
  {id: 2, name: 'Blastoise', type: 'Water', level: '56'},
  {id: 3, name: 'Venusaur', type: 'Grass, Poison', level: '83'},
  {id: 4, name: 'Pikachu', type: 'Electric', level: '100'},
  {id: 5, name: 'Charizard', type: 'Fire, Flying', level: '67'},
  {id: 6, name: 'Blastoise', type: 'Water', level: '56'},
  {id: 7, name: 'Venusaur', type: 'Grass, Poison', level: '83'},
  {id: 8, name: 'Pikachu', type: 'Electric', level: '100'},
  {id: 9, name: 'Charizard', type: 'Fire, Flying', level: '67'},
  {id: 10, name: 'Blastoise', type: 'Water', level: '56'},
  {id: 11, name: 'Venusaur', type: 'Grass, Poison', level: '83'},
  {id: 12, name: 'Pikachu', type: 'Electric', level: '100'}
];

const Template: Story<SpectrumTableProps<any>> = (args) => (
  <>
    <label htmlFor="focusable-before">Focusable before</label>
    <input id="focusable-before" />
    <Table aria-label="Table with selection" selectionMode="multiple" {...args}>
      <TableHeader columns={columns}>
        {column => (
          <Column key={column.uid}>
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {item => (
          <Row>
            {columnKey => <Cell>{item[columnKey]}</Cell>}
          </Row>
        )}
      </TableBody>
    </Table>
    <label htmlFor="focus-after">Focusable after</label>
    <input id="focus-after" />
  </>
);

const TemplateBackwardsCompat: Story<SpectrumTableProps<any>> = (args) => (
  <>
    <label htmlFor="focusable-before">Focusable before</label>
    <input id="focusable-before" />
    <BackwardCompatTable aria-label="Table with selection" selectionMode="multiple" {...args}>
      <TableHeader columns={columns}>
        {column => (
          <Column key={column.uid}>
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {item => (
          <Row>
            {columnKey => <Cell>{item[columnKey]}</Cell>}
          </Row>
        )}
      </TableBody>
    </BackwardCompatTable>
    <label htmlFor="focusable-after">
      Focusable after
    </label>
    <input id="focusable-after" />
  </>
);

export const ScrollTesting = Template.bind({});
ScrollTesting.args = {};

export const ActionTesting = Template.bind({});
ActionTesting.args = {selectionBehavior: 'replace', selectionStyle: 'highlight', onAction: action('onAction')};

export const BackwardCompatActionTesting = TemplateBackwardsCompat.bind({});
BackwardCompatActionTesting.args = {selectionBehavior: 'replace', selectionStyle: 'highlight', onAction: action('onAction')};
