import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {Appbar, Menu} from 'react-native-paper';
import {connect} from 'react-redux';
import EnhancedNoteItem from '../components/NoteItem';
import {database} from '../db/db';
import Note from '../db/models/Note';
import {resetEditNoteState} from '../redux/actions';

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
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content
          title={'#Archived notes'}
          titleStyle={{fontWeight: '700'}}
        />
      </Appbar.Header>

      <FlatList
        contentContainerStyle={{padding: 12}}
        data={notes}
        keyExtractor={item => item.id}
        renderItem={_renderNoteItem}
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
