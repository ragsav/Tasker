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
  Storage.getData('local_theme').then(theme => {
    Logger.pageLogger('Storage.getData:local_theme', {theme});
    if (theme === 'dark') {
      store.dispatch(setTheme({theme: _customDarkTheme}));
    } else {
      store.dispatch(setTheme({theme: _customLightTheme}));
    }
  });
  Storage.getData('quick_list_settings').then(quickListSettings => {
    Logger.pageLogger('Storage.getData:quick_list_settings', {
      quickListSettings,
    });
    store.dispatch(setQuickListSettings({quickListSettings}));
  });
  Storage.getData('render_url_in_task_settings').then(renderURLInTask => {
    Logger.pageLogger('Storage.getData:render_url_in_task_settings', {
      renderURLInTask,
    });
    store.dispatch(setRenderURLInTaskSettings({renderURLInTask}));
  });
  Storage.getData('task_sort_property').then(taskSortProperty => {
    Logger.pageLogger('Storage.getData:task_sort_property', {taskSortProperty});
    store.dispatch(
      setTaskSortProperty({
        taskSortProperty: taskSortProperty
          ? taskSortProperty
          : CONSTANTS.TASK_SORT.DUE_DATE.code,
      }),
    );
  });
  Storage.getData('task_sort_order').then(taskSortOrder => {
    Logger.pageLogger('Storage.getData:task_sort_order', {taskSortOrder});
    store.dispatch(
      setTaskSortOrder({
        taskSortOrder: taskSortOrder
          ? taskSortOrder
          : CONSTANTS.TASK_SORT_ORDER.ASC.code,
      }),
    );
  });
  Storage.getData('last_backup_timestamp').then(timestamp => {
    if (timestamp && timestamp != 0) {
      store.dispatch(setLastBackupTime({timestamp}));
    } else {
      store.dispatch(setLastBackupTime({timestamp: 0}));
    }
  });
  Storage.getData('daily_reminder_timestamp').then(timestamp => {
    if (timestamp && timestamp != 0) {
      store.dispatch(
        setDailyReminderSetting({dailyReminderTimestamp: timestamp}),
      );
    }
  });
  store.dispatch(removePastReminders());
  return store;
};
