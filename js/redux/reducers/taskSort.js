import {CONSTANTS} from '../../../constants';
import {SET_TASK_SORT_ORDER, SET_TASK_SORT_PROPERTY} from '../actions';
import {Storage} from '../../utils/asyncStorage';
export default (
  state = {
    taskSortProperty: CONSTANTS.TASK_SORT.DUE_DATE.code,
    taskSortOrder: CONSTANTS.TASK_SORT_ORDER.ASC.code,
  },
  action,
) => {
  switch (action.type) {
    case SET_TASK_SORT_PROPERTY:
      Storage.storeData('task_sort_property', action.taskSortProperty);
      return {
        ...state,
        taskSortProperty: action.taskSortProperty,
      };
    case SET_TASK_SORT_ORDER:
      Storage.storeData('task_sort_order', action.taskSortOrder);
      return {
        ...state,
        taskSortOrder: action.taskSortOrder,
      };

    default:
      return state;
  }
};
