import {_customDarkTheme, _customLightTheme} from '../../../themes';
import {database} from '../../db/db';
import {Storage} from '../../utils/asyncStorage';
import {
  CHANGE_DAILY_REMINDER_SETTINGS,
  CHANGE_QUICK_LIST_SETTINGS,
  CHANGE_RENDER_URL_IN_TASK_SETTINGS,
  CHANGE_THEME,
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
  },
  action,
) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.theme,
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
    default:
      return state;
  }
};
