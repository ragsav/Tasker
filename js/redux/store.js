import {applyMiddleware, compose, createStore} from 'redux';
import {
  handleCalendarPermissionUsingLibrary,
  setQuickListSettings,
  setTheme,
} from './actions';

import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import {Storage} from '../utils/asyncStorage';
import {_customDarkTheme, _customLightTheme} from '../../themes';

const enhancers = [applyMiddleware(thunkMiddleware)];
export const configureStore = persistedState => {
  const store = createStore(rootReducer, persistedState, compose(...enhancers));
  store.dispatch(handleCalendarPermissionUsingLibrary());
  Storage.getData('local_theme').then(theme => {
    console.log(theme);
    if (theme === 'dark') {
      store.dispatch(setTheme({theme: _customDarkTheme}));
    } else {
      store.dispatch(setTheme({theme: _customLightTheme}));
    }
  });
  Storage.getData('quick_list_settings').then(quickListSettings => {
    store.dispatch(setQuickListSettings({quickListSettings}));
  });
  return store;
};
