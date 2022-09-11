import {currentEndDate, currentStartDate} from '../../utils/dateTime';
import {SET_START_DATE, SET_END_DATE} from '../actions';

export default (
  state = {
    sDate: currentStartDate(),
    eDate: currentEndDate(),
  },
  action,
) => {
  switch (action.type) {
    case SET_START_DATE:
      return {
        ...state,
        sDate: action.sDate,
      };
    case SET_END_DATE:
      return {
        ...state,
        eDate: action.eDate,
      };

    default:
      return state;
  }
};
