export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_QUICK_LIST_SETTINGS = 'CHANGE_QUICK_LIST_SETTINGS';
export const setTheme = ({theme}) => {
  return {
    type: CHANGE_THEME,
    theme,
  };
};

export const setQuickListSettings = ({quickListSettings}) => {
  return {
    type: CHANGE_QUICK_LIST_SETTINGS,
    quickListSettings,
  };
};
