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
import {render, renderHook} from '@react-spectrum/test-utils';
import {useField} from '../';
import {WithError} from '../stories/useField.stories';

describe('useField', function () {
  let renderFieldHook = (fieldProps) => {
    let {result} = renderHook(() => useField(fieldProps));
    return result.current;
  };

  it('should return label props', function () {
    let {labelProps, fieldProps} = renderFieldHook({label: 'Test'});
    expect(labelProps.id).toBeDefined();
    expect(fieldProps.id).toBeDefined();
  });

  it('should return props for description and error message if they are passed in', function () {
    let {descriptionProps, errorMessageProps} = renderFieldHook({label: 'Test', description: 'Description', errorMessage: 'Error'});
    expect(descriptionProps.id).toBeDefined();
    expect(errorMessageProps.id).toBeDefined();
    // these will be null because nothing rendered them into the dom, so useSlotId in play won't find it and will set them to null
    expect(descriptionProps.id).toBeNull();
    expect(errorMessageProps.id).toBeNull();
  });

  it('should not return an id for description and error message if they are not passed in', function () {
    let {descriptionProps, errorMessageProps} = renderFieldHook({label: 'Test'});
    // these will be defined but null because the object is always defined
    expect(descriptionProps.id).toBeDefined();
    expect(errorMessageProps.id).toBeDefined();
    expect(descriptionProps.id).toBeNull();
    expect(errorMessageProps.id).toBeNull();
  });

  it('can render and label both the description and error message at the same time', function () {
    let {getByText, getByLabelText} = render(<WithError {...WithError.args} />);
    let description = getByText('I describe the field.');
    let error = getByText('I\'m a helpful error for the field.');
    let input = getByLabelText('Test label');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(description.id));
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(error.id));
  });
});
