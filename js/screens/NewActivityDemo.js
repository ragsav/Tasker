import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {getAlarmState, getAlarm, stopAlarm} from '../services/alarm';
export const NewActivityDemo = () => {
  const [alarm, setAlarm] = useState(null);
  const theme = useTheme();
  useEffect(() => {
    _fetchAlarmState();
  }, []);

  const _fetchAlarmState = async () => {
    const alarmUid = await getAlarmState();
    const alarm = await getAlarm(alarmUid);
    setAlarm(alarm);
  };
  return (
    <SafeAreaView>
      <Text>
        {alarm?.getTimeString().hour} : {alarm?.getTimeString().minutes}
      </Text>
      <Button
        onPress={async () => {
          await stopAlarm();
        }}>
        Stop
      </Button>
    </SafeAreaView>
  );
};
