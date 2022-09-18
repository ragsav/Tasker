import {_customDarkTheme, _customLightTheme} from '../../../themes';
import {database} from '../../db/db';
import {Storage} from '../../utils/asyncStorage';
import {CHANGE_QUICK_LIST_SETTINGS, CHANGE_THEME} from '../actions';

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
  },
  action,
) => {
  switch (action.type) {
    case CHANGE_THEME:
      if (action?.theme?.dark) {
        Storage.storeData('local_theme', 'dark');
      } else {
        Storage.storeData('local_theme', 'light');
      }
      return {
        ...state,
        theme: action.theme,
      };
    case CHANGE_QUICK_LIST_SETTINGS:
      Storage.storeData('quick_list_settings', action.quickListSettings);
      return {
        ...state,
        quickListSettings: action.quickListSettings,
      };
    default:
      return state;
  }
};
