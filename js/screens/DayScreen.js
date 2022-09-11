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
 * @param {Note} param0.note
 * @returns
 */
const DayScreen = ({
  navigation,
  route,
  note,
  tasks,
  deleteNoteSuccess,
  dispatch,
}) => {
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
    return (
      <ScaleDecorator>
        <TaskItem
          task={item}
          disabled={isActive}
          handleMarkIsDone={_handleMarkIsDone}
          handleBookmark={_handleBookmark}
          onLongPress={drag}
        />
      </ScaleDecorator>
    );
  };

  // handle functions
  const _handleOpenDeleteNoteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };
  const _handleCloseDeleteNoteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  const _handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const _handleDeleteNote = () => {
    dispatch(deleteNote({id: note.id}));
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
  };
  const _handleOpenTaskInput = () => {
    setIsTaskInputOpen(true);
  };
  const _handleCloseTaskInput = () => {
    setIsTaskInputOpen(false);
  };
  const _handleMarkIsDone = ({id, isDone}) => {
    dispatch(editTaskIsDone({id, isDone}));
  };
  const _handleBookmark = ({id, isBookmarked}) => {
    dispatch(editTaskIsBookmark({id, isBookmarked}));
  };
  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };
  const _navigateToEditNoteScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.EDIT_NOTE, {
      p_id: note.id,
      p_title: note.title,
      p_colorString: note.colorString,
      p_labelID: note.labelID,
    });
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
      {/* <DeleteConfirmationDialog
        visible={isDeleteDialogOpen}
        message="note"
        handleCancel={_handleCloseDeleteNoteDialog}
        handleDelete={_handleDeleteNote}
      /> */}
      <Appbar.Header style={{backgroundColor: theme.colors.secondaryContainer}}>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title={'My day'} />

        <Menu
          visible={isMenuOpen}
          onDismiss={_handleToggleMenu}
          anchor={
            <Appbar.Action icon={'dots-vertical'} onPress={_handleToggleMenu} />
          }>
          <Menu.Item
            onPress={_navigateToEditNoteScreen}
            title="Mark all done"
            leadingIcon={'check-all'}
          />
          <Menu.Item onPress={() => {}} title="Sort by" leadingIcon={'sort'} />
        </Menu>
      </Appbar.Header>

      <DraggableFlatList
        contentContainerStyle={{padding: 12}}
        data={tasks}
        onDragEnd={value => console.log(value)}
        keyExtractor={item => item.id}
        renderItem={_renderTaskItem}
      />
    </SafeAreaView>
  );
};
const s = new Date();
const e = new Date();
s.setHours(0, 0, 0, 0);
e.setHours(23, 59, 59, 999);

const enhanceDayScreen = withObservables([], ({}) => ({
  tasks: database.collections
    .get('tasks')
    .query(Q.where('end_timestamp', Q.between(s.getTime(), e.getTime()))),
}));
const EnhancedDayScreen = enhanceDayScreen(DayScreen);

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(EnhancedDayScreen);

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
