/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Button,
  Divider,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlatGrid} from 'react-native-super-grid';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {EmptyTasks} from '../components/EmptyTasks';
import {EnhancedLabelItem} from '../components/LabelItem';
import EnhancedNoteItem from '../components/NoteItem';
import PinnedNoteItem from '../components/PinnedNoteItem';
import {database} from '../db/db';
import Label from '../db/models/Label';
import Note from '../db/models/Note';
import MasonryList from '@react-native-seoul/masonry-list';
import {
  deleteLabel,
  resetDeleteLabelState,
  resetEditLabelState,
  setDefaultHomeScreen,
  unGroupLabel,
} from '../redux/actions';
import {Storage} from '../utils/asyncStorage';
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
  const _renderPinnedNoteItem = ({item}) => {
    return <PinnedNoteItem note={item} />;
  };

  // handle functions
  const _handleDeleteLabel = id => {
    dispatch(deleteLabel({id}));
  };
  const _handleUnGroupLabel = id => {
    dispatch(unGroupLabel({id}));
  };

  // navigation functions

  const _navigateBack = () => {
    navigation?.pop();
  };

  const _navigateHome = () => {
    navigation?.reset({
      index: 0,
      routes: [{name: CONSTANTS.ROUTES.HOME}],
    });
    dispatch(setDefaultHomeScreen({defaultHomeScreen: CONSTANTS.ROUTES.HOME}));
  };

  const _navigateToCreateLabelScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.ADD_LABEL);
  };
  const _navigateToDayScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.MY_DAY);
  };
  const _navigateToBookmarkScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.BOOKMARKS);
  };
  const _navigateToCompletedScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.COMPLETED);
  };
  const _navigateToAllTaskScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.ALL);
  };
  const _navigateToCalendarScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.CALENDAR);
  };
  const _navigateToCreateNoteScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.ADD_NOTE);
  };
  const _navigateToSearchScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.SEARCH);
  };
  const _navigateToSettings = () => {
    navigation?.navigate(CONSTANTS.ROUTES.SETTINGS);
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
        <Appbar.Content
          title="#Pinned notes"
          titleStyle={{fontWeight: '700', color: theme?.colors.primary}}
        />
        <Appbar.Action icon={'magnify'} onPress={_navigateToSearchScreen} />
        <Appbar.Action icon={'cog'} onPress={_navigateToSettings} />
      </Appbar.Header>
      <MasonryList
        style={{alignSelf: 'stretch'}}
        contentContainerStyle={{
          alignSelf: 'stretch',
          paddingHorizontal: 6,
        }}
        numColumns={2}
        data={notes}
        keyExtractor={(item, index) => item.id}
        renderItem={_renderPinnedNoteItem}
      />
      {/* <FlatGrid
        data={notes}
        maxItemsPerRow={2}
        spacing={12}
        renderItem={_renderPinnedNoteItem}
        adjustGridToStyles={true}
        additionalRowStyle={{alignItems: 'flex-start'}}
        keyExtractor={(item, index) => item.id}
      /> */}

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
          <Appbar.Action
            isLeading={false}
            icon="format-list-group"
            iconColor={theme?.colors.onPrimary}
            onPress={_navigateHome}
          />
          <Appbar.Action
            isLeading={false}
            icon="note-plus"
            iconColor={theme?.colors.onPrimary}
            onPress={_navigateToCreateNoteScreen}
          />
        </View>
      </Appbar>
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
    .query(Q.where('label_id', ''), Q.where('is_archived', Q.notEq(true)))
    .observe(),
}));
const EnhancedPinScreen = enhancePinScreen(PinScreen);

export default connect(mapStateToProps)(EnhancedPinScreen);
