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
import {LogBox} from 'react-native';
import PushNotification from 'react-native-push-notification';
import NotificationService from './js/services/notifications';
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  useEffect(() => {
    NotificationService.createChannel();
    NotificationService.getAllScheduledNotifications();
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
