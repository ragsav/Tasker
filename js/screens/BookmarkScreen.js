import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';

import {Appbar, Menu} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import TaskItem from '../components/TaskItem';
import TaskSortBottomSheet from '../components/TaskSortBottomSheet';
import {database} from '../db/db';
import Task from '../db/models/Task';
import {
  editTaskBookmarkBulk,
  editTaskMarkBulkDone,
  editTaskMarkBulkNotDone,
  resetDeleteNoteState,
  resetEditTaskState,
} from '../redux/actions';

/**
 *
 * @param {object} param0
 * @param {Array<Task>} param0.tasks
 * @returns
 */
const BookmarkScreen = ({navigation, tasks, deleteNoteSuccess, dispatch}) => {
  // ref

  // variables
  const theme = useTheme();

  // states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const _handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const _handleRemoveAllBookmarks = () => {
    dispatch(editTaskBookmarkBulk({ids: tasks?.map(task => task.id)}));
    setIsMenuOpen(false);
  };
  const _handleMarkAllDone = () => {
    dispatch(editTaskMarkBulkDone({ids: tasks?.map(task => task.id)}));
    setIsMenuOpen(false);
  };
  const _handleMarkAllNotDone = () => {
    dispatch(editTaskMarkBulkNotDone({ids: tasks?.map(task => task.id)}));
    setIsMenuOpen(false);
  };
  const _handleOpenSortTaskBottomSheet = () => {
    setIsMenuOpen(false);
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
    setIsMenuOpen(false);
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
        <Appbar.Content title={'#Bookmarks'} titleStyle={{fontWeight: '700'}} />

        <Menu
          visible={isMenuOpen}
          onDismiss={_handleToggleMenu}
          anchor={
            <Appbar.Action icon={'dots-vertical'} onPress={_handleToggleMenu} />
          }>
          <Menu.Item
            title="Remove all bookmarks"
            leadingIcon={'bookmark-off'}
            onPress={_handleRemoveAllBookmarks}
          />
          <Menu.Item
            title="Mark all done"
            leadingIcon={'check-all'}
            onPress={_handleMarkAllDone}
          />
          <Menu.Item
            title="Mark all not done"
            leadingIcon={'check-all'}
            onPress={_handleMarkAllNotDone}
          />
          <Menu.Item
            onPress={_handleOpenSortTaskBottomSheet}
            title="Sort by"
            leadingIcon={'sort'}
          />
        </Menu>
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

const enhanceBookmarkScreen = withObservables(
  ['taskSortProperty', 'taskSortOrder'],
  ({taskSortProperty, taskSortOrder}) => ({
    tasks: database.collections
      .get('tasks')
      .query(
        Q.or(
          Q.where('is_marked_deleted', Q.eq(null)),
          Q.where('is_marked_deleted', Q.eq(false)),
        ),
        Q.where('is_bookmarked', true),
        Task.unarchived(),
        Task.sortQuery(taskSortProperty, taskSortOrder),
      ),
  }),
);
const EnhancedBookmarkScreen = enhanceBookmarkScreen(BookmarkScreen);

const mapStateToProps = state => {
  return {
    taskSortProperty: state.taskSort.taskSortProperty,
    taskSortOrder: state.taskSort.taskSortOrder,
  };
};

export default connect(mapStateToProps)(EnhancedBookmarkScreen);
