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
import Alarm, {
  NativeAlarmService,
  TaskReminderService,
} from '../services/alarm';
import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as StoreProvider} from 'react-redux';
import {configureStore} from '../redux/store';
import {Logger} from '../utils/logger';
import {_customLightTheme} from '../../themes';
import AnimatedAlarmRingButton from '../components/AlarmRingButton';
import moment from 'moment';

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
      setReminder(new Alarm(reminder));
    } catch (error) {
      Logger.pageLogger('ReminderClickScreen:_fetchReminderState:catch', error);
      // BackHandler.exitApp();
    }
  };

  const _handleStopAlarm = async () => {
    if (reminder && reminder != null && reminder.uid != null) {
      // await TaskReminderService.removeReminder({alarmID: reminder.uid});
      await NativeAlarmService.stopAlarm();
    } else {
      ///TODO:add toast indicating error here
      Logger.pageLogger(
        'ReminderClickScreen:_handleStopAlarm:catch',
        'reminder id not found',
      );
    }

    BackHandler.exitApp();
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
            {reminder && (
              <Text
                style={{
                  padding: 12,
                  // backgroundColor: _customLightTheme.colors.secondaryContainer,
                  color: _customLightTheme.colors.onSurface,
                  width: '100%',
                  fontWeight: '500',
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                {reminder.title}
              </Text>
            )}
            {reminder && (
              <Text
                style={{
                  color: _customLightTheme.colors.onSurface,
                  fontSize: 55,
                  fontWeight: '500',
                  marginTop: 24,
                }}>
                {moment(reminder?.getDateObject()).format('HH:MM')}
              </Text>
            )}
            {reminder && (
              <Text
                style={{
                  color: _customLightTheme.colors.onSurface,
                  fontSize: 18,
                  fontWeight: '500',
                  marginTop: 12,
                }}>
                {moment(reminder?.getDateObject()).format('Do MMM dddd a')}
              </Text>
            )}
            <AnimatedAlarmRingButton
              reminder={reminder}
              handleStopAlarm={_handleStopAlarm}
            />

            {/* {reminder && <Text>{reminder}</Text>} */}
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </StoreProvider>
  );
};
