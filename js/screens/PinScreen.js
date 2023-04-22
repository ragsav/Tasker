/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import MasonryList from '@react-native-seoul/masonry-list';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {EmptyTasks} from '../components/EmptyTasks';
import EnhancedNoteItem from '../components/NoteItem';
import {database} from '../db/db';
import Label from '../db/models/Label';
import Note from '../db/models/Note';
import {resetDeleteLabelState, resetEditLabelState} from '../redux/actions';
const BOTTOM_APPBAR_HEIGHT = 64;
// const EnhancedLabelItem = enhanceLabelItem(LabelItem);
/**
 *
 * @param {object} param0
 * @param {Array<Label>} param0.labels
 * @param {Array<Note>} param0.notes
 * @returns
 */
const PinScreen = ({
  navigation,
  dispatch,
  labels,
  notes,
  quickListSettings,
}) => {
  // ref

  // variables
  const [listViewMode, setListViewMode] = useState('grid');
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();

  // const navigation = useNavigation();

  // state

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  // callbacks

  // render functions

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
  const _navigateToSearchScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.SEARCH);
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetDeleteLabelState());
    dispatch(resetEditLabelState());
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
          title="#Pinned notes"
          titleStyle={{fontWeight: '700', color: theme?.colors.primary}}
        />
        <Appbar.Action
          icon={listViewMode === 'grid' ? 'view-grid' : 'view-list'}
          onPress={_handleListViewMode}
        />
        <Appbar.Action icon={'magnify'} onPress={_navigateToSearchScreen} />
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

const mapStateToProps = state => {
  return {
    isCreatingNote: state.note.isCreatingNote,
    createNoteSuccess: state.note.createNoteSuccess,
    createNoteFailure: state.note.createNoteFailure,
    quickListSettings: state.settings.quickListSettings,
  };
};

const enhancePinScreen = withObservables([], ({}) => ({
  labels: database.collections.get('labels').query().observe(),
  notes: database.collections
    .get('notes')
    .query(Q.where('is_archived', Q.notEq(true)), Q.where('is_pinned', true))
    .observe(),
}));
const EnhancedPinScreen = enhancePinScreen(PinScreen);

export default connect(mapStateToProps)(EnhancedPinScreen);
