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

import {AnchorHTMLAttributes, HTMLAttributes, RefObject} from 'react';
import {SpectrumSideNavItemProps} from '@react-types/sidenav';
import {TreeState} from '@react-stately/tree';
import {useSelectableItem} from '@react-aria/selection';

interface SideNavItemAria {
  listItemProps: HTMLAttributes<HTMLDivElement>,
  listItemLinkProps: AnchorHTMLAttributes<HTMLAnchorElement>
}

export function useSideNavItem<T>(props: SpectrumSideNavItemProps<T>, state: TreeState<T>, ref: RefObject<HTMLAnchorElement | null>): SideNavItemAria {
  let {
    item,
    'aria-current': ariaCurrent
  } = props;

  let {itemProps} = useSelectableItem({
    selectionManager: state.selectionManager,
    key: item.key,
    ref
  });

  let isDisabled = state.disabledKeys.has(item.key);
  let isSelected = state.selectionManager.isSelected(item.key);

  return {
    listItemProps: {
      role: 'listitem'
    },
    listItemLinkProps: {
      role: 'link',
      target: '_self',
      'aria-disabled': isDisabled,
      'aria-current': isSelected ? ariaCurrent || 'page' : undefined,
      ...itemProps
    }
  };
}
