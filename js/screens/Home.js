/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {synchronize} from '@nozbe/watermelondb/sync';
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Divider,
  List,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {EnhancedLabelItem} from '../components/LabelItem';
import {EnhancedNoteItem} from '../components/NoteItem';
import {database} from '../db/db';
import Label from '../db/models/Label';
import Note from '../db/models/Note';
import {
  deleteLabel,
  resetDeleteLabelState,
  unGroupLabel,
} from '../redux/actions';
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
  const _handleUnGroupLabel = id => {
    dispatch(unGroupLabel({id}));
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
  const _navigateToSearchScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.SEARCH);
  };
  const _navigateToSettings = () => {
    navigation?.navigate(CONSTANTS.ROUTES.SETTINGS);
  };
  const _demo = async () => {
    await synchronize({
      database,
      pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
        return {changes: [], timestamp: Date.now()};
      },

      pushChanges: async ({changes, lastPulledAt}) => {
        console.log({changes, lastPulledAt});
      },
    });
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetDeleteLabelState());
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
          title="#Notes"
          titleStyle={{fontWeight: '700', color: theme?.colors.primary}}
        />
        <Appbar.Action icon={'magnify'} onPress={_navigateToSearchScreen} />
        <Appbar.Action icon={'cog'} onPress={_navigateToSettings} />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          paddingBottom: BOTTOM_APPBAR_HEIGHT,
        }}>
        <List.Item
          title="My day"
          left={props => (
            <List.Icon
              {...props}
              icon="calendar-today"
              color={theme.colors.onSurface}
            />
          )}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={_navigateToDayScreen}
        />
        <Divider />
        <List.Item
          title="Bookmarks"
          left={props => (
            <List.Icon
              {...props}
              icon="bookmark"
              color={theme.colors.onSurface}
            />
          )}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={_navigateToBookmarkScreen}
        />
        <Divider />
        <List.Item
          title="My calendar"
          left={props => (
            <List.Icon
              {...props}
              icon="calendar"
              color={theme.colors.onSurface}
            />
          )}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={_navigateToCalendarScreen}
        />

        {labels && labels.length > 0 && (
          <Text
            style={{
              backgroundColor: theme?.colors.surfaceVariant,
              padding: 12,
              paddingVertical: 6,
              color: theme?.colors.onSurfaceVariant,
              fontWeight: '600',
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
                handleUnGroupLabel={_handleUnGroupLabel}
                key={index}
              />
            );
          })}
        </List.AccordionGroup>
        {notes && notes.length > 0 && (
          <Text
            style={{
              backgroundColor: theme?.colors.surfaceVariant,
              padding: 12,
              paddingVertical: 6,
              color: theme?.colors.onSurfaceVariant,
              fontWeight: '600',
            }}>
            Unlabeled Notes
          </Text>
        )}
        {notes.map((note, index) => {
          return <EnhancedNoteItem note={note} key={index} />;
        })}
      </ScrollView>

      {/* </Surface> */}

      <Appbar
        style={[
          styles.bottom,
          {
            height: BOTTOM_APPBAR_HEIGHT + bottom,
            backgroundColor: theme?.colors.primary,
          },
        ]}
        safeAreaInsets={{bottom}}>
        <Button
          icon="plus"
          onPress={_navigateToCreateLabelScreen}
          textColor={theme?.colors.onPrimary}>
          Add label
        </Button>
        <Appbar.Action
          isLeading={false}
          icon="note-plus"
          iconColor={theme?.colors.onPrimary}
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
