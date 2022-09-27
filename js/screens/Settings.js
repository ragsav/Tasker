import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback} from 'react';
import {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  Appbar,
  Divider,
  IconButton,
  List,
  Switch,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {_customDarkTheme, _customLightTheme} from '../../themes';
import {
  setDailyReminderSetting,
  setQuickListSettings,
  setRenderURLInTaskSettings,
  setTheme,
} from '../redux/actions';
/**
 *
 * @param {object} param0
 * @returns
 */
const Settings = ({
  navigation,
  renderURLInTask,
  dispatch,
  quickListSettings,
  dailyReminderTimestamp,
}) => {
  // ref

  // variables
  const theme = useTheme();
  const [isReminderTimePickerVisible, setIsReminderTimePickerVisible] =
    useState(false);

  // states

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

  const _handleToggleTheme = () => {
    if (theme.dark) {
      dispatch(setTheme({theme: _customLightTheme}));
    } else {
      dispatch(setTheme({theme: _customDarkTheme}));
    }
  };
  const _handleToggleMyDayList = () => {
    dispatch(
      setQuickListSettings({
        quickListSettings: {
          ...quickListSettings,
          myDay: quickListSettings ? !quickListSettings.myDay : true,
        },
      }),
    );
  };
  const _handleToggleAllTaskList = () => {
    dispatch(
      setQuickListSettings({
        quickListSettings: {
          ...quickListSettings,
          all: quickListSettings ? !quickListSettings.all : true,
        },
      }),
    );
  };
  const _handleToggleCompleted = () => {
    dispatch(
      setQuickListSettings({
        quickListSettings: {
          ...quickListSettings,
          completed: quickListSettings ? !quickListSettings.completed : true,
        },
      }),
    );
  };
  const _handleToggleBookmarks = () => {
    dispatch(
      setQuickListSettings({
        quickListSettings: {
          ...quickListSettings,
          bookmarks: quickListSettings ? !quickListSettings.bookmarks : true,
        },
      }),
    );
  };
  const _handleToggleMyCalendarList = () => {
    dispatch(
      setQuickListSettings({
        quickListSettings: {
          ...quickListSettings,
          myCalendar: quickListSettings ? !quickListSettings.myCalendar : true,
        },
      }),
    );
  };

  const _handleToggleRenderURLSettings = () => {
    dispatch(
      setRenderURLInTaskSettings({renderURLInTask: !Boolean(renderURLInTask)}),
    );
  };
  const _handleOpenReminderTimePicker = () => {
    setIsReminderTimePickerVisible(true);
  };
  const _handleOnDailyReminderTimeChange = date => {
    dispatch(
      setDailyReminderSetting({
        dailyReminderTimestamp: new Date(date).getTime(),
      }),
    );

    setIsReminderTimePickerVisible(false);
  };
  const _handleRemoveDailyReminder = date => {
    dispatch(
      setDailyReminderSetting({
        dailyReminderTimestamp: 0,
      }),
    );
    setIsReminderTimePickerVisible(false);
  };
  const _handleCloseDailyReminderTimePicker = () => {
    setIsReminderTimePickerVisible(false);
  };

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };
  const _navigateToArchivedTasks = () => {
    navigation?.push(CONSTANTS.ROUTES.ARCHIVED_TASKS);
  };
  const _navigateToArchivedNotes = () => {
    navigation?.push(CONSTANTS.ROUTES.ARCHIVED_NOTES);
  };
  const _navigateToDeletedTasks = () => {
    navigation?.push(CONSTANTS.ROUTES.DELETED_TASKS);
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {};

  // return
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <DatePicker
        modal
        open={isReminderTimePickerVisible}
        date={
          dailyReminderTimestamp ? new Date(dailyReminderTimestamp) : new Date()
        }
        onConfirm={_handleOnDailyReminderTimeChange}
        onCancel={_handleCloseDailyReminderTimePicker}
        mode="time"
      />
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title={'Settings'} titleStyle={{fontWeight: '700'}} />
      </Appbar.Header>
      <ScrollView>
        <List.Item
          onPress={_navigateToArchivedNotes}
          title={'#Archived notes'}
          left={props => (
            <List.Icon
              {...props}
              icon="package-down"
              color={theme.colors.onSurface}
            />
          )}
          right={props => (
            <List.Icon
              {...props}
              icon="chevron-right"
              color={theme.colors.onSurface}
            />
          )}
        />
        <List.Item
          onPress={_navigateToArchivedTasks}
          title={'#Archived tasks'}
          left={props => (
            <List.Icon
              {...props}
              icon="package-down"
              color={theme.colors.onSurface}
            />
          )}
          right={props => (
            <List.Icon
              {...props}
              icon="chevron-right"
              color={theme.colors.onSurface}
            />
          )}
        />
        <List.Item
          onPress={_navigateToDeletedTasks}
          title={'#Trash'}
          left={props => (
            <List.Icon
              {...props}
              icon="delete"
              color={theme.colors.onSurface}
            />
          )}
          right={props => (
            <List.Icon
              {...props}
              icon="chevron-right"
              color={theme.colors.onSurface}
            />
          )}
        />
        <List.Item
          title={'Dark theme'}
          left={props => (
            <List.Icon
              {...props}
              icon="palette"
              color={theme.colors.onSurface}
            />
          )}
          right={props => (
            <Switch value={theme.dark} onValueChange={_handleToggleTheme} />
          )}
        />
        <Divider />
        <List.Section>
          <List.Subheader>Quick lists</List.Subheader>

          <List.Item
            title={'Show My day quick list'}
            left={props => (
              <List.Icon
                {...props}
                icon="calendar-today"
                color={theme.colors.onSurface}
              />
            )}
            right={props => (
              <Switch
                value={quickListSettings?.myDay}
                onValueChange={_handleToggleMyDayList}
              />
            )}
          />
          <List.Item
            title={'Show All tasks quick list'}
            left={props => (
              <List.Icon
                {...props}
                icon="all-inclusive"
                color={theme.colors.onSurface}
              />
            )}
            right={props => (
              <Switch
                value={quickListSettings?.all}
                onValueChange={_handleToggleAllTaskList}
              />
            )}
          />
          <List.Item
            title={'Show completed tasks quick list'}
            left={props => (
              <List.Icon
                {...props}
                icon="check-all"
                color={theme.colors.onSurface}
              />
            )}
            right={props => (
              <Switch
                value={quickListSettings?.completed}
                onValueChange={_handleToggleCompleted}
              />
            )}
          />
          <List.Item
            title={'Show bookmarks quick list'}
            left={props => (
              <List.Icon
                {...props}
                icon="bookmark"
                color={theme.colors.onSurface}
              />
            )}
            right={props => (
              <Switch
                value={quickListSettings?.bookmarks}
                onValueChange={_handleToggleBookmarks}
              />
            )}
          />
          <List.Item
            title={'Show my calendar quick list'}
            left={props => (
              <List.Icon
                {...props}
                icon="calendar"
                color={theme.colors.onSurface}
              />
            )}
            right={props => (
              <Switch
                value={quickListSettings?.myCalendar}
                onValueChange={_handleToggleMyCalendarList}
              />
            )}
          />
        </List.Section>
        <Divider />
        <List.Item
          title={'Extract URLs from tasks'}
          left={props => (
            <List.Icon {...props} icon="link" color={theme.colors.onSurface} />
          )}
          right={props => (
            <Switch
              value={renderURLInTask}
              onValueChange={_handleToggleRenderURLSettings}
            />
          )}
        />
        <Divider />
        <List.Item
          title={
            dailyReminderTimestamp && dailyReminderTimestamp > 0
              ? `Daily reminder set at ${moment(dailyReminderTimestamp).format(
                  'hh:mm',
                )}`
              : `Set daily reminder`
          }
          onPress={_handleOpenReminderTimePicker}
          left={props => (
            <List.Icon
              {...props}
              icon="update"
              color={theme.colors.onSurface}
            />
          )}
          right={
            dailyReminderTimestamp && dailyReminderTimestamp > 0
              ? props => (
                  <IconButton
                    {...props}
                    icon="close"
                    iconColor={theme.colors.onSurface}
                    onPress={_handleRemoveDailyReminder}
                  />
                )
              : null
          }
        />

        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};

// const enhanceSettings = withObservables([], ({}) => ({}));
// const EnhancedSettings = enhanceSettings(Settings);

const mapStateToProps = state => {
  return {
    quickListSettings: state.settings.quickListSettings,
    renderURLInTask: state.settings.renderURLInTask,
    dailyReminderTimestamp: state.settings.dailyReminderTimestamp,
  };
};

export default connect(mapStateToProps)(Settings);
