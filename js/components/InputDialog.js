/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';

export const InputDialog = ({
  visible,
  title,
  message,
  handleOk,
  handleCancel,
}) => {
  const theme = useTheme();
  const [text, setText] = useState('');

  const _handleOk = () => {
    handleOk(text);
  };
  return (
    <Portal>
      <Dialog
        dismissable={false}
        visible={visible}
        style={{backgroundColor: theme?.colors.surface, borderRadius: 4}}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
          <TextInput
            value={text}
            onChangeText={setText}
            mode="outlined"
            style={{width: '100%'}}
            autoFocus={true}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={_handleOk}>Ok</Button>
          <Button onPress={handleCancel}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
