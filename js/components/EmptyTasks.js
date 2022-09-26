import React from 'react';
import {Image, View} from 'react-native';
import {Text} from 'react-native-paper';

export const EmptyTasks = ({message}) => {
  return (
    <View
      style={{
        width: '100%',
        height: 300,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.3,
      }}>
      <Image
        style={{height: 250, width: 250}}
        source={require('../../assets/empty.png')}
      />
      <Text>{message ? message : `Try adding you first label or note`}</Text>
    </View>
  );
};
