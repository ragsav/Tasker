/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {Q} from '@nozbe/watermelondb';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Button,
  Divider,
  List,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {EnhancedLabelItem} from '../components/LabelItem';
import {EnhancedNoteItem} from '../components/NoteItem';
import {database} from '../db/db';
import Label from '../db/models/Label';
import {deleteLabel, resetDeleteLabelState} from '../redux/actions';
import Note from '../db/models/Note';
// import CreateNewLabelBottomSheet from './CreateNewLabelScreen';
const BOTTOM_APPBAR_HEIGHT = 64;

// const EnhancedLabelItem = enhanceLabelItem(LabelItem);
/**
 *
 * @param {object} param0
 * @param {Array<Label>} param0.labels
 * @param {Array<Note>} param0.notes
 * @returns
 */
const Home = ({navigation, dispatch, labels, notes}) => {
  // ref

  // variables
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();

  // const navigation = useNavigation();

  // state
  const [searchQuery, setSearchQuery] = React.useState('');

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  // callbacks

  // render functions

  // handle functions

  const _handleSearchQueryChange = query => setSearchQuery(query);
  const _handleDeleteLabel = id => {
    dispatch(deleteLabel({id}));
  };

  // navigation functions

  const _navigateToCreateLabelScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.ADD_LABEL);
  };
  const _navigateToDayScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.MY_DAY);
  };
  const _navigateToBookmarkScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.BOOKMARKS);
  };
  const _navigateToCalendarScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.CALENDAR);
  };
  const _navigateToCreateNoteScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.ADD_NOTE);
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetDeleteLabelState());
  };

  // return
  return (
    <SafeAreaView style={styles.main}>
      {/* <Surface style={styles.container}> */}
      <Searchbar
        placeholder="Search"
        onChangeText={_handleSearchQueryChange}
        value={searchQuery}
      />
      <TouchableRipple onPress={_navigateToDayScreen}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 12,
              backgroundColor: 'transparent',
            }}>
            <MaterialCommunityIcons
              name="calendar-today"
              size={24}
              color={theme.colors.onSurface}
            />
            <Text style={{marginLeft: 12}}>My day</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={theme.colors.onSurface}
          />
        </View>
      </TouchableRipple>
      <Divider />
      <TouchableRipple onPress={_navigateToBookmarkScreen}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 12,
              backgroundColor: 'transparent',
            }}>
            <MaterialCommunityIcons
              name="bookmark"
              size={24}
              color={theme.colors.onSurface}
            />
            <Text style={{marginLeft: 12}}>Bookmarks</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={theme.colors.onSurface}
          />
        </View>
      </TouchableRipple>
      <Divider />
      <TouchableRipple onPress={_navigateToCalendarScreen}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 12,
              backgroundColor: 'transparent',
            }}>
            <MaterialCommunityIcons
              name="calendar"
              size={24}
              color={theme.colors.onSurface}
            />
            <Text style={{marginLeft: 12}}>My calendar</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={theme.colors.onSurface}
          />
        </View>
      </TouchableRipple>
      {labels && labels.length > 0 && (
        <Text
          style={{
            backgroundColor: theme.colors.onSecondary,
            padding: 12,
            paddingVertical: 6,
          }}>
          Labels
        </Text>
      )}
      <List.AccordionGroup>
        {labels.map((label, index) => {
          return (
            <EnhancedLabelItem
              label={label}
              handleDeleteLabel={_handleDeleteLabel}
              key={index}
            />
          );
        })}
      </List.AccordionGroup>
      {notes && notes.length > 0 && (
        <Text
          style={{
            backgroundColor: theme.colors.onSecondary,
            padding: 12,
            paddingVertical: 6,
          }}>
          Unlabeled Notes
        </Text>
      )}
      {notes.map((note, index) => {
        return <EnhancedNoteItem note={note} key={index} />;
      })}
      {/* </Surface> */}

      <Appbar
        style={[
          styles.bottom,
          {
            height: BOTTOM_APPBAR_HEIGHT + bottom,
            backgroundColor: theme.colors.elevation.level2,
          },
        ]}
        safeAreaInsets={{bottom}}>
        <Button icon="plus" onPress={_navigateToCreateLabelScreen}>
          Add label
        </Button>
        <Appbar.Action
          isLeading={false}
          icon="note-plus"
          onPress={_navigateToCreateNoteScreen}
        />
      </Appbar>
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    isCreatingNote: state.note.isCreatingNote,
    createNoteSuccess: state.note.createNoteSuccess,
    createNoteFailure: state.note.createNoteFailure,
  };
};

const enhanceHome = withObservables([], ({}) => ({
  labels: database.collections.get('labels').query().observe(),
  notes: database.collections
    .get('notes')
    .query(Q.where('label_id', ''))
    .observe(),
}));
const EnhancedHome = enhanceHome(Home);

export default connect(mapStateToProps)(EnhancedHome);

const styles = StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    right: 16,
    padding: 0,
  },
});
