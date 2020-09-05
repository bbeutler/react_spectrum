import addons, { types } from '@storybook/addons';
import {getQueryParams} from '@storybook/client-api';
import {locales} from '../../constants';
import React, {useEffect, useState} from 'react';

const providerValuesFromUrl = Object.entries(getQueryParams()).reduce((acc, [k, v]) => {
  if (k.includes('providerSwitcher-')) {
    return { ...acc, [k.replace('providerSwitcher-', '')]: v };
  }
  return acc;
}, {});

let THEMES = [
  {label: 'Auto', value: ''},
  {label: "Light", value: "light"},
  {label: "Lightest", value: "lightest"},
  {label: "Dark", value: "dark"},
  {label: "Darkest", value: "darkest"}
];

let SCALES = [
  {label: 'Auto', value: ''},
  {label: "Medium", value: "medium"},
  {label: "Large", value: "large"}
];

let TOAST_POSITIONS = [
  {label: 'top', value: 'top'},
  {label: 'top left', value: 'top left'},
  {label: 'top center', value: 'top center'},
  {label: 'top right', value: 'top right'},
  {label: 'bottom', value: 'bottom'},
  {label: 'bottom left', value: 'bottom left'},
  {label: 'bottom center', value: 'bottom center'},
  {label: 'bottom right', value: 'bottom right'}
];

function ProviderFieldSetter({api}) {
  let [values, setValues] = useState({locale: providerValuesFromUrl.locale || undefined, theme: providerValuesFromUrl.theme || undefined, scale: providerValuesFromUrl.scale || undefined, toastPosition: providerValuesFromUrl.toastPosition || 'bottom'});
  let channel = addons.getChannel();
  let onLocaleChange = (e) => {
    let newValue = e.target.value || undefined;
    setValues((old) => {
      let next = {...old, locale: newValue};
      channel.emit('provider/updated', next);
      return next;
    });
  };
  let onThemeChange = (e) => {
    let newValue = e.target.value || undefined;
    setValues((old) => {
      let next = {...old, theme: newValue};
      channel.emit('provider/updated', next);
      return next;
    });
  };
  let onScaleChange = (e) => {
    let newValue = e.target.value || undefined;
    setValues((old) => {
      let next = {...old, scale: newValue};
      channel.emit('provider/updated', next);
      return next;
    });
  };
  let onToastPositionChange = (e) => {
    let newValue = e.target.value;
    setValues((old) => {
      let next = {...old, toastPosition: newValue};
      channel.emit('provider/updated', next);
      return next;
    });
  };
  useEffect(() => {
    let storySwapped = () => {
      channel.emit('provider/updated', values);
    };
    channel.on('rsp/ready-for-update', storySwapped);
    return () => {
      channel.removeListener('rsp/ready-for-update', storySwapped);
    };
  });

  useEffect(() => {
    api.setQueryParams({
      'providerSwitcher-locale': values.locale || '',
      'providerSwitcher-theme': values.theme || '',
      'providerSwitcher-scale': values.scale || '',
      'providerSwitcher-toastPosition': values.toastPosition || '',
    });
  });

  return (
    <div style={{display: 'flex', alignItems: 'center', fontSize: '12px'}}>
      <div style={{marginRight: '10px'}}>
        <label htmlFor="locale">Locale: </label>
        <select id="locale" name="locale" onChange={onLocaleChange} value={values.locale}>
          {locales.map(locale => <option key={locale.label} value={locale.value}>{locale.label}</option>)}
        </select>
      </div>
      <div style={{marginRight: '10px'}}>
        <label htmlFor="theme">Theme: </label>
        <select id="theme" name="theme" onChange={onThemeChange} value={values.theme}>
          {THEMES.map(theme => <option key={theme.label} value={theme.value}>{theme.label}</option>)}
        </select>
      </div>
      <div style={{marginRight: '10px'}}>
        <label htmlFor="scale">Scale: </label>
        <select id="scale" name="scale" onChange={onScaleChange} value={values.scale}>
          {SCALES.map(scale => <option key={scale.label} value={scale.value}>{scale.label}</option>)}
        </select>
      </div>
      <div style={{marginRight: '10px'}}>
        <label htmlFor="toastposition">Toast Position: </label>
        <select id="toastposition" name="toastposition" onChange={onToastPositionChange} value={values.toastPosition}>
          {TOAST_POSITIONS.map(position => <option key={position.label} value={position.value}>{position.label}</option>)}
        </select>
      </div>
    </div>
  )
}

addons.register('ProviderSwitcher', (api) => {
  addons.add('ProviderSwitcher', {
    title: 'viewport',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <ProviderFieldSetter api={api} />,
  });
});
