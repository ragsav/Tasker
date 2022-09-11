import {Logger} from '../../utils/logger';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';

export const CHECK_CONTACTS_PERMISSION_STATE_CHANGE =
  'CHECK_CONTACTS_PERMISSION_STATE_CHANGE';

const checkContactsPermissionState = (
  isCheckingContactsPermission,
  contactsPermissionState,
) => {
  Logger.pageLogger('checkContactsPermissionState', {
    isCheckingContactsPermission,
    contactsPermissionState,
  });
  return {
    type: CHECK_CONTACTS_PERMISSION_STATE_CHANGE,
    isCheckingContactsPermission,
    contactsPermissionState,
  };
};

const checkContactsPermission = async () => {
  let result;
  let permission;
  if (Platform.OS === 'ios') {
    result = await checkMultiple([PERMISSIONS.IOS.CONTACTS]);
    Logger.pageLogger('checkLocationPermission', {result});
    permission = result['ios.permission.CONTACTS'] === RESULTS.GRANTED;
  } else if (Platform.OS === 'android') {
    result = await checkMultiple([PERMISSIONS.ANDROID.READ_CONTACTS]);
    Logger.pageLogger('checkLocationPermission', {result});
    permission = result['android.permission.READ_CONTACTS'] === RESULTS.GRANTED;
  }

  return permission;
};

export const handleContactsPermissionUsingLibrary = () => async dispatch => {
  dispatch(checkContactsPermissionState(true, null));
  let permission = await checkContactsPermission();
  Logger.pageLogger('handleContactsPermissionUsingLibrary', {permission});
  if (!permission) {
    if (Platform.OS === 'ios') {
      requestMultiple([PERMISSIONS.IOS.CONTACTS]).then(async result => {
        permission = await checkContactsPermission();
        dispatch(checkContactsPermissionState(false, permission));
      });
    } else if (Platform.OS === 'android') {
      requestMultiple([PERMISSIONS.ANDROID.READ_CONTACTS]).then(
        async result => {
          permission = await checkContactsPermission();
          dispatch(checkContactsPermissionState(false, permission));
        },
      );
    }
  }
  dispatch(checkContactsPermissionState(false, permission));
};
