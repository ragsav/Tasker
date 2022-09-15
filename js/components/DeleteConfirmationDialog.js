/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';

export const DeleteConfirmationDialog = ({
  visible,
  message,
  handleDelete,
  handleCancel,
}) => {
  return (
    <Portal>
      <Dialog dismissable={false} visible={visible}>
        <Dialog.Title>{message} Delete</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            {`Do you want to delete ${String(
              message,
            ).toLowerCase()}? You cannot undo this action.`}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDelete}>Ok</Button>
          <Button onPress={handleCancel}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
