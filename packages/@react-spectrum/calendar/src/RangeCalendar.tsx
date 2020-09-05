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

import {CalendarBase} from './CalendarBase';
import {createCalendar} from '@internationalized/date';
import {createDOMRef} from '@react-spectrum/utils';
import {DateValue, SpectrumRangeCalendarProps} from '@react-types/calendar';
import {FocusableRef} from '@react-types/shared';
import React, {ReactElement, useImperativeHandle, useMemo, useRef} from 'react';
import {useLocale} from '@react-aria/i18n';
import {useProviderProps} from '@react-spectrum/provider';
import {useRangeCalendar} from '@react-aria/calendar';
import {useRangeCalendarState} from '@react-stately/calendar';

function RangeCalendar<T extends DateValue>(props: SpectrumRangeCalendarProps<T>, ref: FocusableRef<HTMLElement>) {
  props = useProviderProps(props);
  let {visibleMonths = 1} = props;
  let visibleDuration = useMemo(() => ({months: visibleMonths}), [visibleMonths]);
  let {locale} = useLocale();
  let state = useRangeCalendarState({
    ...props,
    locale,
    visibleDuration,
    createCalendar
  });

  let domRef = useRef();
  useImperativeHandle(ref, () => ({
    ...createDOMRef(domRef),
    focus() {
      state.setFocused(true);
    }
  }));

  let {calendarProps, prevButtonProps, nextButtonProps, errorMessageProps} = useRangeCalendar(props, state, domRef);

  return (
    <CalendarBase
      {...props}
      state={state}
      calendarRef={domRef}
      calendarProps={calendarProps}
      prevButtonProps={prevButtonProps}
      nextButtonProps={nextButtonProps}
      errorMessageProps={errorMessageProps} />
  );
}

/**
 * RangeCalendars display a grid of days in one or more months and allow users to select a contiguous range of dates.
 */
const _RangeCalendar = React.forwardRef(RangeCalendar) as <T extends DateValue>(props: SpectrumRangeCalendarProps<T> & {ref?: FocusableRef<HTMLElement>}) => ReactElement;
export {_RangeCalendar as RangeCalendar};
