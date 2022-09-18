export const CHANGE_THEME = 'CHANGE_THEME';

export const setTheme = ({theme}) => {
  return {
    type: CHANGE_THEME,
    theme,
  };
};
