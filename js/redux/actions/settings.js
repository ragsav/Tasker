export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_QUICK_LIST_SETTINGS = 'CHANGE_QUICK_LIST_SETTINGS';
export const CHANGE_RENDER_URL_IN_TASK_SETTINGS =
  'CHANGE_RENDER_URL_IN_TASK_SETTINGS';
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

export const setRenderURLInTaskSettings = ({renderURLInTask}) => {
  return {
    type: CHANGE_RENDER_URL_IN_TASK_SETTINGS,
    renderURLInTask,
  };
};
