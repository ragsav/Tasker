import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';

export const LoadingScreen = () => {
  // ref

  // variables
  const theme = useTheme();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions

  // navigation functions

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {};

  // return

  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <StatusBar
        barStyle={theme?.statusBarStyle}
        backgroundColor={theme?.colors.surface}

        // translucent
      />
      <ActivityIndicator animating={true} />
    </SafeAreaView>
  );
};
