import NotificationService from '../../services/notifications';
import {Storage} from '../../utils/asyncStorage';

export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_QUICK_LIST_SETTINGS = 'CHANGE_QUICK_LIST_SETTINGS';
export const CHANGE_DAILY_REMINDER_SETTINGS = 'CHANGE_DAILY_REMINDER_SETTINGS';
export const CHANGE_LAST_BACKUP_TIME = 'CHANGE_LAST_BACKUP_TIME';
export const CHANGE_RENDER_URL_IN_TASK_SETTINGS =
  'CHANGE_RENDER_URL_IN_TASK_SETTINGS';
export const setLastBackupTimeState = ({timestamp}) => {
  return {
    type: CHANGE_LAST_BACKUP_TIME,
    lastbackupTimeStamp: timestamp,
  };
};
export const setThemeState = ({theme}) => {
  return {
    type: CHANGE_THEME,
    theme,
  };
};

export const setQuickListSettingsState = ({quickListSettings}) => {
  return {
    type: CHANGE_QUICK_LIST_SETTINGS,
    quickListSettings,
  };
};

export const setRenderURLInTaskSettingsState = ({renderURLInTask}) => {
  return {
    type: CHANGE_RENDER_URL_IN_TASK_SETTINGS,
    renderURLInTask,
  };
};

export const setDailyReminderSettingState = ({dailyReminderTimestamp}) => {
  return {
    type: CHANGE_DAILY_REMINDER_SETTINGS,
    dailyReminderTimestamp,
  };
};
export const setLastBackupTime =
  ({timestamp}) =>
  async dispatch => {
    Storage.storeData('last_backup_timestamp', timestamp);
    dispatch(setLastBackupTimeState({timestamp}));
  };
export const setTheme =
  ({theme}) =>
  async dispatch => {
    if (theme?.dark) {
      Storage.storeData('local_theme', 'dark');
    } else {
      Storage.storeData('local_theme', 'light');
    }
    dispatch(setThemeState({theme}));
  };
export const setQuickListSettings =
  ({quickListSettings}) =>
  async dispatch => {
    Storage.storeData('quick_list_settings', quickListSettings);
    dispatch(setQuickListSettingsState({quickListSettings}));
  };
export const setRenderURLInTaskSettings =
  ({renderURLInTask}) =>
  async dispatch => {
    Storage.storeData('render_url_in_task_settings', renderURLInTask);
    dispatch(setRenderURLInTaskSettingsState({renderURLInTask}));
  };
export const setDailyReminderSetting =
  ({dailyReminderTimestamp}) =>
  async dispatch => {
    Storage.getData('daily_reminder_timestamp').then(timestamp => {
      if (timestamp && dailyReminderTimestamp === timestamp) {
        dispatch(setDailyReminderSettingState({dailyReminderTimestamp}));
      } else {
        NotificationService.scheduleDailyReminder({
          timestamp: dailyReminderTimestamp,
        });
        Storage.storeData('daily_reminder_timestamp', dailyReminderTimestamp);
        dispatch(setDailyReminderSettingState({dailyReminderTimestamp}));
      }
    });
  };
