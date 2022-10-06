import {CHANGE_LAST_BACKUP_TIME} from '../actions';

export default (
  state = {
    lastBackupTimeStamp: null,
  },
  action,
) => {
  switch (action.type) {
    case CHANGE_LAST_BACKUP_TIME: {
      return {
        ...state,
        lastBackupTimeStamp: action.lastBackupTimeStamp,
      };
    }
    default:
      return state;
  }
};
