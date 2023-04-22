import {Q} from '@nozbe/watermelondb';
import {CONSTANTS} from '../../../constants';

export const SET_TASK_SORT_PROPERTY = 'SET_TASK_SORT_PROPERTY';
export const SET_TASK_SORT_ORDER = 'SET_TASK_SORT_ORDER';

export const setTaskSortProperty = ({taskSortProperty}) => {
  return {
    type: SET_TASK_SORT_PROPERTY,
    taskSortProperty,
  };
};

export const setTaskSortOrder = ({taskSortOrder}) => {
  return {
    type: SET_TASK_SORT_ORDER,
    taskSortOrder,
  };
};
