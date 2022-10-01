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
  setLastBackupTime,
} from '../redux/actions';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {WTDBSync} from '../db/sync';
import moment from 'moment';
const BOTTOM_APPBAR_HEIGHT = 64;
const BackupConfigScreen = ({dispatch, lastBackupTimestamp}) => {
  // ref

  // variables
  const theme = useTheme();
  const navigation = useNavigation();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions
  const _handleDownloadBackup = () => {
    WTDBSync.fetchAllLocalRecords({
      successCallback: () => {
        dispatch(setLastBackupTime({timestamp: Date.now()}));
      },
    });
  };

  const _handleOpenBackupFile = async () => {
    const path = RNFS.DownloadDirectoryPath + '/backup.json';
    const file = await RNFS.readFile(path, 'utf8');
    WTDBSync.loadDatabase({recordsData: JSON.parse(file)});
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
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title="#Backup" titleStyle={{fontWeight: '700'}} />
      </Appbar.Header>
      <Divider />
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          paddingBottom: BOTTOM_APPBAR_HEIGHT,
        }}>
        <List.Item
          title="Download backup"
          onPress={_handleDownloadBackup}
          titleStyle={{fontWeight: '600', color: theme?.colors.onSurface}}
          descriptionNumberOfLines={5}
          description={
            lastBackupTimestamp === 0
              ? `Backup of present tasks and notes can be downloaded and saved for future use. Backup will be stored at ${
                  RNFS.DownloadDirectoryPath + '/backup.json'
                }`
              : `Last complete backup ${moment(lastBackupTimestamp)
                  .calendar()
                  .toString()}`
          }
          left={props => <List.Icon icon={'folder-download'} />}
        />
        <List.Item
          title="Restore backup"
          onPress={_handleOpenBackupFile}
          titleStyle={{fontWeight: '600', color: theme?.colors.onSurface}}
          descriptionNumberOfLines={5}
          description={`If backup is present on device then it can be restored. Backup can be restored from ${
            RNFS.DownloadDirectoryPath + '/backup.json'
          }`}
          left={props => <List.Icon icon={'backup-restore'} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const mapStateToProps = state => {
  return {
    lastBackupTimestamp: state.settings.lastBackupTimestamp,
  };
};
export default connect(mapStateToProps)(BackupConfigScreen);
