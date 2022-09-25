import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {Appbar, Divider, List, Switch, useTheme} from 'react-native-paper';
import {connect} from 'react-redux';
import {_customDarkTheme, _customLightTheme} from '../../themes';
import {
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

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
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
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title={'Settings'} titleStyle={{fontWeight: '700'}} />
      </Appbar.Header>
      <ScrollView>
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
  };
};

export default connect(mapStateToProps)(Settings);
