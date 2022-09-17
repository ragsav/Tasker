import {Logger} from '../../utils/logger';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';

export const CHECK_CONTACTS_PERMISSION_STATE_CHANGE =
  'CHECK_CONTACTS_PERMISSION_STATE_CHANGE';
export const CHECK_CALENDAR_PERMISSION_STATE_CHANGE =
  'CHECK_CALENDAR_PERMISSION_STATE_CHANGE';

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

const checkCalendarPermissionState = (
  isCheckingCalendarPermission,
  calendarPermissionState,
) => {
  return {
    type: CHECK_CALENDAR_PERMISSION_STATE_CHANGE,
    isCheckingCalendarPermission,
    calendarPermissionState,
  };
};

const checkContactsPermission = async () => {
  let result;
  let permission;
  if (Platform.OS === 'ios') {
    result = await checkMultiple([PERMISSIONS.IOS.CONTACTS]);

    permission = result['ios.permission.CONTACTS'] === RESULTS.GRANTED;
  } else if (Platform.OS === 'android') {
    result = await checkMultiple([PERMISSIONS.ANDROID.READ_CONTACTS]);

    permission = result['android.permission.READ_CONTACTS'] === RESULTS.GRANTED;
  }

  return permission;
};

const checkCalendarPermission = async () => {
  let result;
  let permission;
  if (Platform.OS === 'ios') {
    result = await checkMultiple([PERMISSIONS.IOS.CALENDARS]);

    permission = result['ios.permission.CALENDARS'] === RESULTS.GRANTED;
  } else if (Platform.OS === 'android') {
    result = await checkMultiple([
      PERMISSIONS.ANDROID.WRITE_CALENDAR,
      PERMISSIONS.ANDROID.READ_CALENDAR,
    ]);

    permission =
      result['android.permission.READ_CALENDAR'] === RESULTS.GRANTED &&
      result['android.permission.WRITE_CALENDAR'] === RESULTS.GRANTED;
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

export const handleCalendarPermissionUsingLibrary = () => async dispatch => {
  dispatch(checkCalendarPermissionState(true, null));
  let permission = await checkCalendarPermission();

  if (!permission) {
    if (Platform.OS === 'ios') {
      requestMultiple([PERMISSIONS.IOS.CALENDARS]).then(async result => {
        permission = await checkCalendarPermission();
        dispatch(checkCalendarPermissionState(false, permission));
      });
    } else if (Platform.OS === 'android') {
      requestMultiple([
        PERMISSIONS.ANDROID.WRITE_CALENDAR,
        PERMISSIONS.ANDROID.READ_CALENDAR,
      ]).then(async result => {
        permission = await checkCalendarPermission();
        dispatch(checkCalendarPermissionState(false, permission));
      });
    }
  }
  dispatch(checkCalendarPermissionState(false, permission));
};
