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
  // console.log({selectedDateInfo});

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
        backgroundColor: theme.colors.surface,
      }}
      // containerStyle={{
      //   backgroundColor: theme.colors.surface,
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
        style={{backgroundColor: theme.colors.surface}}
        contentContainerStyle={{
          backgroundColor: theme.colors.surface,
          padding: 12,
        }}
        ItemSeparatorComponent={() => <Divider />}
      />
    </BottomSheet>
  );
};
const enhanceSelectLabel = withObservables(
  ['selectedDateInfo'],
  ({selectedDateInfo}) => ({
    tasks:
      selectedDateInfo &&
      selectedDateInfo.taskIDs &&
      Array.isArray(selectedDateInfo.taskIDs)
        ? database.collections
            .get('tasks')
            .query(Q.where('id', Q.oneOf(selectedDateInfo.taskIDs)))
            .observe()
        : database.collections
            .get('tasks')
            .query(Q.where('id', Q.oneOf([])))
            .observe(),
  }),
);
export const EnhancedCalendarItemBottomSheet = enhanceSelectLabel(
  CalendarItemBottomSheet,
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },

  transaction_category_filter_title: {
    width: '100%',

    color: CONSTANTS.COLORS.DARK_FONT,
    fontWeight: '500',
    fontSize: 16,
    padding: 6,
    borderBottomColor: CONSTANTS.COLORS.LIGHT_FONT,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  transaction_category_avatar_icon: {
    borderRadius: 8,
    padding: 16,
  },
});
