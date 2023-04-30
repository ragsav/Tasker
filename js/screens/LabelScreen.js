import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import MasonryList from '@react-native-seoul/masonry-list';
import {DrawerActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {Appbar, FAB, Menu, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {ConfirmationDialog} from '../components/ConfirmationDialog';
import {EmptyTasks} from '../components/EmptyTasks';
import EnhancedNoteItem from '../components/NoteItem';
import NoteSortBottomSheet from '../components/NoteSortBottomSheet';
import {database} from '../db/db';
import Label from '../db/models/Label';
import Note from '../db/models/Note';
import {
  deleteLabel,
  duplicateNote,
  editNoteIsPinned,
  resetDeleteNoteState,
} from '../redux/actions';
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
  label,
  notes,
  deleteNoteSuccess,
  dispatch,
}) => {
  // ref

  // variables
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
   * @param {Note} param0.item
   * @returns
   */
  const _renderNoteItem = ({item}) => (
    <EnhancedNoteItem key={`notes-${item.id}`} label={label} note={item} />
  );

  // handle functions
  const _handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const _handleOpenDeleteLabelDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };
  const _handleCloseDeleteLabelDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  const _handleDeleteLabel = () => {
    dispatch(deleteLabel({id: label.id}));
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
  };
  const _handleOpenSortNotesBottomSheet = () => {
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
  const _navigateToCreateNoteScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.ADD_NOTE, {
      p_labelID: label.id,
    });
  };
  const _navigateToEditLabelScreen = () => {
    setIsMenuOpen(false);
    navigation?.navigate(CONSTANTS.ROUTES.EDIT_LABEL, {
      p_id: label.id,
      p_title: label.title,
      p_iconString: label.iconString,
    });
    // navigation?.navigate(CONSTANTS.ROUTES.ADD_LABEL);
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
      <ConfirmationDialog
        visible={isDeleteDialogOpen}
        title="Delete this label?"
        message="Are you sure you want to delete this label? This action is irreversible "
        handleCancel={_handleCloseDeleteLabelDialog}
        handleOk={_handleDeleteLabel}
      />
      <Appbar.Header>
        {/* <Appbar.BackAction onPress={_navigateBack} /> */}
        <Appbar.Action
          icon="menu"
          onPress={() => navigation?.dispatch(DrawerActions.toggleDrawer())}
        />

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
          <Menu.Item
            onPress={_handleOpenSortNotesBottomSheet}
            title="Sort by"
            leadingIcon={'sort'}
          />

          <Menu.Item
            onPress={_handleOpenDeleteLabelDialog}
            title="Delete label"
            leadingIcon={'delete'}
          />
        </Menu>
      </Appbar.Header>
      <MasonryList
        style={{alignSelf: 'stretch', marginTop: 10, height: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 8,
          alignSelf: 'stretch',
        }}
        numColumns={listViewMode === 'grid' ? 2 : 1}
        data={notes}
        renderItem={_renderNoteItem}
        ListEmptyComponent={() => (
          <EmptyTasks message={'Try adding your first task'} />
        )}
      />
      <FAB
        icon="note-plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme?.colors.primary,
          // backgroundColor:
          //   note && note.colorString ? note.colorString : theme?.colors.error,
        }}
        color={theme?.colors.onPrimary}
        onPress={_navigateToCreateNoteScreen}
      />

      <NoteSortBottomSheet
        visible={isSortBottomSheetVisible}
        setVisible={setIsSortBottomSheetVisible}
      />
    </SafeAreaView>
  );
};

const enhanceLabelScreen = withObservables(
  ['route', 'noteSortProperty', 'noteSortOrder'],
  ({route, noteSortProperty, noteSortOrder}) => {
    console.log({noteSortProperty});
    return {
      label: database.collections
        .get('labels')
        .findAndObserve(route.params.p_id),
      notes: database.collections
        .get('notes')
        .query(
          Q.or(
            Q.where('is_marked_deleted', Q.eq(null)),
            Q.where('is_marked_deleted', Q.eq(false)),
          ),
          Q.where('is_archived', Q.notEq(true)),
          Q.where('label_id', route.params.p_id),

          Note.noteSortQuery(noteSortProperty, noteSortOrder),
        )
        .observe(),
    };
  },
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
    noteSortProperty: state.noteSort.noteSortProperty,
    noteSortOrder: state.noteSort.noteSortOrder,
  };
};

export default connect(mapStateToProps)(EnhancedLabelScreen);
