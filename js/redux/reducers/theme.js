import {_customDarkTheme, _customLightTheme} from '../../../themes';
import {CHANGE_THEME} from '../actions';

export default (
  state = {
    theme: _customDarkTheme,
  },
  action,
) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.theme,
      };

    default:
      return state;
  }
};
