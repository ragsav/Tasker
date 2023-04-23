import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  DrawerActions,
  useFocusEffect,
  useTheme,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {Appbar, Menu} from 'react-native-paper';
import {connect} from 'react-redux';
import EnhancedNoteItem from '../components/NoteItem';
import {database} from '../db/db';
import Note from '../db/models/Note';
import {resetEditNoteState} from '../redux/actions';
import MasonryList from '@react-native-seoul/masonry-list';
import {EmptyTasks} from '../components/EmptyTasks';

/**
 *
 * @param {object} param0
 * @param {Array<Note>} param0.notes
 * @returns
 */
const ArchivedNotesScreen = ({
  navigation,
  notes,
  deleteNoteSuccess,
  dispatch,
}) => {
  // ref

  // variables
  const theme = useTheme();
  const [listViewMode, setListViewMode] = useState('grid');

  // states

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
  const _renderNoteItem = ({item}) => {
    return <EnhancedNoteItem note={item} />;
  };

  // handle functions
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

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetEditNoteState());
  };

  // return
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <Appbar.Header>
        <Appbar.Action
          icon="menu"
          onPress={() => navigation?.dispatch(DrawerActions.toggleDrawer())}
        />
        <Appbar.Content
          title={'#Archived notes'}
          titleStyle={{fontWeight: '700'}}
        />
        <Appbar.Action
          icon={listViewMode === 'grid' ? 'view-grid' : 'view-list'}
          onPress={_handleListViewMode}
        />
      </Appbar.Header>

      <MasonryList
        style={{alignSelf: 'stretch', marginTop: 10, height: '100%'}}
        contentContainerStyle={{
          paddingHorizontal: 8,
          alignSelf: 'stretch',
        }}
        numColumns={listViewMode === 'grid' ? 2 : 1}
        data={notes}
        renderItem={({item}) => (
          <EnhancedNoteItem key={`notes-${item.id}`} note={item} />
        )}
        ListEmptyComponent={() => (
          <EmptyTasks message={'Try adding your first task'} />
        )}
      />
    </SafeAreaView>
  );
};

const enhanceArchivedNotesScreen = withObservables([], () => ({
  notes: database.collections
    .get('notes')
    .query(Q.where('is_archived', Q.eq(true))),
}));
const EnhancedArchivedNotesScreen =
  enhanceArchivedNotesScreen(ArchivedNotesScreen);

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(EnhancedArchivedNotesScreen);
