/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as StoreProvider} from 'react-redux';
import Router from './js/components/Router';
import {configureStore} from './js/redux/store';

const store = configureStore();

const App = () => {
  useEffect(() => {
    RNBootSplash.hide();
  }, []);
  return (
    <StoreProvider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <Router></Router>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </StoreProvider>
  );
};

export default App;
