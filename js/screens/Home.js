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
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  Divider,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {EmptyTasks} from '../components/EmptyTasks';
import {EnhancedLabelItem} from '../components/LabelItem';
import {EnhancedNoteItem} from '../components/NoteItem';
import {database} from '../db/db';
import Label from '../db/models/Label';
import Note from '../db/models/Note';
import {
  deleteLabel,
  resetDeleteLabelState,
  resetEditLabelState,
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
const Home = ({navigation, dispatch, labels, notes, quickListSettings}) => {
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

  // handle functions
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
          title="#Tasker"
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
        {quickListSettings?.myDay && (
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
        )}
        {quickListSettings?.myDay && <Divider />}
        {quickListSettings?.all && (
          <List.Item
            title="All"
            left={props => (
              <List.Icon
                {...props}
                icon="all-inclusive"
                color={theme.colors.onSurface}
              />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={_navigateToAllTaskScreen}
          />
        )}
        {quickListSettings?.all && <Divider />}
        {quickListSettings?.completed && (
          <List.Item
            title="Completed"
            left={props => (
              <List.Icon
                {...props}
                icon="check-all"
                color={theme.colors.onSurface}
              />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={_navigateToCompletedScreen}
          />
        )}
        {quickListSettings?.completed && <Divider />}
        {quickListSettings?.bookmarks && (
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
        )}
        {quickListSettings?.bookmarks && <Divider />}
        {quickListSettings?.myCalendar && (
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
        )}

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
            Unlabeled notes
          </Text>
        )}
        {notes.map((note, index) => {
          return <EnhancedNoteItem note={note} key={index} />;
        })}
        {(!notes || notes.length == 0) && (!labels || labels.length == 0) ? (
          <EmptyTasks />
        ) : null}
      </ScrollView>

      <Appbar
        style={{
          height: BOTTOM_APPBAR_HEIGHT + bottom,
          backgroundColor: theme?.colors.primary,
          justifyContent: 'space-between',
        }}
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
    quickListSettings: state.settings.quickListSettings,
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
