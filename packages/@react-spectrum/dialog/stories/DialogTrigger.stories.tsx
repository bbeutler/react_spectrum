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
import {ActionButton, Button} from '@react-spectrum/button';
import {AlertDialog, Dialog, DialogTrigger} from '../';
import AlertMedium from '@spectrum-icons/ui/AlertMedium';
import {ButtonGroup} from '@react-spectrum/buttongroup';
import {chain} from '@react-aria/utils';
import {Checkbox} from '@react-spectrum/checkbox';
import {Content, Footer, Header} from '@react-spectrum/view';
import {Divider} from '@react-spectrum/divider';
import {Flex} from '@react-spectrum/layout';
import {Heading, Text} from '@react-spectrum/text';
import {Image} from '@react-spectrum/image';
import {Item, Menu, MenuTrigger} from '@react-spectrum/menu';
import {Provider} from '@react-spectrum/provider';
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('DialogTrigger', module)
  .addParameters({providerSwitcher: {status: 'notice'}})
  .add(
    'default',
    () => render({})
  )
  .add(
    'type: popover',
    () => renderPopover({type: 'popover'})
  )
  .add(
    'type: modal',
    () => render({type: 'modal'})
  )
  .add(
    'type: modal isDismissable',
    () => render({type: 'modal', isDismissable: true})
  )
  .add(
    'type: fullscreen',
    () => render({type: 'fullscreen'})
  )
  .add(
    'type: fullscreenTakeover',
    () => render({type: 'fullscreenTakeover'})
  )
  .add(
    'type: tray',
    () => renderPopover({type: 'tray'})
  )
  .add(
    'mobileType: fullscreen',
    () => render({type: 'modal', mobileType: 'fullscreen'})
  )
  .add(
    'mobileType: fullscreenTakeover',
    () => render({type: 'modal', mobileType: 'fullscreenTakeover'})
  )
  .add(
    'popover with mobileType: modal',
    () => renderPopover({type: 'popover', mobileType: 'modal'})
  )
  .add(
    'popover with mobileType: tray',
    () => renderPopover({type: 'popover', mobileType: 'tray'})
  )
  .add(
    'nested modals',
    () => (
      <div style={{paddingTop: 100}}>
        <input />
        <Provider colorScheme="dark" UNSAFE_style={{padding: 40, marginTop: 10}}>
          <DialogTrigger isDismissable>
            <ActionButton>Trigger</ActionButton>
            <Dialog>
              <Content>
                <input />
                <input />
                <DialogTrigger isDismissable>
                  <ActionButton>Trigger</ActionButton>
                  <Dialog>
                    <Content>
                      <input />
                      <input />
                    </Content>
                  </Dialog>
                </DialogTrigger>
              </Content>
            </Dialog>
          </DialogTrigger>
        </Provider>
      </div>
    )
  )
  .add(
    'nested modals, fullscreentakeover',
    () => (
      <DialogTrigger type="fullscreenTakeover">
        <ActionButton>Trigger</ActionButton>
        {(close) => (
          <Dialog>
            <Heading>The Heading</Heading>
            <Header>The Header</Header>
            <Divider />
            <Content>
              <DialogTrigger isDismissable>
                <ActionButton>Trigger</ActionButton>
                <Dialog>
                  <Content>
                    <input />
                    <input />
                  </Content>
                </Dialog>
              </DialogTrigger>
            </Content>
            <ButtonGroup>
              <Button variant="secondary" onPress={chain(close, action('cancel'))}>Cancel</Button>
              <Button variant="cta" onPress={chain(close, action('confirm'))}>Confirm</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    )
  )
  .add(
    'with menu trigger',
    () => (
      <DialogTrigger type="popover">
        <ActionButton>Trigger</ActionButton>
        <Dialog>
          <Heading>The Heading</Heading>
          <Content>
            <MenuTrigger>
              <ActionButton>Test</ActionButton>
              <Menu autoFocus="first">
                <Item>Item 1</Item>
                <Item>Item 2</Item>
                <Item>Item 3</Item>
              </Menu>
            </MenuTrigger>
          </Content>
        </Dialog>
      </DialogTrigger>
    )
  )
  .add(
    'nested popovers',
    () => (
      <div style={{paddingTop: 100}}>
        <DialogTrigger type="popover">
          <ActionButton>Trigger</ActionButton>
          <Dialog>
            <Content>
              <input />
              <input />
              <DialogTrigger type="popover">
                <ActionButton>Trigger</ActionButton>
                <Dialog><Content>Hi!</Content></Dialog>
              </DialogTrigger>
            </Content>
          </Dialog>
        </DialogTrigger>
      </div>
    )
  )
  .add(
    'popover inside scroll view',
    () => (
      <div style={{height: 100, display: 'flex'}}>
        <div style={{paddingTop: 100, height: 100, overflow: 'auto'}}>
          <div style={{height: 200}}>
            <DialogTrigger type="popover">
              <ActionButton>Trigger</ActionButton>
              <Dialog>
                <Content>
                  <input />
                  <input />
                </Content>
              </Dialog>
            </DialogTrigger>
          </div>
        </div>
        <div style={{paddingTop: 100, height: 100, overflow: 'auto', flex: 1}}>
          <div style={{height: 200}}>
            other
          </div>
        </div>
      </div>
    )
  )
  .add(
    'placement="left"',
    () => renderPopover({type: 'popover', placement: 'left'})
  )
  .add(
    'placement="left top"',
    () => renderPopover({type: 'popover', placement: 'left top'})
  )
  .add(
    'placement="left bottom"',
    () => renderPopover({type: 'popover', placement: 'left bottom'})
  )
  .add(
    'placement="right"',
    () => renderPopover({type: 'popover', placement: 'right'})
  )
  .add(
    'placement="right top"',
    () => renderPopover({type: 'popover', placement: 'right top'})
  )
  .add(
    'placement="right bottom"',
    () => renderPopover({type: 'popover', placement: 'right bottom'})
  )
  .add(
    'placement="bottom"',
    () => renderPopover({type: 'popover', placement: 'bottom'})
  )
  .add(
    'placement="bottom left"',
    () => renderPopover({type: 'popover', placement: 'bottom left'})
  )
  .add(
    'placement="bottom right"',
    () => renderPopover({type: 'popover', placement: 'bottom right'})
  )
  .add(
    'placement="top"',
    () => renderPopover({type: 'popover', placement: 'top'})
  )
  .add(
    'placement="top left"',
    () => renderPopover({type: 'popover', placement: 'top left'})
  )
  .add(
    'placement="top right"',
    () => renderPopover({type: 'popover', placement: 'top right'})
  )
  .add(
    'offset',
    () => renderPopover({type: 'popover', offset: 50})
  )
  .add(
    'crossOffset',
    () => renderPopover({type: 'popover', crossOffset: 50})
  )
  .add(
    'shouldFlip: true',
    () => renderPopover({type: 'popover', placement: 'start', shouldFlip: true, width: 'calc(100vh - 100px)'})
  )
  .add(
    'shouldFlip: false',
    () => renderPopover({type: 'popover', placement: 'start', shouldFlip: false, width: 'calc(100vh - 100px)'})
  )
  .add(
    'shouldFlip: true with offset',
    () => renderPopover({type: 'popover', placement: 'start', shouldFlip: true, offset: 50, width: 'calc(100vh - 100px)'})
  )
  .add(
    'keyboard dismiss disabled: modal',
    () => render({type: 'modal', isKeyboardDismissDisabled: true})
  )
  .add(
    'keyboard dismiss disabled: popover',
    () => renderPopover({type: 'popover', placement: 'bottom', isKeyboardDismissDisabled: true})
  )
  .add(
    'keyboard dismiss disabled: tray',
    () => renderPopover({type: 'tray', isKeyboardDismissDisabled: true})
  )
  .add(
    'containerPadding',
    () => renderPopover({type: 'popover', placement: 'bottom', width: 'calc(100vh - 100px)', containerPadding: 20})
  )
  .add(
    'Close function with button: popover',
    () => (
      <div style={{display: 'flex', margin: '100px 0'}}>
        <DialogTrigger type="popover" onOpenChange={action('open change')}>
          <ActionButton>Trigger</ActionButton>
          {(close) => (
            <Dialog>
              <Heading>The Heading</Heading>
              <Header>The Header</Header>
              <Divider />
              <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
              <ButtonGroup>
                <Button variant="secondary" onPress={chain(close, action('cancel'))}>Cancel</Button>
              </ButtonGroup>
            </Dialog>
          )}
        </DialogTrigger>
      </div>
    )
  )
  .add(
    'targetRef',
    () => (<TriggerWithRef type="popover" />)
  )
  .add(
    'alert dialog',
    () => renderAlert({})
  )
  .add(
    'crossoffset examples',
    () => (
      <Flex gap="size-200" alignSelf="center">
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left Top</span>
          <div><span>-50</span>{renderPopover({type: 'popover', placement: 'left top', crossOffset: -50}, false)}</div>
          <div><span>0</span>{renderPopover({type: 'popover', placement: 'left top'}, false)}</div>
          <div><span>50</span>{renderPopover({type: 'popover', placement: 'left top', crossOffset: 50}, false)}</div>
        </Flex>
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left</span>
          <div><span>-50</span>{renderPopover({type: 'popover', placement: 'left', crossOffset: -50}, false)}</div>
          <div><span>0</span>{renderPopover({type: 'popover', placement: 'left'}, false)}</div>
          <div><span>50</span>{renderPopover({type: 'popover', placement: 'left', crossOffset: 50}, false)}</div>
        </Flex>
        <Flex gap="size-200" direction="column" alignItems="start">
          <span>Left Bottom</span>
          <div><span>-50</span>{renderPopover({type: 'popover', placement: 'left bottom', crossOffset: -50}, false)}</div>
          <div><span>0</span>{renderPopover({type: 'popover', placement: 'left bottom'}, false)}</div>
          <div><span>50</span>{renderPopover({type: 'popover', placement: 'left bottom', crossOffset: 50}, false)}</div>
        </Flex>
      </Flex>
    )
  )
  .add(
    'trigger visible through underlay',
    () => renderTriggerNotCentered({})
  )
  .add(
    '2 popovers',
    () => (
      <Flex gap="size-200">
        <DialogTrigger type="popover">
          <ActionButton>Trigger</ActionButton>
          <Dialog>
            <Content>
              <input />
              <input />
            </Content>
          </Dialog>
        </DialogTrigger>
        <DialogTrigger type="popover">
          <ActionButton>Trigger</ActionButton>
          <Dialog><Content>Hi!</Content></Dialog>
        </DialogTrigger>
      </Flex>
    )
  )
  .add(
    'adjustable dialog',
    () => <AdjustableDialog />
  );

function render({width = 'auto', ...props}) {
  return (
    <div style={{display: 'flex', width, margin: '100px 0'}}>
      <DialogTrigger {...props} onOpenChange={action('open change')}>
        <ActionButton>Trigger</ActionButton>
        {(close) => (
          <Dialog>
            <Heading id="foo">The Heading</Heading>
            <Header>The Header</Header>
            <Divider />
            <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
            {!props.isDismissable &&
              <ButtonGroup>
                <Button variant="secondary" onPress={chain(close, action('cancel'))}>Cancel</Button>
                <Button variant="cta" onPress={chain(close, action('confirm'))}>Confirm</Button>
              </ButtonGroup>}
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  );
}

function renderTriggerNotCentered(props) {
  return (
    <div style={{position: 'absolute', top: '100px', left: '100px'}}>
      <div>action button shouldn't get any events if the underlay is up and you try to click it through the underlay</div>
      <DialogTrigger {...props} isDismissable onOpenChange={action('open change')}>
        <ActionButton onPressStart={action('onPressStart')} onPress={action('onPress')} onPressEnd={action('onPressEnd')}>Trigger</ActionButton>
        <Dialog>
          <Heading>The Heading</Heading>
          <Header>The Header</Header>
          <Divider />
          <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
        </Dialog>
      </DialogTrigger>
    </div>
  );
}

function renderPopover({width = 'auto', ...props}, withMargin = true) {
  return (
    <div style={{display: 'flex', width, margin: withMargin && '100px 0'}}>
      <DialogTrigger {...props} onOpenChange={action('open change')}>
        <ActionButton>Trigger</ActionButton>
        <Dialog>
          <Heading>The Heading</Heading>
          <Header>The Header</Header>
          <Divider />
          <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
        </Dialog>
      </DialogTrigger>
    </div>
  );
}

let TriggerWithRef = (props) => {
  let ref = React.useRef();
  return (
    <div style={{display: 'flex'}}>
      <DialogTrigger {...props} targetRef={ref} onOpenChange={action('open change')}>
        <ActionButton>Trigger</ActionButton>
        <Dialog>
          <Heading>The Heading</Heading>
          <Header>The Header</Header>
          <Divider />
          <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
        </Dialog>
      </DialogTrigger>
      <span ref={ref} style={{marginInlineStart: '200px'}}>Popover appears over here</span>
    </div>
  );
};


function renderAlert({width = 'auto', ...props}) {
  return (
    <div style={{display: 'flex', width, margin: '100px 0'}}>
      <DialogTrigger {...props} onOpenChange={action('open change')}>
        <ActionButton>Trigger</ActionButton>
        {(close) => (
          <AlertDialog title="Alert! Danger!" variant="error" primaryActionLabel="Accept" secondaryActionLabel="Whoa" cancelLabel="Cancel" onCancel={chain(close, action('cancel'))} onPrimaryAction={chain(close, action('primary'))} onSecondaryAction={chain(close, action('secondary'))}>
            <Text>Fine! No, absolutely fine. It's not like I don't have, you know, ten thousand other test subjects begging me to help them escape. You know, it's not like this place is about to EXPLODE.</Text>
          </AlertDialog>
        )}
      </DialogTrigger>
    </div>
  );
}

function AdjustableDialog() {
  let headingStrings = ['The Heading', 'The Heading of Maximum Truth That is Really Long to Go On and On a a a a a Again and Wraps'];
  let [showHero, setShowHero] = useState(false);
  let [heading, setHeading] = useState(headingStrings[0]);
  let [showHeader, setShowHeader] = useState(false);
  let [showTypeIcon, setShowTypeIcon] = useState(false);
  let [isDismissable, setIsDismissable] = useState(false);
  let [showFooter, setShowFooter] = useState(false);
  let [longButtonLabels, setLongButtonLabels] = useState(false);

  return (
    <Flex gap="size-200">
      <Flex direction="column" width="size-2000" gap="size-100">
        <Checkbox onChange={setShowHero}>Show Hero</Checkbox>
        <Checkbox onChange={(isChecked) => {isChecked ? setHeading(headingStrings[1]) : setHeading(headingStrings[0]);}}>Toggle Heading Values</Checkbox>
        <Checkbox onChange={setShowHeader}>Show Header</Checkbox>
        <Checkbox onChange={setShowTypeIcon}>Show TypeIcon</Checkbox>
        <Checkbox onChange={setIsDismissable}>Show Dismissable</Checkbox>
        <Checkbox onChange={setShowFooter}>Show Footer</Checkbox>
        <Checkbox onChange={setLongButtonLabels}>Show Long Button Labels</Checkbox>
      </Flex>
      <DialogTrigger isDismissable={isDismissable}>
        <ActionButton>Trigger</ActionButton>
        {(close) => (
          <Dialog>
            {showHero && <Image slot="hero" alt="" src="https://i.imgur.com/Z7AzH2c.png" objectFit="cover" />}
            <Heading>{heading}</Heading>
            {showHeader && <Header>This is a long header</Header>}
            {showTypeIcon && <AlertMedium
              slot="typeIcon"
              aria-label="Alert" />}
            <Divider />
            <Content><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.</Text></Content>
            {showFooter && <Footer><Checkbox>I have read and accept the terms of use and privacy policy</Checkbox></Footer>}
            <ButtonGroup>
              <Button variant="secondary" onPress={chain(close, action('cancel'))}>Cancel {longButtonLabels && 'and close this dialog'}</Button>
              <Button variant="cta" onPress={chain(close, action('confirm'))}>Confirm {longButtonLabels && 'and close this dialog'}</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    </Flex>
  );
}
