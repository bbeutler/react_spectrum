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

import {act, fireEvent, render, within} from '@react-spectrum/test-utils';
import {DataTransfer, DataTransferItem, DragEvent} from './mocks';
import {DraggableCollectionExample} from '../stories/DraggableCollection';
import {Droppable} from './examples';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {theme} from '@react-spectrum/theme-default';
import userEvent from '@testing-library/user-event';

describe('useDraggableCollection', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 0));
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 50
    }));

    jest.useFakeTimers('legacy');
  });

  afterEach(() => {
    act(() => jest.runAllTimers());
  });

  describe('native drag and drop', () => {
    it('should drag a single item', async () => {
      let onDragStart = jest.fn();
      let onDragMove = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      let dataTransfer = new DataTransfer();
      fireEvent(cells[1], new DragEvent('dragstart', {dataTransfer, clientX: 0, clientY: 0}));
      act(() => jest.runAllTimers());
      expect(cells[0]).not.toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 0,
        y: 0,
        keys: new Set(['bar'])
      });

      expect([...dataTransfer.items]).toEqual([
        new DataTransferItem('folder', 'Bar'),
        new DataTransferItem('text/plain', 'Bar'),
        new DataTransferItem('application/vnd.react-aria.items+json', JSON.stringify([{folder: 'Bar', 'text/plain': 'Bar'}]))
      ]);
      expect(dataTransfer._dragImage.node.textContent).toBe('Bar');
      expect(dataTransfer._dragImage.node.querySelector('.badge')).toBeNull();

      fireEvent(cells[1], new DragEvent('drag', {dataTransfer, clientX: 1, clientY: 1}));
      expect(onDragMove).toHaveBeenCalledTimes(1);
      expect(onDragMove).toHaveBeenCalledWith({
        type: 'dragmove',
        x: 1,
        y: 1,
        keys: new Set(['bar'])
      });

      fireEvent(droppable, new DragEvent('dragenter', {dataTransfer, clientX: 1, clientY: 1}));
      fireEvent(droppable, new DragEvent('dragover', {dataTransfer, clientX: 2, clientY: 2}));
      fireEvent(droppable, new DragEvent('drop', {dataTransfer, clientX: 2, clientY: 2}));
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 2,
        y: 2,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Bar');

      fireEvent(cells[1], new DragEvent('dragend', {dataTransfer, clientX: 2, clientY: 2}));
      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 2,
        y: 2,
        dropOperation: 'move',
        keys: new Set(['bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(2);
      expect(cells.map(c => c.textContent)).toEqual(['Foo', 'Baz']);
    });

    it('should drag multiple selected items', async () => {
      let onDragStart = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let rows = within(grid).getAllByRole('row');
      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      userEvent.click(cells[0]);
      expect(rows[0]).toHaveAttribute('aria-selected', 'true');
      userEvent.click(cells[1]);
      expect(rows[1]).toHaveAttribute('aria-selected', 'true');

      let dataTransfer = new DataTransfer();
      fireEvent(cells[1], new DragEvent('dragstart', {dataTransfer, clientX: 0, clientY: 0}));
      act(() => jest.runAllTimers());
      expect(cells[0]).toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 0,
        y: 0,
        keys: new Set(['foo', 'bar'])
      });

      expect([...dataTransfer.items]).toEqual([
        new DataTransferItem('folder', 'Foo'),
        new DataTransferItem('text/plain', 'Foo\nBar'),
        new DataTransferItem('application/vnd.react-aria.items+json', JSON.stringify([
          {folder: 'Foo', 'text/plain': 'Foo'},
          {folder: 'Bar', 'text/plain': 'Bar'}
        ]))
      ]);
      expect(dataTransfer._dragImage.node.querySelector('span').textContent).toBe('Bar');
      expect(dataTransfer._dragImage.node.querySelector('.badge').textContent).toBe('2');

      fireEvent(droppable, new DragEvent('dragenter', {dataTransfer, clientX: 1, clientY: 1}));
      fireEvent(droppable, new DragEvent('dragover', {dataTransfer, clientX: 2, clientY: 2}));
      fireEvent(droppable, new DragEvent('drop', {dataTransfer, clientX: 2, clientY: 2}));
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 2,
        y: 2,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          },
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Foo');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Foo');

      expect(await onDrop.mock.calls[0][0].items[1].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[1].getText('folder')).toBe('Bar');

      fireEvent(cells[1], new DragEvent('dragend', {dataTransfer, clientX: 2, clientY: 2}));
      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 2,
        y: 2,
        dropOperation: 'move',
        keys: new Set(['foo', 'bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(1);
      expect(cells.map(c => c.textContent)).toEqual(['Baz']);
    });

    it('should only drag dragged item when not selected', async () => {
      let onDragStart = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let rows = within(grid).getAllByRole('row');
      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      userEvent.click(cells[0]);
      expect(rows[0]).toHaveAttribute('aria-selected', 'true');

      let dataTransfer = new DataTransfer();
      fireEvent(cells[1], new DragEvent('dragstart', {dataTransfer, clientX: 0, clientY: 0}));
      act(() => jest.runAllTimers());
      expect(cells[0]).not.toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 0,
        y: 0,
        keys: new Set(['bar'])
      });

      expect([...dataTransfer.items]).toEqual([
        new DataTransferItem('folder', 'Bar'),
        new DataTransferItem('text/plain', 'Bar'),
        new DataTransferItem('application/vnd.react-aria.items+json', JSON.stringify([
          {folder: 'Bar', 'text/plain': 'Bar'}
        ]))
      ]);
      expect(dataTransfer._dragImage.node.querySelector('span').textContent).toBe('Bar');
      expect(dataTransfer._dragImage.node.querySelector('.badge')).toBeNull();

      fireEvent(droppable, new DragEvent('dragenter', {dataTransfer, clientX: 1, clientY: 1}));
      fireEvent(droppable, new DragEvent('dragover', {dataTransfer, clientX: 2, clientY: 2}));
      fireEvent(droppable, new DragEvent('drop', {dataTransfer, clientX: 2, clientY: 2}));
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 2,
        y: 2,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Bar');

      fireEvent(cells[1], new DragEvent('dragend', {dataTransfer, clientX: 2, clientY: 2}));
      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 2,
        y: 2,
        dropOperation: 'move',
        keys: new Set(['bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(2);
      expect(cells.map(c => c.textContent)).toEqual(['Foo', 'Baz']);
    });
  });

  describe('keyboard', () => {
    afterEach(() => {
      fireEvent.keyDown(document.body, {key: 'Escape'});
      fireEvent.keyUp(document.body, {key: 'Escape'});
    });

    it('should drag a single item', async () => {
      let onDragStart = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      userEvent.tab();
      expect(document.activeElement).toBe(cells[0]);

      fireEvent.keyDown(cells[0], {key: 'ArrowDown'});
      fireEvent.keyUp(cells[0], {key: 'ArrowDown'});
      expect(document.activeElement).toBe(cells[1]);

      fireEvent.keyDown(cells[1], {key: 'ArrowRight'});
      fireEvent.keyUp(cells[1], {key: 'ArrowRight'});
      let dragButton = within(cells[1]).getByRole('button');
      expect(document.activeElement).toBe(dragButton);

      fireEvent.keyDown(dragButton, {key: 'Enter'});
      fireEvent.keyUp(dragButton, {key: 'Enter'});
      act(() => jest.runAllTimers());
      expect(cells[0]).not.toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 50,
        y: 25,
        keys: new Set(['bar'])
      });

      expect(document.activeElement).toBe(droppable);

      fireEvent.keyDown(dragButton, {key: 'Enter'});
      fireEvent.keyUp(dragButton, {key: 'Enter'});
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 50,
        y: 25,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Bar');

      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 50,
        y: 25,
        dropOperation: 'move',
        keys: new Set(['bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(2);
      expect(cells.map(c => c.textContent)).toEqual(['Foo', 'Baz']);
    });

    it('should drag multiple selected items', async () => {
      let onDragStart = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let rows = within(grid).getAllByRole('row');
      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      userEvent.tab();
      expect(document.activeElement).toBe(cells[0]);

      fireEvent.keyDown(cells[0], {key: ' '});
      fireEvent.keyUp(cells[0], {key: ' '});
      expect(rows[0]).toHaveAttribute('aria-selected', 'true');

      fireEvent.keyDown(cells[0], {key: 'ArrowDown'});
      fireEvent.keyUp(cells[0], {key: 'ArrowDown'});
      expect(document.activeElement).toBe(cells[1]);

      fireEvent.keyDown(cells[1], {key: ' '});
      fireEvent.keyUp(cells[1], {key: ' '});
      expect(rows[1]).toHaveAttribute('aria-selected', 'true');

      fireEvent.keyDown(cells[1], {key: 'ArrowRight'});
      fireEvent.keyUp(cells[1], {key: 'ArrowRight'});
      let dragButton = within(cells[1]).getByRole('button');
      expect(document.activeElement).toBe(dragButton);

      fireEvent.keyDown(dragButton, {key: 'Enter'});
      fireEvent.keyUp(dragButton, {key: 'Enter'});
      act(() => jest.runAllTimers());
      expect(cells[0]).toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 50,
        y: 25,
        keys: new Set(['foo', 'bar'])
      });

      expect(document.activeElement).toBe(droppable);

      fireEvent.keyDown(dragButton, {key: 'Enter'});
      fireEvent.keyUp(dragButton, {key: 'Enter'});
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 50,
        y: 25,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          },
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Foo');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Foo');

      expect(await onDrop.mock.calls[0][0].items[1].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[1].getText('folder')).toBe('Bar');

      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 50,
        y: 25,
        dropOperation: 'move',
        keys: new Set(['foo', 'bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(1);
      expect(cells.map(c => c.textContent)).toEqual(['Baz']);
    });

    it('should only drag current item when not selected', async () => {
      let onDragStart = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let rows = within(grid).getAllByRole('row');
      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      userEvent.tab();
      expect(document.activeElement).toBe(cells[0]);

      fireEvent.keyDown(cells[0], {key: 'ArrowDown'});
      fireEvent.keyUp(cells[0], {key: 'ArrowDown'});
      expect(document.activeElement).toBe(cells[1]);

      fireEvent.keyDown(cells[1], {key: ' '});
      fireEvent.keyUp(cells[1], {key: ' '});
      expect(rows[1]).toHaveAttribute('aria-selected', 'true');

      fireEvent.keyDown(cells[1], {key: 'ArrowRight'});
      fireEvent.keyUp(cells[1], {key: 'ArrowRight'});
      let dragButton = within(cells[1]).getByRole('button');
      expect(document.activeElement).toBe(dragButton);

      fireEvent.keyDown(dragButton, {key: 'Enter'});
      fireEvent.keyUp(dragButton, {key: 'Enter'});
      act(() => jest.runAllTimers());
      expect(cells[0]).not.toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 50,
        y: 25,
        keys: new Set(['bar'])
      });

      expect(document.activeElement).toBe(droppable);

      fireEvent.keyDown(dragButton, {key: 'Enter'});
      fireEvent.keyUp(dragButton, {key: 'Enter'});
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 50,
        y: 25,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Bar');

      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 50,
        y: 25,
        dropOperation: 'move',
        keys: new Set(['bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(2);
      expect(cells.map(c => c.textContent)).toEqual(['Foo', 'Baz']);
    });
  });

  describe('screen reader', () => {
    beforeEach(() => {
      // reset focus visible state
      fireEvent.focus(document.body);
    });

    afterEach(() => {
      fireEvent.keyDown(document.body, {key: 'Escape'});
      fireEvent.keyUp(document.body, {key: 'Escape'});
    });

    it('should drag a single item', async () => {
      let onDragStart = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      let dragButton = within(cells[1]).getByRole('button');
      expect(dragButton).toHaveAttribute('aria-label', 'Drag Bar');
      fireEvent.focus(dragButton);
      fireEvent.click(dragButton);
      act(() => jest.runAllTimers());
      expect(cells[0]).not.toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 50,
        y: 25,
        keys: new Set(['bar'])
      });

      expect(document.activeElement).toBe(dragButton);
      act(() => droppable.focus());

      fireEvent.click(droppable);
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 50,
        y: 25,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Bar');

      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 50,
        y: 25,
        dropOperation: 'move',
        keys: new Set(['bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(2);
      expect(cells.map(c => c.textContent)).toEqual(['Foo', 'Baz']);
    });

    it('should drag multiple selected items', async () => {
      let onDragStart = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let rows = within(grid).getAllByRole('row');
      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      fireEvent.focus(cells[0]);
      fireEvent.click(cells[0]);
      expect(rows[0]).toHaveAttribute('aria-selected', 'true');
      fireEvent.click(cells[1]);
      expect(rows[1]).toHaveAttribute('aria-selected', 'true');

      let dragButton = within(cells[1]).getByRole('button');
      expect(dragButton).toHaveAttribute('aria-label', 'Drag 2 selected items');
      fireEvent.focus(dragButton);
      fireEvent.click(dragButton);
      act(() => jest.runAllTimers());
      expect(cells[0]).toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 50,
        y: 25,
        keys: new Set(['foo', 'bar'])
      });

      expect(document.activeElement).toBe(dragButton);
      act(() => droppable.focus());

      fireEvent.click(droppable);
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 50,
        y: 25,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          },
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Foo');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Foo');

      expect(await onDrop.mock.calls[0][0].items[1].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[1].getText('folder')).toBe('Bar');

      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 50,
        y: 25,
        dropOperation: 'move',
        keys: new Set(['foo', 'bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(1);
      expect(cells.map(c => c.textContent)).toEqual(['Baz']);
    });

    it('should drag only clicked item when not selected', async () => {
      let onDragStart = jest.fn();
      let onDragEnd = jest.fn();
      let onDrop = jest.fn();
      let tree = render(
        <Provider theme={theme}>
          <DraggableCollectionExample onDragStart={onDragStart} onDragEnd={onDragEnd} />
          <Droppable onDrop={onDrop} />
        </Provider>
      );

      let grid = tree.getByRole('grid');
      let droppable = tree.getByText('Drop here');

      let rows = within(grid).getAllByRole('row');
      let cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(3);

      fireEvent.focus(cells[0]);
      fireEvent.click(cells[0]);
      expect(rows[0]).toHaveAttribute('aria-selected', 'true');

      let dragButton = within(cells[1]).getByRole('button');
      expect(dragButton).toHaveAttribute('aria-label', 'Drag Bar');
      fireEvent.focus(dragButton);
      fireEvent.click(dragButton);
      act(() => jest.runAllTimers());
      expect(cells[0]).not.toHaveClass('is-dragging');
      expect(cells[1]).toHaveClass('is-dragging');
      expect(cells[2]).not.toHaveClass('is-dragging');

      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart).toHaveBeenCalledWith({
        type: 'dragstart',
        x: 50,
        y: 25,
        keys: new Set(['bar'])
      });

      expect(document.activeElement).toBe(dragButton);
      act(() => droppable.focus());

      fireEvent.click(droppable);
      act(() => jest.runAllTimers());
      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 50,
        y: 25,
        dropOperation: 'move',
        items: [
          {
            kind: 'text',
            types: new Set(['text/plain', 'folder']),
            getText: expect.any(Function)
          }
        ]
      });

      expect(await onDrop.mock.calls[0][0].items[0].getText('text/plain')).toBe('Bar');
      expect(await onDrop.mock.calls[0][0].items[0].getText('folder')).toBe('Bar');

      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledWith({
        type: 'dragend',
        x: 50,
        y: 25,
        dropOperation: 'move',
        keys: new Set(['bar'])
      });

      cells = within(grid).getAllByRole('gridcell');
      expect(cells).toHaveLength(2);
      expect(cells.map(c => c.textContent)).toEqual(['Foo', 'Baz']);
    });
  });
});
