/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {StatusBar, Text} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as StoreProvider} from 'react-redux';
import PermissionsProvider from './js/components/PermissionsProvider';
import Router from './js/components/Router';

import {configureStore} from './js/redux/store';
import {
  CustomDarkTheme,
  CustomLightTheme,
  CustomLightTheme1,
  _customLightTheme,
} from './themes';

const store = configureStore();
const theme2 = CustomLightTheme;

const App = () => {
  useEffect(() => {
    RNBootSplash.hide();
  }, []);
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={_customLightTheme}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={_customLightTheme.colors.surface}
          // translucent
        />
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <Router></Router>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
