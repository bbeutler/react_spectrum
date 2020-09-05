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

import {action} from '@storybook/addon-actions';
import {ActionGroup, Flex, Heading, Text} from '@adobe/react-spectrum';
import Bookmark from '@spectrum-icons/workflow/Bookmark';
import {Button} from '@react-spectrum/button';
import {ButtonGroup} from '@react-spectrum/buttongroup';
import Calendar from '@spectrum-icons/workflow/Calendar';
import Dashboard from '@spectrum-icons/workflow/Dashboard';
import {Item, TabList, TabPanels, Tabs} from '..';
import {Picker} from '@react-spectrum/picker';
import React, {ReactNode, useState} from 'react';
import {SpectrumTabsProps} from '@react-types/tabs';
import {storiesOf} from '@storybook/react';
import {TextField} from '@react-spectrum/textfield';

storiesOf('Tabs', module)
  .add(
    'Default',
    () => render()
  )
  .add(
    'with falsy item key',
    () => renderWithFalsyKey()
  )
  .add(
    'defaultSelectedKey: val2',
    () => render({defaultSelectedKey: 'val2'})
  )
  .add(
    'controlled: selectedKey: val3',
    () => render({selectedKey: 'val3'})
  )
  .add(
    'orientation: vertical',
    () => render({orientation: 'vertical'}))
  .add(
    'density: compact',
    () => render({density: 'compact'}))
  .add(
    'isQuiet',
    () => render({isQuiet: true}))
  .add(
    'isQuiet, density: compact',
    () => render({isQuiet: true, density: 'compact'})
  )
  .add(
    'density: compact, orientation: vertical',
    () => render({density: 'compact', orientation: 'vertical'})
  )
  .add(
    'icons',
    () => renderWithIcons())
  .add(
    'icons, density: compact',
    () => renderWithIcons({density: 'compact'})
  )
  .add(
    'icons, orientation: vertical',
    () => renderWithIcons({orientation: 'vertical'})
  )
  .add(
    'icons, density: compact, orientation: vertical',
    () => renderWithIcons({orientation: 'vertical', density: 'compact'})
  )
  .add(
    'isEmphasized: true',
    () => render({isEmphasized: true})
  )
  .add(
    'isEmphasized: true, icons, isQuiet: true',
    () => renderWithIcons({isEmphasized: true, isQuiet: true})
  )
  .add(
    'isEmphasized: true, orientation: vertical',
    () => render({isEmphasized: true, orientation: 'vertical'})
  )
  .add(
    'disable all tabs',
    () => render({isDisabled: true}))
  .add(
    'keyboardActivation: manual',
    () => render({keyboardActivation: 'manual'})
  )
  .add(
    'middle disabled',
    () => render({disabledKeys: ['val2']})
  )
  .add(
    'all disabled',
    () => render({disabledKeys: ['val1', 'val2', 'val3', 'val4', 'val5']})
  )
  .add(
    'resizeable',
    () => (
      <div style={{minWidth: '100px', width: '300px', height: '400px', padding: '10px', resize: 'horizontal', overflow: 'auto', backgroundColor: 'var(--spectrum-global-color-gray-50)'}}>
        {render()}
      </div>
    )
  )
  .add(
    'collapse behavior',
    () => <DynamicTabs />
  )
  .add(
    'collapse behavior, isQuiet',
    () => <DynamicTabs isQuiet />
  )
  .add(
    'collapse behavior, density: compact',
    () => <DynamicTabs density="compact" />
  )
  .add(
    'collapse behavior, density: compact, isQuiet',
    () => <DynamicTabs isQuiet density="compact" />
  )
  .add(
    'collapse behavior, isEmphasized: true',
    () => <DynamicTabs isEmphasized />
  )
  .add(
    'orientation flip',
    () => <OrientationFlip />
  )
  .add(
    'testing: tabs in flex',
    () => (
      <Flex minHeight={400} minWidth={400} UNSAFE_style={{borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--spectrum-global-color-gray-800)', padding: '10px'}}>
        <Tabs>
          <TabList>
            <Item>Tab 1</Item>
            <Item>Tab 2</Item>
          </TabList>
          <TabPanels>
            <Item>Hello World</Item>
            <Item>Goodbye World</Item>
          </TabPanels>
        </Tabs>
      </Flex>
    )
  )
  .add(
    'transition between tab sizes',
    () => (
      (
        <Tabs maxWidth={500}>
          <TabList>
            <Item>
              <Text>Tab 1 long long long name</Text>
            </Item>
            <Item>
              <Text>Tab 2</Text>
            </Item>
          </TabList>
          <TabPanels>
            <Item>Text</Item>
            <Item>Text 2</Item>
          </TabPanels>
        </Tabs>
      )
    )
  )
  .add(
    'Tab with flex container in between',
    () => <DynamicTabsWithDecoration />
  )
  .add(
    'tabs at the bottom',
    () => (
      (
        <Tabs maxWidth={500}>
          <TabPanels height="size-1000">
            <Item>Text 1</Item>
            <Item>Text 2</Item>
          </TabPanels>
          <TabList>
            <Item>Tab 1</Item>
            <Item>Tab 2</Item>
          </TabList>
        </Tabs>
      )
    )
  )
  .add(
    'tabs on the right',
    () => (
      (
        <Tabs maxWidth={500} orientation="vertical">
          <TabPanels>
            <Item>Text 1</Item>
            <Item>Text 2</Item>
          </TabPanels>
          <TabList>
            <Item>Tab 1</Item>
            <Item>Tab 2</Item>
          </TabList>
        </Tabs>
      )
    )
  )
  .add(
    'focusable element in tab panel',
    () => (
      <Tabs maxWidth={500}>
        <TabList>
          <Item>Tab 1</Item>
          <Item>Tab 2</Item>
        </TabList>
        <TabPanels>
          <Item>
            <TextField label="Tab 1" />
          </Item>
          <Item>
            <TextField label="Tab 2" isDisabled />
          </Item>
        </TabPanels>
      </Tabs>
    )
  )
  .add(
    'Tab 1 controlled child',
    () => {
      let [tab1Text, setTab1Text] = useState('');

      return (
        <Tabs maxWidth={500}>
          <TabList>
            <Item>Tab 1</Item>
            <Item>Tab 2</Item>
          </TabList>
          <TabPanels>
            <Item>
              <TextField label="Tab 1" value={tab1Text} onChange={setTab1Text} />
            </Item>
            <Item>
              <TextField label="Tab 2" />
            </Item>
          </TabPanels>
        </Tabs>
      );
    }
  )
  .add(
    'changing selection programatically',
    () => (
      <ControlledSelection />
    )
  );


function render(props = {}) {
  return (
    <Tabs {...props} aria-label="Tab example" maxWidth={500} onSelectionChange={action('onSelectionChange')}>
      <TabList>
        <Item key="val1">Tab 1</Item>
        <Item key="val2">Tab 2</Item>
        <Item key="val3">Tab 3</Item>
        <Item key="val4">Tab 4</Item>
        <Item key="val5">Tab 5</Item>
      </TabList>
      <TabPanels>
        <Item key="val1">
          <Heading>Tab Body 1</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="val2">
          <Heading>Tab Body 2</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="val3">
          <Heading>Tab Body 3</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="val4">
          <Heading>Tab Body 4</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="val5">
          <Heading>Tab Body 5</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

function renderWithIcons(props = {}) {
  return (
    <Tabs {...props} aria-label="Tab example" maxWidth={500} onSelectionChange={action('onSelectionChange')}>
      <TabList>
        <Item key="dashboard">
          <Dashboard />
          <Text>Dashboard</Text>
        </Item>
        <Item key="calendar">
          <Calendar />
          <Text>Calendar</Text>
        </Item>
        <Item key="bookmark">
          <Bookmark />
          <Text>Bookmark</Text>
        </Item>
      </TabList>
      <TabPanels>
        <Item key="dashboard">
          <Heading>Dashboard</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="calendar">
          <Heading>Calendar</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="bookmark">
          <Heading>Bookmark</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

function renderWithFalsyKey(props = {}) {
  return (
    <Tabs {...props} aria-label="Tab example" maxWidth={500} onSelectionChange={action('onSelectionChange')}>
      <TabList>
        <Item key="">Tab 1</Item>
        <Item key="val2">Tab 2</Item>
        <Item key="val3">Tab 3</Item>
        <Item key="val4">Tab 4</Item>
        <Item key="val5">Tab 5</Item>
      </TabList>
      <TabPanels>
        <Item key="">
          <Heading>Tab Body 1</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="val2">
          <Heading>Tab Body 2</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="val3">
          <Heading>Tab Body 3</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="val4">
          <Heading>Tab Body 4</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
        <Item key="val5">
          <Heading>Tab Body 5</Heading>
          <Text>
            Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
            Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
            Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
          </Text>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

interface DynamicTabItem {
  name: string,
  children: ReactNode,
  icon?: ReactNode
}

let items = [
  {name: 'Tab 1', children: 'Tab Body 1', icon: <Dashboard size="S" />},
  {name: 'Tab 2', children: 'Tab Body 2', icon: <Calendar size="S" />},
  {name: 'Tab 3', children: 'Tab Body 3', icon: <Bookmark size="S" />},
  {name: 'Tab 4', children: 'Tab Body 4', icon: <Dashboard size="S" />},
  {name: 'Tab 5', children: 'Tab Body 5', icon: <Calendar size="S" />},
  {name: 'Tab 6', children: 'Tab Body 6', icon: <Bookmark size="S" />}
] as DynamicTabItem[];

let DynamicTabs = (props: Omit<SpectrumTabsProps<DynamicTabItem>, 'children'>) => {

  let [tabs, setTabs] = React.useState(items);
  let addTab = () => {
    let newTabs = [...tabs];
    newTabs.push({
      name: `Tab ${tabs.length + 1}`,
      children: `Tab Body ${tabs.length + 1}`
    });

    setTabs(newTabs);
  };

  let removeTab = () => {
    let newTabs = [...tabs];
    newTabs.pop();
    setTabs(newTabs);
  };

  return (
    <div style={{width: '80%'}}>
      <Tabs {...props} aria-label="Tab example" items={tabs} onSelectionChange={action('onSelectionChange')}>
        <TabList>
          {(item: DynamicTabItem) => (
            <Item key={item.name}>
              {item.icon}
              <Text>{item.name}</Text>
            </Item>
          )}
        </TabList>
        <TabPanels>
          {(item: DynamicTabItem) => (
            <Item key={item.name}>
              <Heading>{item.children}</Heading>
              <Text>
                Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
                Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
                Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
              </Text>
            </Item>
          )}
        </TabPanels>
      </Tabs>
      <ButtonGroup marginEnd="30px">
        <Button variant="secondary" onPress={() => addTab()}>
          <Text>Add Tab</Text>
        </Button>
        <Button variant="secondary" onPress={() => removeTab()}>
          <Text>Remove Tab</Text>
        </Button>
      </ButtonGroup>
    </div>
  );
};

let OrientationFlip = (props = {}) => {
  let [flipOrientation, setFlipOrientation] = React.useState(true);

  return (
    <div style={{width: '80%'}}>
      <Tabs {...props} aria-label="Tab example" items={items} onSelectionChange={action('onSelectionChange')} orientation={flipOrientation ? 'horizontal' : 'vertical'}>
        <TabList>
          {(item: DynamicTabItem) => (
            <Item key={item.name}>
              {item.icon}
              <Text>{item.name}</Text>
            </Item>
          )}
        </TabList>
        <TabPanels>
          {(item: DynamicTabItem) => (
            <Item key={item.name}>
              <Heading>{item.children}</Heading>
              <Text>
                Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
                Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
                Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
              </Text>
            </Item>
          )}
        </TabPanels>
      </Tabs>
      <Button variant="secondary" onPress={() => setFlipOrientation((state) => !state)}>
        <Text>Flip Orientation</Text>
      </Button>
    </div>
  );
};


let DynamicTabsWithDecoration = (props = {}) => {

  let [tabs, setTabs] = React.useState(items);
  let addTab = () => {
    let newTabs = [...tabs];
    newTabs.push({
      name: `Tab ${tabs.length + 1}`,
      children: `Tab Body ${tabs.length + 1}`
    });

    setTabs(newTabs);
  };

  let removeTab = () => {
    if (tabs.length > 1) {
      let newTabs = [...tabs];
      newTabs.pop();
      setTabs(newTabs);
    }
  };

  return (
    <div style={{width: '80%'}}>
      <Tabs {...props} aria-label="Tab example" items={tabs} onSelectionChange={action('onSelectionChange')}>
        <Flex direction="row" alignItems="center">
          <TabList flex="1 1 auto" UNSAFE_style={{overflow: 'hidden'}}>
            {(item: DynamicTabItem) => (
              <Item key={item.name}>
                {item.icon}
                <Text>{item.name}</Text>
              </Item>
            )}
          </TabList>
          <Flex alignItems="center" justifyContent="end" flex="0 0 auto" alignSelf="stretch" UNSAFE_style={{borderBottom: 'var(--spectrum-alias-border-size-thick) solid var(--spectrum-global-color-gray-200)'}}>
            <ActionGroup marginEnd="30px" disabledKeys={tabs.length === 1 ? ['remove'] : undefined} onAction={val => val === 'add' ? addTab() : removeTab()}>
              <Item key="add">
                <Text>Add Tab</Text>
              </Item>
              <Item key="remove">
                <Text>Remove Tab</Text>
              </Item>
            </ActionGroup>
          </Flex>
        </Flex>
        <TabPanels>
          {(item: DynamicTabItem) => (
            <Item key={item.name}>
              <Heading>{item.children}</Heading>
              <Text>
                Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
                Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
                Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
              </Text>
            </Item>
          )}
        </TabPanels>
      </Tabs>
    </div>
  );
};

let ControlledSelection = () => {
  let [selectedKey, setSelectedKey] = useState<React.Key>('Tab 1');

  return (
    <div style={{width: '80%'}}>
      <Picker label="Set selected tab" selectedKey={selectedKey} onSelectionChange={setSelectedKey} items={items}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Picker>
      <Tabs aria-label="Tab example" items={items} selectedKey={selectedKey} onSelectionChange={setSelectedKey}>
        <TabList>
          {(item: DynamicTabItem) => (
            <Item key={item.name}>
              {item.icon}
              <Text>{item.name}</Text>
            </Item>
          )}
        </TabList>
        <TabPanels>
          {(item: DynamicTabItem) => (
            <Item key={item.name}>
              <Heading>{item.children}</Heading>
              <Text>
                Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
                Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
                Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
              </Text>
            </Item>
          )}
        </TabPanels>
      </Tabs>
    </div>
  );
};
