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
import {CardViewContext, useCardViewContext} from './CardViewContext';
import {classNames, useDOMRef, useStyleProps, useUnwrapDOMRef} from '@react-spectrum/utils';
import {DOMRef, DOMRefValue, Node} from '@react-types/shared';
import {GridCollection, useGridState} from '@react-stately/grid';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {mergeProps} from '@react-aria/utils';
import {ProgressCircle} from '@react-spectrum/progress';
import React, {ReactElement, useCallback, useMemo, useRef} from 'react';
import {ReusableView} from '@react-stately/virtualizer';
import {SpectrumCardViewProps} from '@react-types/card';
import styles from '@adobe/spectrum-css-temp/components/card/vars.css';
import {useCollator, useLocale, useMessageFormatter} from '@react-aria/i18n';
import {useGrid, useGridCell, useGridRow} from '@react-aria/grid';
import {useListState} from '@react-stately/list';
import {useProvider} from '@react-spectrum/provider';
import {Virtualizer, VirtualizerItem} from '@react-aria/virtualizer';

function CardView<T extends object>(props: SpectrumCardViewProps<T>, ref: DOMRef<HTMLDivElement>) {
  let {scale} = useProvider();
  let {styleProps} = useStyleProps(props);
  let domRef = useDOMRef(ref);
  let {
    isQuiet,
    renderEmptyState,
    layout,
    loadingState,
    onLoadMore,
    cardOrientation = 'vertical'
  } = props;

  let collator = useCollator({usage: 'search', sensitivity: 'base'});
  let isLoading = loadingState === 'loading' || loadingState === 'loadingMore';
  let cardViewLayout = useMemo(() => typeof layout === 'function' ? new layout({collator, cardOrientation, scale}) : layout, [layout, collator, cardOrientation, scale]);
  let layoutType = cardViewLayout.layoutType;

  let formatMessage = useMessageFormatter(intlMessages);
  let {direction} = useLocale();
  let {collection} = useListState(props);

  let gridCollection = useMemo(() => new GridCollection<T>({
    columnCount: 1,
    items: [...collection].map(item => ({
      // Makes the Grid row use the keys the user provides to the cards so that selection change via interactions returns the card keys
      ...item,
      hasChildNodes: true,
      childNodes: [{
        key: `cell-${item.key}`,
        type: 'cell',
        value: null,
        level: 0,
        rendered: null,
        textValue: item.textValue,
        hasChildNodes: false,
        childNodes: []
      }]
    }))
  }), [collection]);

  let state = useGridState({
    ...props,
    selectionMode: cardOrientation === 'horizontal' && layoutType === 'grid' ? 'none' : props.selectionMode,
    collection: gridCollection,
    focusMode: 'cell'
  });

  cardViewLayout.collection = gridCollection;
  cardViewLayout.disabledKeys = state.disabledKeys;
  cardViewLayout.isLoading = isLoading;
  cardViewLayout.direction = direction;

  let {gridProps} = useGrid({
    ...props,
    isVirtualized: true,
    keyboardDelegate: cardViewLayout
  }, state, domRef);

  type View = ReusableView<Node<T>, unknown>;
  let renderWrapper = (parent: View, reusableView: View) => (
    <VirtualizerItem
      key={reusableView.key}
      reusableView={reusableView}
      parent={parent} />
  );

  let focusedKey = state.selectionManager.focusedKey;
  let focusedItem = gridCollection.getItem(state.selectionManager.focusedKey);
  if (focusedItem?.parentKey != null) {
    focusedKey = focusedItem.parentKey;
  }

  let margin = cardViewLayout.margin || 0;
  let virtualizer = cardViewLayout.virtualizer;
  let scrollToItem = useCallback((key) => {
    virtualizer && virtualizer.scrollToItem(key, {
      duration: 0,
      offsetY: margin
    });
  }, [margin, virtualizer]);

  // TODO: does aria-row count and aria-col count need to be modified? Perhaps aria-col count needs to be omitted
  return (
    <CardViewContext.Provider value={{state, isQuiet, layout: cardViewLayout, cardOrientation}}>
      <Virtualizer
        {...gridProps}
        {...styleProps}
        className={classNames(styles, 'spectrum-CardView')}
        ref={domRef}
        focusedKey={focusedKey}
        scrollDirection="vertical"
        layout={cardViewLayout}
        collection={gridCollection}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
        renderWrapper={renderWrapper}
        transitionDuration={isLoading ? 160 : 220}
        scrollToItem={scrollToItem}>
        {(type, item) => {
          if (type === 'item') {
            return (
              <InternalCard item={item} />
            );
          } else if (type === 'loader') {
            return (
              <CenteredWrapper>
                <ProgressCircle
                  isIndeterminate
                  aria-label={state.collection.size > 0 ? formatMessage('loadingMore') : formatMessage('loading')} />
              </CenteredWrapper>
            );
          } else if (type === 'placeholder') {
            let emptyState = renderEmptyState ? renderEmptyState() : null;
            if (emptyState == null) {
              return null;
            }

            return (
              <CenteredWrapper>
                {emptyState}
              </CenteredWrapper>
            );
          }
        }}
      </Virtualizer>
    </CardViewContext.Provider>

  );
}

