import React, {Component} from 'react';
import {Q} from '@nozbe/watermelondb';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {database} from '../db/db';
import withObservables from '@nozbe/with-observables';
import {connect} from 'react-redux';
import AppbarWithMonths from '../components/AppbarWithMonths';
import moment from 'moment';
import Calendar from 'react-native-big-calendar';
import calendarize from 'calendarize';
import {FlatGrid} from 'react-native-super-grid';
import {Surface, Text, useTheme} from 'react-native-paper';
import Task from '../db/models/Task';
import {useRef} from 'react';
import {datesArray, getDaysArray} from '../utils/dateTime';
import {date} from '@nozbe/watermelondb/decorators';
import {useMemo} from 'react';
var today = new Date();

today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
const CalenderCellItem = ({date, tasks}) => {
  const theme = useTheme();
  const _s = new Date(date);
  _s.setHours(0);
  _s.setMinutes(0);
  _s.setSeconds(0);
  _s.setMilliseconds(0);
  return (
    <Surface
      style={{
        flexDirection: 'column',
        height: 100,
        padding: 4,
        backgroundColor:
          new Date(date).toDateString() === new Date().toDateString()
            ? theme.colors.onSecondary
            : theme.colors.surface,
      }}>
      {!String(date).includes('null') && (
        <Text variant="bodySmall">{moment(date).date()}</Text>
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
                color={theme.colors.secondary}
              />
            );
          })}
        </View>
      )}
    </Surface>
  );
};

/**
 *
 * @param {object} param0
 * @param {Array<Task} param0.tasks
 * @returns
 */
const CalendarScreen = ({tasks, sDate, eDate}) => {
  //   const [items, setItems] = useState([]);
  const [dates, setDates] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    return items;
  }, [tasks, sDate]);

  const _fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };
  const _fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 100,
    }).start();
  };

  return (
    <SafeAreaView>
      <AppbarWithMonths />
      <FlatGrid
        itemDimension={1}
        data={moment.weekdaysShort()}
        renderItem={({item}) => <Text>{item}</Text>}
        maxItemsPerRow={7}
      />

      <FlatGrid
        itemDimension={1}
        adjustGridToStyles
        style={{height: '100%'}}
        spacing={1}
        data={items}
        renderItem={({item}) => (
          <CalenderCellItem date={item.date} tasks={item.tasks} />
        )}
        maxItemsPerRow={7}
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
        Q.where(
          'end_timestamp',
          Q.between(new Date(sDate).getTime(), new Date(eDate).getTime()),
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

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});
