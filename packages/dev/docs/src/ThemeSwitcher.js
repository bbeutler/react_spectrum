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

import {ActionButton} from '@react-spectrum/button';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';
import {Provider} from '@react-spectrum/provider';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styles from './docs.css';
import {theme} from '@react-spectrum/theme-default';

function useCurrentColorScheme() {
  let mq = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)'), []);
  let getCurrentColorScheme = useCallback(() => localStorage.theme || (mq.matches ? 'dark' : 'light'), [mq]);
  let [colorScheme, setColorScheme] = useState(() => getCurrentColorScheme());

  useEffect(() => {
    let onChange = () => {
      setColorScheme(getCurrentColorScheme());
    };

    mq.addListener(onChange);
    window.addEventListener('storage', onChange);
    return () => {
      mq.removeListener(onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [getCurrentColorScheme, mq]);

  return colorScheme;
}

export function ThemeProvider({children, colorScheme: colorSchemeProp, UNSAFE_className}) {
  let colorScheme = useCurrentColorScheme();

  return (
    <Provider theme={theme} colorScheme={colorSchemeProp || colorScheme} UNSAFE_className={UNSAFE_className}>
      {children}
    </Provider>
  );
}

export function Snippet({children}) {
  return <ThemeProvider UNSAFE_className={styles.snippet}>{children}</ThemeProvider>;
}

export function Example({children, colorScheme}) {
  return (
    <ThemeProvider colorScheme={colorScheme} UNSAFE_className={styles.example}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export function ThemeSwitcher() {
  let colorScheme = useCurrentColorScheme();
  let onPress = () => {
    localStorage.theme = (colorScheme === 'dark' ? 'light' : 'dark');
    window.dispatchEvent(new Event('storage'));
  };
  let label = colorScheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <div title={label} role="presentation">
      <ActionButton
        aria-label={label}
        onPress={onPress}>
        {colorScheme === 'dark' ? <Light /> : <Moon />}
      </ActionButton>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null};
  }

  static getDerivedStateFromError(e) {
    return {error: e.message};
  }

  render() {
    if (this.state.error) {
      return <div>An error occurred while rendering the example.</div>;
    }

    return this.props.children;
  }
}
