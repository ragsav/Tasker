import {CHECK_CONTACTS_PERMISSION_STATE_CHANGE} from '../actions';

export default (
  state = {
    isCheckingContactsPermission: false,
    contactsPermissionState: null,
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
    default:
      return state;
  }
};
