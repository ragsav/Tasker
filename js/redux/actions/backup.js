import Snackbar from 'react-native-snackbar';
import {CONSTANTS} from '../../../constants';
import {WTDBBackup} from '../../db/sync';
import {Storage} from '../../utils/asyncStorage';
import {Logger} from '../../utils/logger';
import DocumentPicker, {types} from 'react-native-document-picker';
export const CHANGE_LAST_BACKUP_TIME = 'CHANGE_LAST_BACKUP_TIME';
export const CHANGE_LAST_RESTORE_TIME = 'CHANGE_LAST_RESTORE_TIME';
import RNFS from 'react-native-fs';
export const setLastBackupTimeState = ({timestamp}) => {
  return {
    type: CHANGE_LAST_BACKUP_TIME,
    lastBackupTimeStamp: timestamp,
  };
};

export const setLastBackupTime =
  ({timestamp}) =>
  async dispatch => {
    Storage.storeData(
      CONSTANTS.LOCAL_STORAGE_KEYS.LAST_BACKUP_TIMESTAMP,
      timestamp,
    );
    dispatch(setLastBackupTimeState({timestamp}));
  };
export const setLastRestoreTimeState = ({timestamp}) => {
  return {
    type: CHANGE_LAST_RESTORE_TIME,
    lastRestoreTimeStamp: timestamp,
  };
};

export const setLastRestoreTime =
  ({timestamp}) =>
  async dispatch => {
    Storage.storeData(
      CONSTANTS.LOCAL_STORAGE_KEYS.LAST_RESTORE_TIMESTAMP,
      timestamp,
    );
    dispatch(setLastRestoreTimeState({timestamp}));
  };

export const backupDB = () => async dispatch => {
  try {
    WTDBBackup.fetchAllLocalRecords({
      successCallback: () => {
        dispatch(setLastBackupTime({timestamp: Date.now()}));
        Snackbar.show({
          text: 'Backup stored successfully in Downloads',
          duration: Snackbar.LENGTH_SHORT,
          action: {
            text: 'Ok',
            textColor: 'green',
            onPress: () => {
              Snackbar.dismiss();
            },
          },
        });
      },
    });
  } catch (error) {
    Logger.pageLogger('backup.js:backupDB:catch', error);
    Snackbar.show({
      text: 'Oops! Something went wrong',
      duration: Snackbar.LENGTH_LONG,
      action: {
        text: 'Report',
        textColor: 'red',
        onPress: () => {
          Snackbar.dismiss();
        },
      },
    });
  }
};

export const restoreDB = () => async dispatch => {
  try {
    const fileMData = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
    });
    if (fileMData.type != 'application/json') {
      Snackbar.show({
        text: 'Backup file format not supported!',
        duration: Snackbar.LENGTH_SHORT,
        action: {
          text: 'Ok',
          textColor: 'red',
          onPress: () => {
            Snackbar.dismiss();
          },
        },
      });
      return;
    }

    const file = await RNFS.readFile(fileMData.uri, 'utf8');

    WTDBBackup.loadDatabase({
      recordsData: JSON.parse(file),
      successCallback: () => {
        dispatch(setLastRestoreTime({timestamp: Date.now()}));
        Snackbar.show({
          text: 'Backup restored successfully!',
          duration: Snackbar.LENGTH_SHORT,
          action: {
            text: 'Ok',
            textColor: 'green',
            onPress: () => {
              Snackbar.dismiss();
            },
          },
        });
      },
    });
  } catch (error) {
    Logger.pageLogger('backup.js:restoreDB:catch', error);
    Snackbar.show({
      text: 'Oops! Something went wrong',
      duration: Snackbar.LENGTH_LONG,
      action: {
        text: 'Report',
        textColor: 'red',
        onPress: () => {
          Snackbar.dismiss();
        },
      },
    });
  }
};
