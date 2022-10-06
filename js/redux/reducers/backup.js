import {CHANGE_LAST_BACKUP_TIME, CHANGE_LAST_RESTORE_TIME} from '../actions';

export default (
  state = {
    lastBackupTimeStamp: null,
    lastRestoreTimeStamp: null,
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
    case CHANGE_LAST_RESTORE_TIME: {
      console.log({lastRestoreTimeStamp: action.lastRestoreTimeStamp});
      return {
        ...state,
        lastRestoreTimeStamp: action.lastRestoreTimeStamp,
      };
    }
    default:
      return state;
  }
};
