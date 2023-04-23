import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import {Appbar, FAB, Menu, useTheme} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {DeleteConfirmationDialog} from '../components/DeleteConfirmationDialog';
import {EmptyTasks} from '../components/EmptyTasks';
import TaskInput from '../components/TaskInput';
import TaskItem from '../components/TaskItem';
import TaskSortBottomSheet from '../components/TaskSortBottomSheet';
import {database} from '../db/db';
import Note from '../db/models/Note';
import Task from '../db/models/Task';
import {
  deleteNote,
  duplicateNote,
  editNoteIsArchived,
  editNoteIsPinned,
  resetDeleteNoteState,
  setTaskListDetailView,
} from '../redux/actions';
import {Logger} from '../utils/logger';
import moment from 'moment';

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
  isTaskListDetailView,
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
    return (
      <ScaleDecorator>
        <TaskItem
          task={item}
          disabled={isActive}
          onLongPress={drag}
          noteColor={note.colorString}
          detailedView={isTaskListDetailView}
        />
      </ScaleDecorator>
    );
  };

  // handle functions
  const _handleOpenDeleteNoteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };
  const _handleArchiveNote = () => {
    setIsMenuOpen(false);
    dispatch(editNoteIsArchived({id: note.id, isArchived: true}));
    navigation?.pop();
  };
  const _handleUnarchiveNote = () => {
    setIsMenuOpen(false);
    dispatch(editNoteIsArchived({id: note.id, isArchived: false}));
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
  const _handleDuplicateNote = () => {
    dispatch(duplicateNote({id: note.id}));
    setIsMenuOpen(false);
  };
  const _handlePinNote = () => {
    dispatch(editNoteIsPinned({id: note.id, isPinned: true}));
    setIsMenuOpen(false);
  };
  const _handleUnpinNote = () => {
    dispatch(editNoteIsPinned({id: note.id, isPinned: false}));
    setIsMenuOpen(false);
  };
  const _handleOpenTaskInput = () => {
    setIsTaskInputOpen(true);
  };
  const _handleCloseTaskInput = () => {
    setIsTaskInputOpen(false);
  };
  const _handleOpenSortTaskBottomSheet = () => {
    setIsMenuOpen(false);
    setIsSortBottomSheetVisible(true);
  };
  const _handleChangeTaskDetailedView = () => {
    dispatch(
      setTaskListDetailView({isTaskListDetailView: !isTaskListDetailView}),
    );
    setIsMenuOpen(false);
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
    setIsSortBottomSheetVisible(false);
    setIsMenuOpen(false);
  };

  // return
  return (
    // <SharedElement id={`note.${note.id}.hero`}>
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <DeleteConfirmationDialog
        visible={isDeleteDialogOpen}
        message="note"
        handleCancel={_handleCloseDeleteNoteDialog}
        handleDelete={_handleDeleteNote}
      />
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />

        <Appbar.Content
          title={
            // <SharedElement id={`note.${note.id}.hero`}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: theme?.colors.onSurface,
              }}>
              {note ? `${note.title}` : '#Note'}
            </Text>

            // </SharedElement>
          }
        />
        <Appbar.Action
          icon={Boolean(note.isPinned) ? 'pin-off' : 'pin'}
          onPress={note.isPinned ? _handleUnpinNote : _handlePinNote}
        />

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
          <Menu.Item
            onPress={_handleChangeTaskDetailedView}
            title={isTaskListDetailView ? 'Compressed' : 'Detailed View'}
            leadingIcon={isTaskListDetailView ? 'blur' : 'details'}
          />
          <Menu.Item
            onPress={note.isPinned ? _handleUnpinNote : _handlePinNote}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
            leadingIcon={note.isPinned ? 'pin-off' : 'pin'}
          />
          <Menu.Item
            onPress={_handleOpenSortTaskBottomSheet}
            title="Sort by"
            leadingIcon={'sort'}
          />

          <Menu.Item
            onPress={_handleDuplicateNote}
            title="Duplicate note"
            leadingIcon={'content-duplicate'}
          />
          <Menu.Item
            onPress={
              note.isArchived ? _handleUnarchiveNote : _handleArchiveNote
            }
            title={note.isArchived ? 'Unarchive' : 'Archive'}
            leadingIcon={note.isArchived ? 'package-up' : 'package-down'}
          />
          <Menu.Item
            onPress={_handleOpenDeleteNoteDialog}
            title="Delete note"
            leadingIcon={'delete'}
          />
        </Menu>
      </Appbar.Header>

      <DraggableFlatList
        contentContainerStyle={{padding: 12, paddingBottom: 144}}
        data={tasks}
        onDragEnd={value =>
          Logger.pageLogger('NoteScreen.js:DraggableFlatList:onDragEnd')
        }
        keyExtractor={item => item.id}
        renderItem={_renderTaskItem}
        ListEmptyComponent={() => (
          <EmptyTasks message={'Try adding your first task'} />
        )}
      />

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          elevation: 0,
          // backgroundColor: theme?.colors.surface,
          backgroundColor:
            note && note.colorString ? note.colorString : theme?.colors.error,
        }}
        color={theme?.colors.surface}
        onPress={_handleOpenTaskInput}
      />
      <TaskInput
        visible={isTaskInputOpen}
        setVisible={setIsTaskInputOpen}
        noteID={note.id}
      />

      <TaskSortBottomSheet
        visible={isSortBottomSheetVisible}
        setVisible={setIsSortBottomSheetVisible}
      />
    </SafeAreaView>
  );
};

const enhanceNoteScreen = withObservables(
  ['route', 'taskSortProperty', 'taskSortOrder'],
  ({route, taskSortProperty, taskSortOrder}) => ({
    note: database.collections.get('notes').findAndObserve(route.params.p_id),
    tasks: database.collections
      .get('tasks')
      .query(
        Q.or(
          Q.where('is_marked_deleted', Q.eq(null)),
          Q.where('is_marked_deleted', Q.eq(false)),
        ),
        Q.where('note_id', route.params.p_id),
        Task.sortQuery(taskSortProperty, taskSortOrder),
      ),
  }),
);

const EnhancedNoteScreen = enhanceNoteScreen(NoteScreen);

const mapStateToProps = state => {
  return {
    isDeletingNote: state.note.isDeletingNote,
    deleteNoteSuccess: state.note.deleteNoteSuccess,
    deleteNoteFailure: state.note.deleteNoteFailure,
    taskSortProperty: state.taskSort.taskSortProperty,
    taskSortOrder: state.taskSort.taskSortOrder,
    isTaskListDetailView: state.settings.isTaskListDetailView,
  };
};

export default connect(mapStateToProps)(EnhancedNoteScreen);
