import {applyMiddleware, compose, createStore} from 'redux';
import {
  handleCalendarPermissionUsingLibrary,
  handleStorageWritePermissionUsingLibrary,
  removePastReminders,
  setDailyReminderSetting,
  setLastBackupTime,
  setQuickListSettings,
  setRenderURLInTaskSettings,
  setTaskSortOrder,
  setTaskSortProperty,
  setTheme,
} from './actions';

import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import {Storage} from '../utils/asyncStorage';
import {_customDarkTheme, _customLightTheme} from '../../themes';
import {CONSTANTS} from '../../constants';
import {Logger} from '../utils/logger';

const enhancers = [applyMiddleware(thunkMiddleware)];
export const configureStore = persistedState => {
  const store = createStore(rootReducer, persistedState, compose(...enhancers));
  store.dispatch(handleCalendarPermissionUsingLibrary());
  store.dispatch(handleStorageWritePermissionUsingLibrary());
  Storage.getData(CONSTANTS.LOCAL_STORAGE_KEYS.LOCAL_THEME).then(theme => {
    Logger.pageLogger('Storage.getData:LOCAL_THEME', {theme});
    if (theme === 'dark') {
      store.dispatch(setTheme({theme: _customDarkTheme}));
    } else {
      store.dispatch(setTheme({theme: _customLightTheme}));
    }
  });
  Storage.getData(CONSTANTS.LOCAL_STORAGE_KEYS.QUICK_LIST_SETTING).then(
    quickListSettings => {
      Logger.pageLogger('Storage.getData:QUICK_LIST_SETTING', {
        quickListSettings,
      });
      store.dispatch(setQuickListSettings({quickListSettings}));
    },
  );
  Storage.getData(CONSTANTS.LOCAL_STORAGE_KEYS.RENDER_URL_IN_TASK_SETTING).then(
    renderURLInTask => {
      Logger.pageLogger('Storage.getData:RENDER_URL_IN_TASK_SETTING', {
        renderURLInTask,
      });
      store.dispatch(setRenderURLInTaskSettings({renderURLInTask}));
    },
  );
  Storage.getData(CONSTANTS.LOCAL_STORAGE_KEYS.TASK_SORT_PROPERTY).then(
    taskSortProperty => {
      Logger.pageLogger('Storage.getData:TASK_SORT_PROPERTY', {
        taskSortProperty,
      });
      store.dispatch(
        setTaskSortProperty({
          taskSortProperty: taskSortProperty
            ? taskSortProperty
            : CONSTANTS.TASK_SORT.DUE_DATE.code,
        }),
      );
    },
  );
  Storage.getData(CONSTANTS.LOCAL_STORAGE_KEYS.TASK_SORT_ORDER).then(
    taskSortOrder => {
      Logger.pageLogger('Storage.getData:TASK_SORT_ORDER', {taskSortOrder});
      store.dispatch(
        setTaskSortOrder({
          taskSortOrder: taskSortOrder
            ? taskSortOrder
            : CONSTANTS.TASK_SORT_ORDER.ASC.code,
        }),
      );
    },
  );
  Storage.getData(CONSTANTS.LOCAL_STORAGE_KEYS.LAST_BACKUP_TIMESTAMP).then(
    timestamp => {
      Logger.pageLogger('Storage.getData:LAST_BACKUP_TIMESTAMP', {timestamp});
      if (timestamp && timestamp != 0) {
        store.dispatch(setLastBackupTime({timestamp}));
      } else {
        store.dispatch(setLastBackupTime({timestamp: 0}));
      }
    },
  );
  Storage.getData(CONSTANTS.LOCAL_STORAGE_KEYS.DAILY_REMINDER_TIMESTAMP).then(
    timestamp => {
      Logger.pageLogger('Storage.getData:DAILY_REMINDER_TIMESTAMP', {
        timestamp,
      });
      if (timestamp && timestamp != 0) {
        store.dispatch(
          setDailyReminderSetting({dailyReminderTimestamp: timestamp}),
        );
      }
    },
  );
  store.dispatch(removePastReminders());
  return store;
};
