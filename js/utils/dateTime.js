/**
 * Returns the week number for this date.
 * https://stackoverflow.com/questions/9045868/javascript-date-getweek
 * @param  {Date} date
 * @param  {number} [dowOffset] — The day of week the week "starts" on for your locale - it can be from `0` to `6`. By default `dowOffset` is `0` (USA, Sunday). If `dowOffset` is 1 (Monday), the week returned is the ISO 8601 week number.
 * @return {number}
 */
export const getWeek = (date, dowOffset = 0) => {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
  const newYear = new Date(date.getFullYear(), 0, 1);
  let day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  const daynum =
    Math.floor(
      (date.getTime() -
        newYear.getTime() -
        (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000,
    ) + 1;
  //if the year starts before the middle of a week
  if (day < 4) {
    const weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      const nYear = new Date(date.getFullYear() + 1, 0, 1);
      let nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
          the week, it is week #1 of that year*/
      return nday < 4 ? 1 : 53;
    }
    return weeknum;
  } else {
    return Math.floor((daynum + day - 1) / 7);
  }
};

export const getMondayFromWeekNum = (weekNum, year) => {
  const monday = new Date(year, 0, 1 + (weekNum - 1) * 7);
  while (monday.getDay() !== 0) {
    monday.setDate(monday.getDate() - 1);
  }
  return monday;
};

export const getWeekTimeframeString = (weekNum, year) => {
  const monday = new Date(year, 0, 1 + weekNum * 7);
  while (monday.getDay() !== 1) {
    monday.setDate(monday.getDate() - 1);
  }
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `${String(monday.getDate()).padStart(2, '0')}.${String(
    monday.getMonth() + 1,
  ).padStart(2, '0')} ~ ${String(sunday.getDate()).padStart(2, '0')}.${String(
    sunday.getMonth() + 1,
  ).padStart(2, '0')}`;
};

export const currentStartDate = inputTime => {
  let d;
  if (inputTime) {
    d = new Date(inputTime);
  } else {
    d = new Date();
  }

  const n = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0);
  return n;
};

export const currentEndDate = inputTime => {
  let d;
  if (inputTime) {
    d = new Date(inputTime);
  } else {
    d = new Date();
  }
  const n = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0);
  n.setMonth(d.getMonth() + 1);
  return n;
};
