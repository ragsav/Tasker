import {CONSTANTS} from '../../../constants';
import NotificationService from '../../services/notifications';
import {Storage} from '../../utils/asyncStorage';

export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_TASK_LIST_DEFAULT_VIEW = 'CHANGE_TASK_LIST_DEFAULT_VIEW';
export const CHANGE_QUICK_LIST_SETTINGS = 'CHANGE_QUICK_LIST_SETTINGS';
export const CHANGE_DAILY_REMINDER_SETTINGS = 'CHANGE_DAILY_REMINDER_SETTINGS';
export const CHANGE_RENDER_URL_IN_TASK_SETTINGS =
  'CHANGE_RENDER_URL_IN_TASK_SETTINGS';
export const CHANGE_DEFAULT_HOME_SCREEN_SETTINGS =
  'CHANGE_DEFAULT_HOME_SCREEN_SETTINGS';

export const setThemeState = ({theme}) => {
  return {
    type: CHANGE_THEME,
    theme,
  };
};

export const setTaskListDetailViewState = ({isTaskListDetailView}) => {
  return {
    type: CHANGE_TASK_LIST_DEFAULT_VIEW,
    isTaskListDetailView,
  };
};

export const setDefaultHomeScreenState = ({defaultHomeScreen}) => {
  return {
    type: CHANGE_DEFAULT_HOME_SCREEN_SETTINGS,
    defaultHomeScreen,
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

export const setTheme =
  ({theme}) =>
  async dispatch => {
    if (theme?.dark) {
      Storage.storeData(CONSTANTS.LOCAL_STORAGE_KEYS.LOCAL_THEME, 'dark');
    } else {
      Storage.storeData(CONSTANTS.LOCAL_STORAGE_KEYS.LOCAL_THEME, 'light');
    }
    dispatch(setThemeState({theme}));
  };
export const setTaskListDetailView =
  ({isTaskListDetailView}) =>
  async dispatch => {
    Storage.storeData(
      CONSTANTS.LOCAL_STORAGE_KEYS.TASK_LIST_DETAILED_VIEW,
      isTaskListDetailView,
    );
    dispatch(setTaskListDetailViewState({isTaskListDetailView}));
  };
export const setDefaultHomeScreen =
  ({defaultHomeScreen}) =>
  async dispatch => {
    Storage.storeData(
      CONSTANTS.LOCAL_STORAGE_KEYS.DEFAULT_HOME_SCREEN,
      defaultHomeScreen,
    );
    dispatch(setDefaultHomeScreenState({defaultHomeScreen}));
  };
export const setQuickListSettings =
  ({quickListSettings}) =>
  async dispatch => {
    console.log(quickListSettings);
    Storage.storeData(
      CONSTANTS.LOCAL_STORAGE_KEYS.QUICK_LIST_SETTING,
      quickListSettings,
    );
    dispatch(setQuickListSettingsState({quickListSettings}));
  };
export const setRenderURLInTaskSettings =
  ({renderURLInTask}) =>
  async dispatch => {
    Storage.storeData(
      CONSTANTS.LOCAL_STORAGE_KEYS.RENDER_URL_IN_TASK_SETTING,
      renderURLInTask,
    );
    dispatch(setRenderURLInTaskSettingsState({renderURLInTask}));
  };
export const setDailyReminderSetting =
  ({dailyReminderTimestamp}) =>
  async dispatch => {
    Storage.getData(CONSTANTS.LOCAL_STORAGE_KEYS.DAILY_REMINDER_TIMESTAMP).then(
      timestamp => {
        if (timestamp && dailyReminderTimestamp === timestamp) {
          dispatch(setDailyReminderSettingState({dailyReminderTimestamp}));
        } else {
          NotificationService.scheduleDailyReminder({
            timestamp: dailyReminderTimestamp,
          });
          Storage.storeData(
            CONSTANTS.LOCAL_STORAGE_KEYS.DAILY_REMINDER_TIMESTAMP,
            dailyReminderTimestamp,
          );
          dispatch(setDailyReminderSettingState({dailyReminderTimestamp}));
        }
      },
    );
  };
