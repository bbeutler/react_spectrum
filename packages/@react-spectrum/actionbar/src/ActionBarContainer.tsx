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

import {classNames, useDOMRef, useStyleProps} from '@react-spectrum/utils';
import {DOMRef} from '@react-types/shared';
import {filterDOMProps} from '@react-aria/utils';
import React from 'react';
import {SpectrumActionBarContainerProps} from '@react-types/actionbar';
import styles from './actionbar.css';
import {useProviderProps} from '@react-spectrum/provider';

function ActionBarContainer(props: SpectrumActionBarContainerProps, ref: DOMRef<HTMLDivElement>) {
  // Grabs specific props from the closest Provider (see https://react-spectrum.adobe.com/react-spectrum/Provider.html#property-groups). Remove if your component doesn't support any of the listed props.
  props = useProviderProps(props);

  let {children} = props;
  let {styleProps} = useStyleProps(props);
  let domRef = useDOMRef(ref);

  return (
    <div
      {...filterDOMProps(props)}
      {...styleProps}
      ref={domRef}
      className={classNames(styles, 'ActionBarContainer', styleProps.className)}>
      {children}
    </div>
  );
}

/**
 * TODO: Add description of component here.
 */
const _ActionBarContainer = React.forwardRef(ActionBarContainer);
export {_ActionBarContainer as ActionBarContainer};
