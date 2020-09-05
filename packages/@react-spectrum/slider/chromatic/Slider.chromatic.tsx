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

import {Meta, Story} from '@storybook/react';
import React from 'react';
import {Slider} from '../';
import {SpectrumSliderProps} from '@react-types/slider';

const meta: Meta<SpectrumSliderProps> = {
  title: 'Slider',
  component: Slider
};

export default meta;


const Template = (): Story<SpectrumSliderProps> => (args) => (
  <Slider {...args} />
);


export const Default = Template().bind({});
Default.args = {label: 'Slider label'};

export const Disabled = Template().bind({});
Disabled.args = {...Default.args, isDisabled: true};
/*
Doesn't exist yet
export const Vertical = Template().bind({});
Vertical.args = {...Default.args, orientation: 'vertical'};
*/

export const LabelPositionSide = Template().bind({});
LabelPositionSide.args = {...Default.args, labelPosition: 'side'};

/*
Not supported but prop exists
export const LabelAlignEnd = Template().bind({});
LabelAlignEnd.args = {...Default.args, labelAlign: 'end', showValueLabel: false};
*/

export const Value50 = Template().bind({});
Value50.args = {...Default.args, defaultValue: 50};

export const Filled = Template().bind({});
Filled.args = {...Value50.args, isFilled: true};

export const FillOffset = Template().bind({});
FillOffset.args = {...Filled.args, defaultValue: 80, fillOffset: 50};

export const TrackGradient = Template().bind({});
TrackGradient.args = {...Default.args, isFilled: true, defaultValue: 30, trackGradient: ['white', 'rgba(177,141,32,1)']};