function CenteredWrapper({children}) {
  let {state} = useCardViewContext();
  return (
    <div
      role="row"
      aria-rowindex={state.collection.size + 1}
      className={classNames(styles, 'spectrum-CardView-centeredWrapper')}>
      <div role="gridcell">
        {children}
      </div>
    </div>
  );
}

function InternalCard(props) {
  let {
    item
  } = props;
  let cellNode = [...item.childNodes][0];
  let {state, cardOrientation, isQuiet, layout} = useCardViewContext();

  let layoutType = layout.layoutType;
  let rowRef = useRef();
  let cellRef = useRef<DOMRefValue<HTMLDivElement>>();
  let unwrappedRef = useUnwrapDOMRef(cellRef);

  let {rowProps: gridRowProps} = useGridRow({
    node: item,
    isVirtualized: true
  }, state, rowRef);

  let {gridCellProps} = useGridCell({
    node: cellNode,
    focusMode: 'cell'
  }, state, unwrappedRef);

  // Prevent space key from scrolling the CardView if triggered on a disabled item or on a Card in a selectionMode="none" CardView.
  let allowsInteraction = state.selectionManager.selectionMode !== 'none';
  let isDisabled = !allowsInteraction || state.disabledKeys.has(item.key);

  let onKeyDown = (e) => {
    if (e.key === ' ' && isDisabled) {
      e.preventDefault();
    }
  };

  let rowProps = mergeProps(
    gridRowProps,
    {onKeyDown}
  );

  if (layoutType === 'grid' || layoutType === 'gallery') {
    isQuiet = true;
  }

  if (layoutType !== 'grid') {
    cardOrientation = 'vertical';
  }

  // We don't want to focus the checkbox (or any other focusable elements) within the Card
  // when pressing the arrow keys so we delete the key down handler here. Arrow key navigation between
  // the cards in the CardView is handled by useGrid => useSelectableCollection instead.
  delete gridCellProps.onKeyDownCapture;
  return (
    <div {...rowProps} ref={rowRef} className={classNames(styles, 'spectrum-CardView-row')}>
      <CardBase
        ref={cellRef}
        articleProps={gridCellProps}
        isQuiet={isQuiet}
        orientation={cardOrientation}
        item={item}
        layout={layoutType}>
        {item.rendered}
      </CardBase>
    </div>
  );
}

/**
 * TODO: Add description of component here.
 */
const _CardView = React.forwardRef(CardView) as <T>(props: SpectrumCardViewProps<T> & {ref?: DOMRef<HTMLDivElement>}) => ReactElement;
export {_CardView as CardView};
