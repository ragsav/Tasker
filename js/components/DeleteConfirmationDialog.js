/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Button, Dialog, Paragraph, Portal, useTheme} from 'react-native-paper';

export const DeleteConfirmationDialog = ({
  visible,
  message,
  handleDelete,
  handleCancel,
}) => {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        dismissable={false}
        visible={visible}
        style={{backgroundColor: theme?.colors.surface, borderRadius: 4}}>
        <Dialog.Title>
          {`${String(message).substring(0, 1).toUpperCase()}${String(message)
            .substring(1, String(message).length)
            .toLowerCase()}`}{' '}
          delete
        </Dialog.Title>
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
