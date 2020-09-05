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

import {BreadcrumbItem} from '../src/BreadcrumbItem';
import React from 'react';
import {render, triggerPress} from '@react-spectrum/test-utils';

// v3 component
describe('BreadcrumbItem', function () {
  it('Handles defaults', () => {
    let {getByText} = render(<BreadcrumbItem >Breadcrumb item</BreadcrumbItem>);
    let breadcrumbItem = getByText('Breadcrumb item');
    expect(breadcrumbItem.id).toBeDefined();
    expect(breadcrumbItem.tabIndex).toBe(0);
  });

  it('Handles current', () => {
    let {getByText} = render(<BreadcrumbItem isCurrent >Breadcrumb item</BreadcrumbItem>);
    let breadcrumbItem = getByText('Breadcrumb item');
    expect(breadcrumbItem.tabIndex).toBe(-1);
    expect(breadcrumbItem).toHaveAttribute('aria-current', 'page');
  });

  it('Handles disabled', () => {
    let onPressSpy = jest.fn();
    let {getByText} = render(<BreadcrumbItem onPress={onPressSpy} isDisabled >Breadcrumb item</BreadcrumbItem>);
    let breadcrumbItem = getByText('Breadcrumb item');
    expect(breadcrumbItem.tabIndex).toBe(-1);
    expect(breadcrumbItem).toHaveAttribute('aria-disabled', 'true');
    triggerPress(breadcrumbItem);
    expect(onPressSpy).toHaveBeenCalledTimes(0);
  });

  it('Handles onPress', () => {
    let onPressSpy = jest.fn();
    let {getByText} = render(<BreadcrumbItem onPress={onPressSpy} >Breadcrumb item</BreadcrumbItem>);
    let breadcrumbItem = getByText('Breadcrumb item');
    triggerPress(breadcrumbItem);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
  });

  it('Handles custom element type', () => {
    let {getByText} = render(
      <BreadcrumbItem>
        <a href="http://example.com/">Breadcrumb item </a>
      </BreadcrumbItem>
    );
    let breadcrumbItem = getByText('Breadcrumb item');
    expect(breadcrumbItem.id).toBeDefined();
    expect(breadcrumbItem.tabIndex).toBe(0);
    expect(breadcrumbItem.href).toBeDefined();
  });
});
