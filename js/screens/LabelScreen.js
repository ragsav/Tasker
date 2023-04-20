import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import MasonryList from '@react-native-seoul/masonry-list';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  deleteNote,
  duplicateNote,
  editNoteIsArchived,
  editNoteIsPinned,
  resetDeleteNoteState,
} from '../redux/actions';
import {Logger} from '../utils/logger';
import {SharedElement} from 'react-navigation-shared-element';
import Animated, {SlideInRight} from 'react-native-reanimated';
import Label from '../db/models/Label';
import EnhancedNoteItem from '../components/NoteItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const BOTTOM_APPBAR_HEIGHT = 64;
/**
 *
 * @param {object} param0
 * @param {Label} param0.label
 * @param {Array<Note>} param0.notes
 * @returns
 */
const LabelScreen = ({
  navigation,
  route,
  label,
  notes,
  deleteNoteSuccess,
  dispatch,
}) => {
  // ref

  // variables
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();

  // states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [listViewMode, setListViewMode] = useState('grid');
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

  //   useEffect(() => {
  //     if (deleteNoteSuccess) {
  //       _navigateBack();
  //     }
  //   }, [deleteNoteSuccess]);

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
        />
      </ScaleDecorator>
    );
  };

  // render functions
  /**
   *
   * @param {object} param0
   * @param {Note} param0.item
   * @returns
   */
  const _renderNoteItem = ({item}) => {
    return <EnhancedNoteItem note={item} />;
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
  const _handleListViewMode = () => {
    if (listViewMode === 'grid') {
      setListViewMode('list');
    } else {
      setListViewMode('grid');
    }
  };

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };
  const _navigateToEditLabelScreen = () => {
    setIsMenuOpen(false);
    navigation?.navigate(CONSTANTS.ROUTES.EDIT_NOTE, {
      p_id: note.id,
      p_title: note.title,
      p_colorString: note.colorString,
      p_labelID: note.labelID,
    });
  };
  const _navigateToCreateNoteScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.ADD_NOTE);
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
      {/* <DeleteConfirmationDialog
        visible={isDeleteDialogOpen}
        message="note"
        handleCancel={_handleCloseDeleteNoteDialog}
        handleDelete={_handleDeleteNote}
      /> */}
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
              {label ? `${label.title}` : '#Label'}
            </Text>
            // </SharedElement>
          }
        />
        <Appbar.Action
          icon={listViewMode === 'grid' ? 'view-grid' : 'view-list'}
          onPress={_handleListViewMode}
        />

        <Menu
          visible={isMenuOpen}
          onDismiss={_handleToggleMenu}
          anchor={
            <Appbar.Action icon={'dots-vertical'} onPress={_handleToggleMenu} />
          }>
          <Menu.Item
            onPress={_navigateToEditLabelScreen}
            title="Edit"
            leadingIcon={'pencil'}
          />

          {/* <Menu.Item
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
          /> */}
        </Menu>
      </Appbar.Header>

      {/* <DraggableFlatList
        contentContainerStyle={{padding: 12}}
        data={tasks}
        onDragEnd={value =>
          Logger.pageLogger('LabelScreen.js:DraggableFlatList:onDragEnd')
        }
        keyExtractor={item => item.id}
        renderItem={_renderTaskItem}
        ListEmptyComponent={() => (
          <EmptyTasks message={'Try adding your first task'} />
        )}
      /> */}
      <MasonryList
        style={{alignSelf: 'stretch', marginTop: 10, height: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 8,
          alignSelf: 'stretch',
        }}
        numColumns={listViewMode === 'grid' ? 2 : 1}
        data={notes}
        renderItem={({item}) => (
          <EnhancedNoteItem
            key={`notes-${item.id}`}
            label={label}
            note={item}
          />
        )}
      />
      <Appbar
        style={{
          height: BOTTOM_APPBAR_HEIGHT + bottom,
          backgroundColor: theme?.colors.primary,
          justifyContent: 'space-between',
        }}
        safeAreaInsets={{bottom}}>
        <View></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          {/* <Appbar.Action
            isLeading={false}
            icon="pin"
            iconColor={theme?.colors.onPrimary}
            onPress={_navigateToPinScreen}
          /> */}
          <Appbar.Action
            isLeading={false}
            icon="note-plus"
            iconColor={theme?.colors.onPrimary}
            onPress={_navigateToCreateNoteScreen}
          />
        </View>
      </Appbar>
      {/* {notes?.map(note => {
        return <Text key={note.id}>{note.id}</Text>;
      })} */}

      {/* <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          // backgroundColor: theme?.colors.surface,
          backgroundColor:
            note && note.colorString ? note.colorString : theme?.colors.error,
        }}
        color={theme?.colors.surface}
        onPress={_handleOpenTaskInput}
      /> */}
      {/* <TaskInput
        visible={isTaskInputOpen}
        setVisible={setIsTaskInputOpen}
        noteID={note.id}
      /> */}

      {/* <TaskSortBottomSheet
        visible={isSortBottomSheetVisible}
        setVisible={setIsSortBottomSheetVisible}
      /> */}
    </SafeAreaView>
  );
};

const enhanceLabelScreen = withObservables(
  ['route', 'noteSortProperty', 'noteSortOrder'],
  ({route, noteSortProperty, noteSortOrder}) => ({
    label: database.collections.get('labels').findAndObserve(route.params.p_id),
    notes: database.collections.get('notes').query(
      Q.or(
        Q.where('is_marked_deleted', Q.eq(null)),
        Q.where('is_marked_deleted', Q.eq(false)),
      ),
      Q.where('is_archived', Q.notEq(true)),
      Q.where('label_id', route.params.p_id),
      // Q.sortBy(
      //   String(noteSortProperty).trim() === ''
      //     ? CONSTANTS.TASK_SORT.DUE_DATE.code
      //     : String(noteSortProperty).trim(),
      //   String(noteSortOrder) === Q.asc || String(noteSortOrder) === Q.desc
      //     ? noteSortOrder
      //     : Q.asc,
      // ),
    ),
  }),
);
// LabelScreen.sharedElements = route => {
//   const {p_id} = route.params;
//   return [
//     {
//       id: `note.${p_id}.hero`,
//       animation: 'move',
//       resize: 'clip',
//     },
//   ];
// };
const EnhancedLabelScreen = enhanceLabelScreen(LabelScreen);

const mapStateToProps = state => {
  return {
    isDeletingNote: state.note.isDeletingNote,
    deleteNoteSuccess: state.note.deleteNoteSuccess,
    deleteNoteFailure: state.note.deleteNoteFailure,
    taskSortProperty: state.taskSort.taskSortProperty,
    taskSortOrder: state.taskSort.taskSortOrder,
  };
};

export default connect(mapStateToProps)(EnhancedLabelScreen);
