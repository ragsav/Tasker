import {applyMiddleware, compose, createStore} from 'redux';
import {} from './actions';

import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';

const enhancers = [applyMiddleware(thunkMiddleware)];
export const configureStore = persistedState => {
  const store = createStore(rootReducer, persistedState, compose(...enhancers));

  return store;
};