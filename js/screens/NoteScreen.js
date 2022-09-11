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

/**
 *
 * @param {object} param0
 * @param {Note} param0.note
 * @returns
 */
const NoteScreen = ({
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
    setIsMenuOpen(false);
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
    <SafeAreaView style={[styles.main, {backgroundColor: note?.colorString}]}>
      <DeleteConfirmationDialog
        visible={isDeleteDialogOpen}
        message="note"
        handleCancel={_handleCloseDeleteNoteDialog}
        handleDelete={_handleDeleteNote}
      />
      <Appbar.Header style={{backgroundColor: note?.colorString}}>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title={note?.title} />

        <Menu
          visible={isMenuOpen}
          onDismiss={_handleToggleMenu}
          anchor={
            <Appbar.Action icon={'dots-vertical'} onPress={_handleToggleMenu} />
          }>
          <Menu.Item
            onPress={_navigateToEditNoteScreen}
            title="Edit"
            leadingIcon={'pencil'}
          />
          <Menu.Item onPress={() => {}} title="Sort by" leadingIcon={'sort'} />

          <Menu.Item
            onPress={() => {}}
            title="Duplicate note"
            leadingIcon={'content-duplicate'}
          />
          <Menu.Item
            onPress={_handleOpenDeleteNoteDialog}
            title="Delete note"
            leadingIcon={'delete'}
          />
        </Menu>
      </Appbar.Header>

      <DraggableFlatList
        contentContainerStyle={{padding: 12}}
        data={tasks}
        onDragEnd={value => console.log(value)}
        keyExtractor={item => item.id}
        renderItem={_renderTaskItem}
      />
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.surface,
        }}
        onPress={_handleOpenTaskInput}
      />
      <TaskInput
        visible={isTaskInputOpen}
        setVisible={setIsTaskInputOpen}
        noteID={note.id}
      />

      {/* <Surface style={styles.container}></Surface> */}
    </SafeAreaView>
  );
};
const enhanceNoteScreen = withObservables(['route'], ({route}) => ({
  note: database.collections.get('notes').findAndObserve(route.params.p_id),
  tasks: database.collections
    .get('tasks')
    .query(Q.where('note_id', route.params.p_id), Q.sortBy('is_done', Q.asc)),
}));
const EnhancedNoteScreen = enhanceNoteScreen(NoteScreen);

const mapStateToProps = state => {
  return {
    isDeletingNote: state.note.isDeletingNote,
    deleteNoteSuccess: state.note.deleteNoteSuccess,
    deleteNoteFailure: state.note.deleteNoteFailure,
  };
};

export default connect(mapStateToProps)(EnhancedNoteScreen);

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