import moment from 'moment';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {_customLightTheme} from '../../themes';
import Alarm from '../services/alarm';

const AlarmRingButton = ({delay}) => {
  const ring = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.8 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 3]),
        },
      ],
    };
  });
  useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 3200,
        }),
        -1,
        false,
      ),
    );
  }, []);
  return <Animated.View style={[styles.ring, ringStyle]} />;
};

/**
 *
 * @param {object} param0
 * @param {Alarm} param0.reminder
 * @returns
 */
export default function AnimatedAlarmRingButton({handleStopAlarm, reminder}) {
  const a = Array.from({length: 6}, (_, i) => i);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      {a.map((i, index) => {
        return <AlarmRingButton key={i} delay={i * 400} />;
      })}

      <TouchableRipple
        onPress={handleStopAlarm}
        style={{
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: _customLightTheme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              color: _customLightTheme.colors.surface,

              fontSize: 16,
              fontWeight: '700',
            }}>
            Stop
          </Text>
        </View>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: _customLightTheme.colors.primary,
  },
});
