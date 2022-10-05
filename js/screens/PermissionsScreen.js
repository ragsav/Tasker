import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Divider,
  IconButton,
  List,
  useTheme,
} from 'react-native-paper';
import RNSettings from 'react-native-settings';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {
  handleCalendarPermissionUsingLibrary,
  handleStorageWritePermissionUsingLibrary,
} from '../redux/actions';
const BOTTOM_APPBAR_HEIGHT = 64;
const PermissionsScreen = ({
  calendarPermissionState,
  storageWritePermissionState,
  dispatch,
}) => {
  // ref

  // variables
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions
  const _handleCalendarPermissionRequest = () => {
    dispatch(handleCalendarPermissionUsingLibrary());
  };
  const _handleStorageWritePermissionRequest = () => {
    dispatch(handleStorageWritePermissionUsingLibrary());
  };

  // navigation functions
  const _navigateToSystemSettings = () => {
    Linking.openSettings();
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
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
      <StatusBar
        barStyle={theme?.statusBarStyle}
        backgroundColor={theme?.colors.surface}

        // translucent
      />
      <Appbar.Header>
        <Appbar.Content title="#Permissions" titleStyle={{fontWeight: '700'}} />
      </Appbar.Header>
      <Divider />
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          paddingBottom: BOTTOM_APPBAR_HEIGHT,
        }}>
        <List.Item
          title="Calendar permission"
          titleStyle={{fontWeight: '600', color: theme?.colors.onSurface}}
          description="This permission is required to add your events or tasks to local calendars"
          left={props => <List.Icon {...props} icon="calendar" />}
          onPress={_handleCalendarPermissionRequest}
          right={props => (
            <List.Icon
              icon={calendarPermissionState ? 'check-circle' : 'close-circle'}
              color={
                calendarPermissionState
                  ? theme?.colors.primary
                  : theme?.colors.error
              }
            />
          )}
        />
        <List.Item
          title="Storage permission"
          titleStyle={{fontWeight: '600', color: theme?.colors.onSurface}}
          description="This permission is required to save your backups"
          left={props => <List.Icon {...props} icon="backup-restore" />}
          onPress={_handleStorageWritePermissionRequest}
          right={props => (
            <List.Icon
              icon={
                storageWritePermissionState ? 'check-circle' : 'close-circle'
              }
              color={
                storageWritePermissionState
                  ? theme?.colors.primary
                  : theme?.colors.error
              }
            />
          )}
        />
      </ScrollView>
      <Divider />
      <Appbar
        style={{
          height: BOTTOM_APPBAR_HEIGHT + bottom,

          justifyContent: 'space-between',
        }}
        safeAreaInsets={{bottom}}>
        <Appbar.Content
          title="Not able to grant permission?"
          subtitle="You can navigate to your device settings and provide the permissions required manually"
          titleStyle={{
            fontWeight: '600',
            color: theme?.colors.primary,
            fontSize: 14,
          }}
        />

        <Button
          contentStyle={{flexDirection: 'row-reverse'}}
          icon="cog"
          onPress={_navigateToSystemSettings}>
          Settings
        </Button>
      </Appbar>
    </SafeAreaView>
  );
};
const mapStateToProps = state => {
  return {
    calendarPermissionState: state.permission.calendarPermissionState,
    storageWritePermissionState: state.permission.storageWritePermissionState,
  };
};
export default connect(mapStateToProps)(PermissionsScreen);
