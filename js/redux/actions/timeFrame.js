export const SET_START_DATE = 'SET_START_DATE';
export const SET_END_DATE = 'SET_END_DATE';

export const setStartDate = ({sDate}) => {
  return {
    type: SET_START_DATE,
    sDate,
  };
};
export const setEndDate = ({eDate}) => {
  return {
    type: SET_END_DATE,
    eDate,
  };
};
