import {Q} from '@nozbe/watermelondb';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import withObservables from '@nozbe/with-observables';
import calendarize from 'calendarize';
import moment from 'moment';
import {useMemo} from 'react';
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import {FlatGrid} from 'react-native-super-grid';
import {connect} from 'react-redux';
import AppbarWithMonths from '../components/AppbarWithMonths';
import CalendarItemBottomSheet from '../components/CalenderItemBottomSheet';
import {database} from '../db/db';
import Task from '../db/models/Task';
import {datesArray} from '../utils/dateTime';
import {Logger} from '../utils/logger';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {useRef} from 'react';
import {setEndDate, setStartDate} from '../redux/actions';
import Animated, {
  FadeIn,
  Layout,
  runOnJS,
  SlideInLeft,
  SlideInUp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const CalenderCellItem = ({date, tasks, handleOpenCalenderItem}) => {
  // ref

  // variables
  const theme = useTheme();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions
  const _handleOpenCalenderItem = () => {
    const taskIDs = tasks?.map(task => {
      return task.id;
    });

    if (Array.isArray(taskIDs) && taskIDs.length > 0) {
      handleOpenCalenderItem({date, taskIDs});
    }
  };

  // navigation functions

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {};

  // return

  return (
    <TouchableRipple
      onPress={_handleOpenCalenderItem}
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme?.colors.surfaceVariant,
        backgroundColor:
          new Date(date).toDateString() === new Date().toDateString()
            ? theme?.colors.surfaceVariant
            : theme?.colors.surface,
      }}>
      <View
        style={{
          flexDirection: 'column',
          height: 100,
          padding: 4,
          backgroundColor: 'transparent',
        }}>
        {!String(date).includes('null') && moment(date).isValid() && (
          <Text variant="bodyMedium" style={{fontWeight: '600'}}>
            {moment(date).format('DD')}
          </Text>
        )}
        {tasks && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginTop: 12,
            }}>
            {tasks.map(task => {
              return (
                <MaterialCommunityIcons
                  key={task.id}
                  name={
                    task.isDone
                      ? 'checkbox-blank-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                  size={10}
                  color={theme?.colors.secondary}
                />
              );
            })}
          </View>
        )}
      </View>
    </TouchableRipple>
  );
};

/**
 *
 * @param {object} param0
 * @param {Array<Task} param0.tasks
 * @returns
 */
