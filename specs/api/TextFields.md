<!-- Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License. -->

# Text Fields

```typescript
interface TextField extends InputBase, TextInputBase, TextInputDOM, ValueBase<string>, Labelable, TextInputDOMProps, StyleProps {
  icon?: ReactNode,
  isQuiet?: boolean,
  validationTooltip?: ReactNode
}

type TextArea = TextField;

interface SearchField extends TextField {
  onSubmit?: (value: string) => void,
  onClear?: () => void
}

interface SearchWithin extends InputBase, TextInputBase, Labelable, DOMProps, StyleProps {
  // not extending from ValueBase because we want onValueChange instead of onChange
  value?: string,
  defaultValue?: string,
  onValueChange: (value: string) => void,
  onSubmit: (value: string) => void,

  scope?: string,
  defaultScope?: string,
  onScopeChange: (scope: string) => void,
  children: ReactElement<MenuItem> | ReactElement<MenuItem>[],
}

// should this contain a textfield or other input instead of specifically being a textfield?
interface InlineEditor extends TextField {
  onCancel?: () => void
}
```


## Changes (all)
| **v2**        | **v3**                      | **Notes** |
| ------------- | --------------------------- | --------- |
| `<Textfield>` | `<TextField>`               |           |
| `<Textarea>`  | `<TextArea>`                |           |
| `quiet`       | `isQuiet`.                  |           |
| `disabled`    | `isDisabled`                |           |
| `required`    | `isRequired`                |           |
| `invalid`     | `validationState="invalid"` |           |
| `readOnly`    | `isReadOnly`                |           |
| -             | `icon`                      | added     |
| -             | `validationTooltip`         | added     |
| -             | `label`                     | added     |
| -             | `labelPosition`             | added     |
| -             | `labelAlign`                | added     |
| -             | `necessityIndicator`        | added     |

## SearchField Changes
| **v2**                                     | **v3**                  | **Notes**                                        |
| ------------------------------------------ | ----------------------- | ------------------------------------------------ |
| `<Search>`                                 | `<SearchField>`         |                                                  |
| `onChange(value, e, {from})` (search only) | `onChange(value)`       | removed `from` parameter. use `onClear` instead. |
| -                                          | `onClear` (search only) | added                                            |
| `icon`                                     | -                       | moved to TextField                               |

## SearchWithin Changes
| **v2**         | **v3**     | **Notes** |
| -------------- | ---------- | --------- |
| `scopeOptions` | `children` |           |
