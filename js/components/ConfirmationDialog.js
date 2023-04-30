/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Button, Dialog, Paragraph, Portal, useTheme} from 'react-native-paper';

export const ConfirmationDialog = ({
  visible,
  title,
  message,
  handleOk,
  handleCancel,
}) => {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        dismissable={false}
        visible={visible}
        style={{backgroundColor: theme?.colors.surface, borderRadius: 4}}>
        <Dialog.Title style={{fontWeight: '700'}}>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleOk}>Ok</Button>
          <Button onPress={handleCancel}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
