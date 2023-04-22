import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {Appbar, Menu} from 'react-native-paper';
import {connect} from 'react-redux';
import TaskItem from '../components/TaskItem';
import TaskSortBottomSheet from '../components/TaskSortBottomSheet';
import {database} from '../db/db';
import Task from '../db/models/Task';
import {resetDeleteNoteState, resetEditTaskState} from '../redux/actions';

/**
 *
 * @param {object} param0
 * @param {Array<Task>} param0.tasks
 * @returns
 */
const DeletedTasksScreen = ({
  navigation,
  tasks,
  deleteNoteSuccess,
  dispatch,
}) => {
  // ref

  // variables
  const theme = useTheme();

  // states

  const [isSortBottomSheetVisible, setIsSortBottomSheetVisible] =
    useState(false);

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  useEffect(() => {
    if (deleteNoteSuccess) {
      _navigateBack();
    }
  }, [deleteNoteSuccess]);

  // callbacks

  // render functions
  /**
   *
   * @param {object} param0
   * @param {Task} param0.item
   * @returns
   */
  const _renderTaskItem = ({item, drag, isActive}) => {
    return <TaskItem task={item} disabled={isActive} onLongPress={drag} />;
  };

  // handle functions
  const _handleOpenSortTaskBottomSheet = () => {
    setIsSortBottomSheetVisible(true);
  };

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetDeleteNoteState());
    dispatch(resetEditTaskState());
    setIsSortBottomSheetVisible(false);
  };

  // return
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content
          title={'#Deleted tasks'}
          titleStyle={{fontWeight: '700'}}
        />
        <Appbar.Action icon={'sort'} onPress={_handleOpenSortTaskBottomSheet} />
      </Appbar.Header>

      <FlatList
        contentContainerStyle={{padding: 12}}
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={_renderTaskItem}
      />
      <TaskSortBottomSheet
        visible={isSortBottomSheetVisible}
        setVisible={setIsSortBottomSheetVisible}
      />
    </SafeAreaView>
  );
};

const enhanceDeletedTasksScreen = withObservables(
  ['taskSortProperty', 'taskSortOrder'],
  ({taskSortProperty, taskSortOrder}) => ({
    tasks: database.collections
      .get('tasks')
      .query(
        Q.where('is_marked_deleted', Q.eq(true)),
        Task.sortQuery(taskSortProperty, taskSortOrder),
      ),
  }),
);
const EnhancedDeletedTasksScreen =
  enhanceDeletedTasksScreen(DeletedTasksScreen);

const mapStateToProps = state => {
  return {
    taskSortProperty: state.taskSort.taskSortProperty,
    taskSortOrder: state.taskSort.taskSortOrder,
  };
};

export default connect(mapStateToProps)(EnhancedDeletedTasksScreen);
