import {CONSTANTS} from '../../../constants';
import {_customLightTheme} from '../../../themes';
import {
  CHANGE_DAILY_REMINDER_SETTINGS,
  CHANGE_DEFAULT_HOME_SCREEN_SETTINGS,
  CHANGE_QUICK_LIST_SETTINGS,
  CHANGE_RENDER_URL_IN_TASK_SETTINGS,
  CHANGE_THEME,
  CHANGE_TASK_LIST_DEFAULT_VIEW,
} from '../actions';

export default (
  state = {
    theme: _customLightTheme,
    quickListSettings: {
      myDay: true,
      all: true,
      completed: true,
      bookmarks: true,
      myCalendar: true,
    },
    renderURLInTask: true,
    dailyReminderTimestamp: 0,
    defaultHomeScreen: CONSTANTS.ROUTES.LABEL_DRAWER,
    isTaskListDetailView: false,
  },
  action,
) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    case CHANGE_DEFAULT_HOME_SCREEN_SETTINGS:
      return {
        ...state,
        defaultHomeScreen: action.defaultHomeScreen
          ? action.defaultHomeScreen
          : CONSTANTS.ROUTES.LABEL_DRAWER,
      };
    case CHANGE_QUICK_LIST_SETTINGS:
      return {
        ...state,
        quickListSettings: action.quickListSettings,
      };
    case CHANGE_RENDER_URL_IN_TASK_SETTINGS:
      return {
        ...state,
        renderURLInTask: action.renderURLInTask,
      };
    case CHANGE_DAILY_REMINDER_SETTINGS: {
      return {
        ...state,
        dailyReminderTimestamp: action.dailyReminderTimestamp,
      };
    }
    case CHANGE_TASK_LIST_DEFAULT_VIEW: {
      return {
        ...state,
        isTaskListDetailView: action.isTaskListDetailView,
      };
    }

    default:
      return state;
  }
};
