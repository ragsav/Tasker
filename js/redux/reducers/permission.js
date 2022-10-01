import {
  CHECK_CONTACTS_PERMISSION_STATE_CHANGE,
  CHECK_CALENDAR_PERMISSION_STATE_CHANGE,
  CHECK_STORAGE_WRITE_PERMISSION_STATE_CHANGE,
} from '../actions';

export default (
  state = {
    isCheckingContactsPermission: false,
    contactsPermissionState: null,

    isCheckingCalendarPermission: false,
    calendarPermissionState: null,

    isCheckingStorageWritePermission: false,
    storageWritePermissionState: null,
  },
  action,
) => {
  switch (action.type) {
    case CHECK_CONTACTS_PERMISSION_STATE_CHANGE:
      return {
        ...state,
        isCheckingContactsPermission: action.isCheckingContactsPermission,
        contactsPermissionState: action.contactsPermissionState,
      };
    case CHECK_STORAGE_WRITE_PERMISSION_STATE_CHANGE:
      return {
        ...state,
        isCheckingStorageWritePermission:
          action.isCheckingStorageWritePermission,
        storageWritePermissionState: action.storageWritePermissionState,
      };

    case CHECK_CALENDAR_PERMISSION_STATE_CHANGE:
      return {
        ...state,
        isCheckingCalendarPermission: action.isCheckingCalendarPermission,
        calendarPermissionState: action.calendarPermissionState,
      };
    default:
      return state;
  }
};
