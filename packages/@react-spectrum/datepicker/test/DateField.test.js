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

import {act, render as render_, within} from '@react-spectrum/test-utils';
import {CalendarDate} from '@internationalized/date';
import {DateField} from '../';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {theme} from '@react-spectrum/theme-default';

function render(el) {
  if (el.type === Provider) {
    return render_(el);
  }
  let res = render_(
    <Provider theme={theme}>
      {el}
    </Provider>
  );
  return {
    ...res,
    rerender(el) {
      return res.rerender(<Provider theme={theme}>{el}</Provider>);
    }
  };
}

describe('DateField', function () {
  describe('labeling', function () {
    it('should support labeling', function () {
      let {getAllByRole, getByText} = render(<DateField label="Date" />);

      let label = getByText('Date');

      let combobox = getAllByRole('group')[0];
      expect(combobox).toHaveAttribute('aria-labelledby', label.id);

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('id');
        let segmentId = segment.getAttribute('id');
        expect(segment).toHaveAttribute('aria-labelledby', `${label.id} ${segmentId}`);
      }
    });

    it('should support labeling with aria-label', function () {
      let {getByRole, getAllByRole} = render(<DateField aria-label="Birth date" />);

      let field = getByRole('group');
      expect(field).toHaveAttribute('aria-label', 'Birth date');
      expect(field).toHaveAttribute('id');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('id');
        expect(segment.getAttribute('aria-label').startsWith('Birth date ')).toBe(true);
        expect(segment).not.toHaveAttribute('aria-labelledby');
      }
    });

    it('should support labeling with aria-labelledby', function () {
      let {getByRole, getAllByRole} = render(<DateField aria-labelledby="foo" />);

      let combobox = getByRole('group');
      expect(combobox).not.toHaveAttribute('aria-label');
      expect(combobox).toHaveAttribute('aria-labelledby', 'foo');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('id');
        let segmentId = segment.getAttribute('id');
        expect(segment).toHaveAttribute('aria-labelledby', `foo ${segmentId}`);
      }
    });

    it('should support help text description', function () {
      let {getByRole, getAllByRole} = render(<DateField label="Date" description="Help text" />);

      let group = getByRole('group');
      expect(group).toHaveAttribute('aria-describedby');

      let description = document.getElementById(group.getAttribute('aria-describedby'));
      expect(description).toHaveTextContent('Help text');

      let segments = getAllByRole('spinbutton');
      expect(segments[0]).toHaveAttribute('aria-describedby', group.getAttribute('aria-describedby'));

      for (let segment of segments.slice(1)) {
        expect(segment).not.toHaveAttribute('aria-describedby');
      }
    });

    it('should support error message', function () {
      let {getByRole, getAllByRole} = render(<DateField label="Date" errorMessage="Error message" validationState="invalid" />);

      let group = getByRole('group');
      expect(group).toHaveAttribute('aria-describedby');

      let description = document.getElementById(group.getAttribute('aria-describedby'));
      expect(description).toHaveTextContent('Error message');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-describedby', group.getAttribute('aria-describedby'));
      }
    });

    it('should not display error message if not invalid', function () {
      let {getByRole, getAllByRole} = render(<DateField label="Date" errorMessage="Error message" />);

      let group = getByRole('group');
      expect(group).not.toHaveAttribute('aria-describedby');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).not.toHaveAttribute('aria-describedby');
      }
    });

    it('should support help text with a value', function () {
      let {getByRole, getAllByRole} = render(<DateField label="Date" description="Help text" value={new CalendarDate(2020, 2, 3)} />);

      let group = getByRole('group');
      expect(group).toHaveAttribute('aria-describedby');

      let description = group.getAttribute('aria-describedby').split(' ').map(d => document.getElementById(d).textContent).join(' ');
      expect(description).toBe('Selected Date: February 3, 2020 Help text');

      let segments = getAllByRole('spinbutton');
      expect(segments[0]).toHaveAttribute('aria-describedby', group.getAttribute('aria-describedby'));

      for (let segment of segments.slice(1)) {
        expect(segment).not.toHaveAttribute('aria-describedby');
      }
    });

    it('should support error message with a value', function () {
      let {getByRole, getAllByRole} = render(<DateField label="Date" errorMessage="Error message" validationState="invalid" value={new CalendarDate(2020, 2, 3)} />);

      let group = getByRole('group');
      expect(group).toHaveAttribute('aria-describedby');

      let description = group.getAttribute('aria-describedby').split(' ').map(d => document.getElementById(d).textContent).join(' ');
      expect(description).toBe('Selected Date: February 3, 2020 Error message');

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-describedby', group.getAttribute('aria-describedby'));
      }
    });

    it('should support format help text', function () {
      let {getByRole, getByText, getAllByRole} = render(<DateField label="Date" showFormatHelpText />);

      // Not needed in aria-described by because each segment has a label already, so this would be duplicative.
      let group = getByRole('group');
      expect(group).not.toHaveAttribute('aria-describedby');

      expect(getByText('month / day / year')).toBeVisible();

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).not.toHaveAttribute('aria-describedby');
      }
    });
  });

  describe('basics', function () {
    it('should support focusing via a ref', function () {
      let ref = React.createRef();
      let {getAllByRole} = render(<DateField label="Date" ref={ref} />);
      expect(ref.current).toHaveProperty('focus');

      act(() => ref.current.focus());
      expect(document.activeElement).toBe(getAllByRole('spinbutton')[0]);
    });

    it('should support autoFocus', function () {
      let {getAllByRole} = render(<DateField label="Date" autoFocus />);
      expect(document.activeElement).toBe(getAllByRole('spinbutton')[0]);
    });

    it('should pass through data attributes', function () {
      let {getByTestId} = render(<DateField label="Date" data-testid="foo" />);
      expect(getByTestId('foo')).toHaveAttribute('role', 'group');
    });

    it('should return the outer most DOM element from the ref', function () {
      let ref = React.createRef();
      render(<DateField label="Date" ref={ref} />);
      expect(ref.current).toHaveProperty('UNSAFE_getDOMNode');

      let wrapper = ref.current.UNSAFE_getDOMNode();
      expect(wrapper).toBeInTheDocument();
      expect(within(wrapper).getByText('Date')).toBeInTheDocument();
      expect(within(wrapper).getAllByRole('spinbutton')[0]).toBeInTheDocument();
    });

    it('should respond to provider props', function () {
      let {getAllByRole} = render(
        <Provider theme={theme} isDisabled>
          <DateField label="Date" />
        </Provider>
      );

      let segments = getAllByRole('spinbutton');
      for (let segment of segments) {
        expect(segment).toHaveAttribute('aria-disabled', 'true');
      }
    });
  });
});
