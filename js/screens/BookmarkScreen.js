import withObservables from '@nozbe/with-observables';
import {Q} from '@nozbe/watermelondb';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
// import Menu from 'react-native-material-menu';
// import Menu, {MenuItem} from 'react-native-material-menu';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {MenuDivider} from 'react-native-material-menu';
import {
  Appbar,
  Surface,
  Text,
  Menu,
  Divider,
  Button,
  FAB,
  Card,
  IconButton,
  Avatar,
  RadioButton,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {DeleteConfirmationDialog} from '../components/DeleteConfirmationDialog';
import TaskInput from '../components/TaskInput';
import {database} from '../db/db';
import Note from '../db/models/Note';
import {
  deleteNote,
  editTaskIsBookmark,
  editTaskIsDone,
  resetDeleteNoteState,
} from '../redux/actions';
import Task from '../db/models/Task';
import TaskItem from '../components/TaskItem';
import {CONSTANTS} from '../../constants';
import moment from 'moment';

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
  const [isTaskInputOpen, setIsTaskInputOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetDeleteNoteState());
  };

  // return
  return (
    <SafeAreaView
      style={[styles.main, {backgroundColor: theme.colors.secondaryContainer}]}>
      <Appbar.Header style={{backgroundColor: theme.colors.secondaryContainer}}>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title={'Bookmarks'} />

        <Menu
          visible={isMenuOpen}
          onDismiss={_handleToggleMenu}
          anchor={
            <Appbar.Action icon={'dots-vertical'} onPress={_handleToggleMenu} />
          }>
          <Menu.Item title="Mark all done" leadingIcon={'check-all'} />
          <Menu.Item onPress={() => {}} title="Sort by" leadingIcon={'sort'} />
        </Menu>
      </Appbar.Header>

      <FlatList
        contentContainerStyle={{padding: 12}}
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={_renderTaskItem}
      />
    </SafeAreaView>
  );
};

const enhanceBookmarkScreen = withObservables([], ({}) => ({
  tasks: database.collections
    .get('tasks')
    .query(Q.where('is_bookmarked', true)),
}));
const EnhancedBookmarkScreen = enhanceBookmarkScreen(BookmarkScreen);

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(EnhancedBookmarkScreen);

const styles = new StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: '100%',
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});
