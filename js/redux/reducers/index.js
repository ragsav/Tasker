import {combineReducers} from 'redux';
import label from './label';
import note from './note';
import task from './task';
import permission from './permission';
import timeFrame from './timeFrame';

export default combineReducers({
  permission,
  label,
  note,
  task,
  timeFrame,
});
