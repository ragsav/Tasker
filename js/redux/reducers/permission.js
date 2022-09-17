import {
  CHECK_CONTACTS_PERMISSION_STATE_CHANGE,
  CHECK_CALENDAR_PERMISSION_STATE_CHANGE,
} from '../actions';

export default (
  state = {
    isCheckingContactsPermission: false,
    contactsPermissionState: null,

    isCheckingCalendarPermission: false,
    calendarPermissionState: null,
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
