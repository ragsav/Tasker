import {Q} from '@nozbe/watermelondb';
import {CONSTANTS} from '../../../constants';

export const SET_NOTE_SORT_PROPERTY = 'SET_NOTE_SORT_PROPERTY';
export const SET_NOTE_SORT_ORDER = 'SET_NOTE_SORT_ORDER';
export const noteSortQuery = (noteSortProperty, noteSortOrder) => {
  return Q.sortBy(
    !noteSortProperty ||
      String(noteSortProperty).trim() === '' ||
      noteSortProperty === undefined
      ? CONSTANTS.NOTE_SORT.CREATED_AT.code
      : String(noteSortProperty).trim(),
    !noteSortOrder ||
      noteSortOrder === undefined ||
      String(noteSortOrder) === Q.asc ||
      String(noteSortOrder) === Q.desc
      ? noteSortOrder
      : Q.asc,
  );
};
export const setNoteSortProperty = ({noteSortProperty}) => {
  console.log({noteSortProperty});
  return {
    type: SET_NOTE_SORT_PROPERTY,
    noteSortProperty,
  };
};

export const setNoteSortOrder = ({noteSortOrder}) => {
  return {
    type: SET_NOTE_SORT_ORDER,
    noteSortOrder,
  };
};
