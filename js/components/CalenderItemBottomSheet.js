import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Appbar, Divider, useTheme} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {database} from '../db/db';
import Task from '../db/models/Task';
import TaskItem from './TaskItem';

const CalendarItemBottomSheet = ({
  tasks,
  selectedDateInfo,
  setSelectedDateInfo,
}) => {
  // hooks
  const sheetRef = useRef(null);
  const theme = useTheme();
  const snapPoints = useMemo(() => ['100%'], []);

  useEffect(() => {
    if (!selectedDateInfo) {
      _handleCloseFilterSheet();
    } else {
      _handleOpenFilterSheet(0);
    }
  }, [selectedDateInfo, sheetRef]);

  // callbacks
  const _handleSheetChange = useCallback(index => {}, []);
  const _handleOpenFilterSheet = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const _handleCloseFilterSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const _renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    [],
  );
  /**
   *
   * @param {object} param0
   * @param {Task} param0.item
   * @returns
   */
  const _renderTaskItem = ({item, drag, isActive}) => {
    return <TaskItem task={item} disabled={isActive} onLongPress={drag} />;
  };

  return (
    <BottomSheet
      style={{
        backgroundColor: theme?.colors.surface,
      }}
      // containerStyle={{
      //   backgroundColor: theme?.colors.surface,
      // }}
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleStyle={{display: 'none'}}
      backdropComponent={_renderBackdrop}
      onClose={() => setSelectedDateInfo(null)}
      onChange={_handleSheetChange}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            setSelectedDateInfo(null);
          }}
        />
        <Appbar.Content
          titleStyle={{fontWeight: '700'}}
          title={moment(selectedDateInfo?.date).format('MMM DD, YYYY')}
        />
      </Appbar.Header>

      <BottomSheetFlatList
        data={tasks}
        renderItem={_renderTaskItem}
        style={{backgroundColor: theme?.colors.surface}}
        contentContainerStyle={{
          backgroundColor: theme?.colors.surface,
          padding: 12,
        }}
        ItemSeparatorComponent={() => <Divider />}
      />
    </BottomSheet>
  );
};
const enhanceSelectLabel = withObservables(
  ['selectedDateInfo', 'taskSortProperty', 'taskSortOrder'],
  ({selectedDateInfo, taskSortProperty, taskSortOrder}) => ({
    tasks:
      selectedDateInfo &&
      selectedDateInfo.taskIDs &&
      Array.isArray(selectedDateInfo.taskIDs)
        ? database.collections
            .get('tasks')
            .query(
              Q.where('id', Q.oneOf(selectedDateInfo.taskIDs)),
              Q.sortBy(
                String(taskSortProperty).trim() === ''
                  ? CONSTANTS.TASK_SORT.DUE_DATE.code
                  : String(taskSortProperty).trim(),
                String(taskSortOrder) === Q.asc ||
                  String(taskSortOrder) === Q.desc
                  ? taskSortOrder
                  : Q.asc,
              ),
            )
            .observe()
        : database.collections
            .get('tasks')
            .query(
              Q.where('id', Q.oneOf([])),
              Q.sortBy(
                String(taskSortProperty).trim() === ''
                  ? CONSTANTS.TASK_SORT.DUE_DATE.code
                  : String(taskSortProperty).trim(),
                String(taskSortOrder) === Q.asc ||
                  String(taskSortOrder) === Q.desc
                  ? taskSortOrder
                  : Q.asc,
              ),
            )
            .observe(),
  }),
);
const EnhancedCalendarItemBottomSheet = enhanceSelectLabel(
  CalendarItemBottomSheet,
);

const mapStateToProps = state => {
  return {
    taskSortProperty: state.taskSort.taskSortProperty,
    taskSortOrder: state.taskSort.taskSortOrder,
  };
};

export default connect(mapStateToProps)(EnhancedCalendarItemBottomSheet);
