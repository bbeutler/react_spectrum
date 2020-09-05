import {action} from '@storybook/addon-actions';
import {ErrorBoundary} from '@react-spectrum/story-utils';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {StoryMultiSlider, StoryThumb} from './StoryMultiSlider';
import {StoryRangeSlider} from './StoryRangeSlider';
import {StorySlider} from './StorySlider';

let message = 'Your browser may not support this set of format options.';

storiesOf('Slider (hooks)', module)
  .addDecorator(story => (
    <ErrorBoundary message={message}>{story()}</ErrorBoundary>
  ))
  .add(
    'single',
    () => <StorySlider label="Size" onChange={action('onChange')} onChangeEnd={action('onChangeEnd')} showTip />
  )
  .add(
    'single with big steps',
    () => <StorySlider label="Size" onChange={action('onChange')} onChangeEnd={action('onChangeEnd')} step={10} showTip />
  )
  .add(
    'single with origin',
    () => <StorySlider label="Exposure" origin={0} minValue={-5} maxValue={5} step={0.1} onChange={action('onChange')} onChangeEnd={action('onChangeEnd')} showTip />
  )
  .add(
    'single with aria label',
    () => <StorySlider aria-label="Size" onChange={action('onChange')} onChangeEnd={action('onChangeEnd')} showTip />
  )
  .add(
    'range',
    () => (<StoryRangeSlider
      label="Temperature"
      defaultValue={[25, 75]}
      onChange={action('onChange')}
      onChangeEnd={action('onChangeEnd')}
      showTip
      formatOptions={{
        style: 'unit',
        unit: 'celsius',
        unitDisplay: 'narrow'
      } as any} />)
  )
  .add(
    'range with aria-label',
    () => (<StoryRangeSlider
      aria-label="Temperature"
      defaultValue={[25, 75]}
      onChange={action('onChange')}
      onChangeEnd={action('onChangeEnd')}
      showTip
      formatOptions={{
        style: 'unit',
        unit: 'celsius',
        unitDisplay: 'narrow'
      } as any} />)
  )
  .add(
    '3 thumbs',
    () => (
      <StoryMultiSlider
        label="Three thumbs"
        onChange={action('onChange')}
        onChangeEnd={action('onChangeEnd')}
        defaultValue={[10, 40, 80]}>
        <StoryThumb label="A" />
        <StoryThumb label="B" />
        <StoryThumb label="C" />
      </StoryMultiSlider>
    )
  )
  .add(
    '3 thumbs with disabled',
    () => (
      <StoryMultiSlider
        label="Three thumbs"
        onChange={action('onChange')}
        onChangeEnd={action('onChangeEnd')}
        defaultValue={[10, 40, 80]}>
        <StoryThumb label="A" />
        <StoryThumb label="B" isDisabled />
        <StoryThumb label="C" />
      </StoryMultiSlider>
    )
  )
  .add(
    '8 thumbs with disabled',
    () => (
      <StoryMultiSlider
        label="9 thumbs - 5 disabled"
        onChange={action('onChange')}
        onChangeEnd={action('onChangeEnd')}
        defaultValue={[5, 10, 15, 30, 35, 40, 50, 75, 90]}>
        <StoryThumb label="A" isDisabled />
        <StoryThumb label="B" />
        <StoryThumb label="C" />
        <StoryThumb label="D" isDisabled />
        <StoryThumb label="E" isDisabled />
        <StoryThumb label="F" />
        <StoryThumb label="G" />
        <StoryThumb label="H" isDisabled />
        <StoryThumb label="I" isDisabled />
      </StoryMultiSlider>
    )
  )
  .add(
    '3 thumbs with aria-label',
    () => (
      <StoryMultiSlider
        aria-label="Three thumbs"
        onChange={action('onChange')}
        onChangeEnd={action('onChangeEnd')}
        defaultValue={[10, 40, 80]}>
        <StoryThumb aria-label="A" />
        <StoryThumb aria-label="B" />
        <StoryThumb aria-label="C" />
      </StoryMultiSlider>
    )
  )
  ;
