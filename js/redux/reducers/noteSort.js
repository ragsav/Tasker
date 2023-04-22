import {CONSTANTS} from '../../../constants';
import {SET_NOTE_SORT_ORDER, SET_NOTE_SORT_PROPERTY} from '../actions';
import {Storage} from '../../utils/asyncStorage';
export default (
  state = {
    noteSortProperty: CONSTANTS.NOTE_SORT.TITLE.code,
    noteSortOrder: CONSTANTS.NOTE_SORT_ORDER.ASC.code,
  },
  action,
) => {
  switch (action.type) {
    case SET_NOTE_SORT_PROPERTY:
      Storage.storeData(
        CONSTANTS.LOCAL_STORAGE_KEYS.NOTE_SORT_PROPERTY,
        action.noteSortProperty,
      );
      return {
        ...state,
        noteSortProperty: action.noteSortProperty,
      };
    case SET_NOTE_SORT_ORDER:
      Storage.storeData(
        CONSTANTS.LOCAL_STORAGE_KEYS.NOTE_SORT_ORDER,
        action.noteSortOrder,
      );
      return {
        ...state,
        noteSortOrder: action.noteSortOrder,
      };

    default:
      return state;
  }
};