const CalendarScreen = ({tasks, sDate, eDate, dispatch}) => {
  // ref

  // variables
  const theme = useTheme();
  const opacity = useSharedValue(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  // states
  const [selectedDateInfo, setSelectedDateInfo] = useState(false);

  // effects
  const items = useMemo(() => {
    var datesOfMonth = calendarize(sDate).flat();

    const _d = new Date(sDate);
    const _m = _d.getMonth() + 1;
    const _y = _d.getFullYear();
    var _p = {};
    var _z = 0;
    var _zm = _m - 1;
    var isPresentMonth = false;
    datesOfMonth.forEach(date => {
      if (date === 0) {
        if (isPresentMonth) {
          _p[`${String(_zm + 2).padStart(2, '0')} - ${_z}-null`] = [];
        } else {
          _p[`${String(_zm).padStart(2, '0')} - ${_z}-null`] = [];
        }
        _z++;
      } else {
        isPresentMonth = true;
        _p[
          `${String(_m).padStart(2, '0')}/${String(date).padStart(
            2,
            '0',
          )}/${_y}`
        ] = [];
      }
    });

    tasks?.forEach(task => {
      if (new Date(task.endTimestamp)) {
        const _s = new Date(task.createdAt);
        _s.setHours(0);
        _s.setMinutes(0);
        _s.setSeconds(0);
        _s.setMilliseconds(0);

        const _e = new Date(task.endTimestamp);
        _e.setHours(0);
        _e.setMinutes(0);
        _e.setSeconds(0);
        _e.setMilliseconds(0);

        // Logger.pageLogger('CalendarScreen.js:useMemo:_s,_e', {_s, _e});

        const _dArray = datesArray(_s, _e);
        _dArray.forEach(_d => {
          if (_p[`${_d}`]) {
            _p[`${_d}`].push({
              id: task.id,
              title: task.title,
              isDone: task.isDone,
            });
          }
        });
      }
    });

    const items = Object.keys(_p).map(_d => {
      return {date: _d, tasks: _p[_d]};
    });
    // Logger.pageLogger('CalendarScreen.js:useMemo:items', {items});
    return items;
  }, [tasks, sDate]);

  // callbacks

  // render functions

  // handle functions
  const _handleOpenCalenderItem = ({date, taskIDs}) => {
    setSelectedDateInfo({date, taskIDs});
  };

  const _handleIncrementMonth = () => {
    const sDateLocal = new Date(sDate);
    const finalStartDate = new Date(
      sDateLocal.getFullYear(),
      sDateLocal.getMonth(),
    );
    finalStartDate.setMonth(sDateLocal.getMonth() + 1);

    const finalEndDate = new Date(
      sDateLocal.getFullYear(),
      sDateLocal.getMonth(),
    );
    finalEndDate.setMonth(sDateLocal.getMonth() + 2);

    dispatch(
      setStartDate({
        sDate: finalStartDate,
      }),
    );
    dispatch(
      setEndDate({
        eDate: finalEndDate,
      }),
    );
  };

  const _handleDecrementMonth = () => {
    opacity.value = 0;
    const sDateLocal = new Date(sDate);
    const finalStartDate = new Date(
      sDateLocal.getFullYear(),
      sDateLocal.getMonth(),
    );
    finalStartDate.setMonth(sDateLocal.getMonth() - 1);

    const finalEndDate = new Date(
      sDateLocal.getFullYear(),
      sDateLocal.getMonth(),
    );

    dispatch(
      setStartDate({
        sDate: finalStartDate,
      }),
    );
    dispatch(
      setEndDate({
        eDate: finalEndDate,
      }),
    );
    opacity.value = 1;
  };

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
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}>
      <AppbarWithMonths
        handleDecrementMonth={_handleDecrementMonth}
        handleIncrementMonth={_handleIncrementMonth}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
        }}>
        {moment.weekdaysShort().map((day, index) => {
          return (
            <Text
              style={{textAlign: 'center', flex: 1, fontWeight: '600'}}
              key={index}>
              {day}
            </Text>
          );
        })}
      </View>

      <Animated.View entering={FadeIn} style={rStyle}>
        <FlatGrid
          itemDimension={1}
          adjustGridToStyles
          spacing={StyleSheet.hairlineWidth}
          data={items}
          contentContainerStyle={{
            backgroundColor: theme?.colors.surfaceVariant,
            paddingTop: StyleSheet.hairlineWidth,
          }}
          renderItem={({item}) => (
            <CalenderCellItem
              date={item.date}
              tasks={item.tasks}
              handleOpenCalenderItem={_handleOpenCalenderItem}
            />
          )}
          maxItemsPerRow={7}
        />
      </Animated.View>

      <CalendarItemBottomSheet
        selectedDateInfo={selectedDateInfo}
        setSelectedDateInfo={setSelectedDateInfo}
      />
    </SafeAreaView>
  );
};

const enhanceCalendarScreen = withObservables(
  ['sDate', 'eDate'],
  ({sDate, eDate}) => ({
    tasks: database.collections
      .get('tasks')
      .query(
        Q.or(
          Q.where('is_marked_deleted', Q.eq(null)),
          Q.where('is_marked_deleted', Q.eq(false)),
        ),
        Task.unarchived(),
        Q.or(
          Q.where(
            'created_at',
            Q.between(new Date(sDate).getTime(), new Date(eDate).getTime()),
          ),
          Q.where(
            'end_timestamp',
            Q.between(new Date(sDate).getTime(), new Date(eDate).getTime()),
          ),
        ),
      ),
  }),
);
const EnhancedCalendarScreen = enhanceCalendarScreen(CalendarScreen);

const mapStateToProps = state => {
  return {
    sDate: state.timeFrame.sDate,
    eDate: state.timeFrame.eDate,
  };
};

export default connect(mapStateToProps)(EnhancedCalendarScreen);
