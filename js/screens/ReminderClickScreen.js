import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  BackHandler,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {NativeAlarmService, TaskReminderService} from '../services/alarm';
import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as StoreProvider} from 'react-redux';
import {configureStore} from '../redux/store';
import {Logger} from '../utils/logger';
import {_customLightTheme} from '../../themes';

const store = configureStore();

export const ReminderClickScreen = () => {
  const [reminder, setReminder] = useState(null);
  const theme = useTheme();
  useEffect(() => {
    _fetchReminderState();
    RNBootSplash.hide();
  }, []);

  const _fetchReminderState = async () => {
    try {
      const reminder = await TaskReminderService.getCurrentReminder();
      setReminder(reminder);
    } catch (error) {
      Logger.pageLogger('ReminderClickScreen:_fetchReminderState:catch', error);
      // BackHandler.exitApp();
    }
  };

  const _handleStopAlarm = async () => {
    if (reminder && reminder != null && reminder.uid != null) {
      await TaskReminderService.removeReminder({alarmID: reminder.uid});
      BackHandler.exitApp();
    } else {
      ///TODO:add toast indicating error here
      await NativeAlarmService.stopAlarm();
      Logger.pageLogger(
        'ReminderClickScreen:_handleStopAlarm:catch',
        'reminder id not found',
      );
    }
  };
  return (
    <StoreProvider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              ...StyleSheet.absoluteFillObject,
              backgroundColor: theme?.colors.surface,
            }}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={_customLightTheme.colors.surface}

              // translucent
            />
            <TouchableRipple
              onPress={_handleStopAlarm}
              style={{
                height: 140,
                width: 140,
                borderRadius: 70,
                backgroundColor: _customLightTheme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: _customLightTheme.colors.surface}}>
                  {reminder?.getTimeString().hour} :{' '}
                  {reminder?.getTimeString().minutes}
                </Text>
                <Text style={{color: _customLightTheme.colors.surface}}>
                  Stop reminder
                </Text>
              </View>
            </TouchableRipple>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </StoreProvider>
  );
};
