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

import {CardBase} from './CardBase';
import {DOMRef, DOMRefValue, ItemProps} from '@react-types/shared';
import {PartialNode} from '@react-stately/collections';
import React, {forwardRef, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes} from 'react';
import {SpectrumCardProps} from '@react-types/card';
import {useCardViewContext} from './CardViewContext';


let Card = forwardRef((props: SpectrumCardProps, ref: DOMRef<HTMLDivElement>) => {
  let context = useCardViewContext();
  if (context !== null) {
    return null;
  } else {
    return (
      <CardBase {...props} ref={ref} />
    );
  }
});

// @ts-ignore
Card.getCollectionNode = function* getCollectionNode<T>(props: any): Generator<PartialNode<T>> {
  let {children, textValue} = props;

  yield {
    type: 'item',
    props: props,
    rendered: children,
    'aria-label': props['aria-label'],
    hasChildNodes: false,
    textValue
  };
};

let _Card = Card as ForwardRefExoticComponent<ItemProps<SpectrumCardProps> & PropsWithoutRef<SpectrumCardProps> & RefAttributes<DOMRefValue<HTMLDivElement>>>;
export {_Card as Card};
