import {NativeModules} from 'react-native';

import React from 'react';
import {Logger} from '../utils/logger';
import moment from 'moment';

const AlarmService = NativeModules.AlarmModule;
export class TaskReminderService {
  static scheduleSingleReminder = async ({
    reminderTimestamp,
    title,
    description,
  }) => {
    const alarmID = String(Math.floor(Math.random() * 1000) + 1);
    console.log({alarmID});
    const _d = new Date(reminderTimestamp);
    console.log({_d});
    const alarm = new Alarm({
      uid: alarmID,
      title: title,
      description:
        description && String(description).length > 0
          ? description
          : `Reminder ${moment(reminderTimestamp)
              .calendar()
              .toString()
              .toLowerCase()}`,
      year: _d.getFullYear(),
      month: _d.getMonth(),
      date: _d.getDate(),
      hour: _d.getHours(),
      minutes: _d.getMinutes(),
    });
    console.log({alarm});
    await NativeAlarmService.scheduleAlarm(alarm);
    return alarmID;
  };

  static removeReminder = async ({alarmID}) => {
    await NativeAlarmService.stopAlarm();
    await NativeAlarmService.removeAlarm(alarmID);
  };
  static removeRemindersByIDs = async ({alarmIDs}) => {
    if (Array.isArray(alarmIDs) && alarmIDs.length > 0) {
      alarmIDs.forEach(alarmID => {
        this.removeAlarm({alarmID});
      });
    }
  };
  static getCurrentReminder = async () => {
    const alarmID = await NativeAlarmService.getAlarmState();
    const alarm = await NativeAlarmService.getAlarm(alarmID);

    return new Alarm(alarm);
  };
}
export class NativeAlarmService {
  static scheduleAlarm = async alarm => {
    if (!(alarm instanceof Alarm)) {
      alarm = new Alarm(alarm);
    }
    await AlarmService.set(alarm);
    Logger.pageLogger('NativeAlarmService:scheduleAlarm:alarm', alarm);
  };
  static stopAlarm = async () => {
    await AlarmService.stop();
  };

  static removeAlarm = async uid => {
    await AlarmService.remove(uid);
  };

  static updateAlarm = async alarm => {
    if (!(alarm instanceof Alarm)) {
      alarm = new Alarm(alarm);
    }
    await AlarmService.update(alarm);
  };

  static removeAllAlarms = async () => {
    await AlarmService.removeAll();
  };

  static getAllAlarms = async () => {
    const alarms = await AlarmService.getAll();
    return alarms;
  };

  static getAlarm = async uid => {
    const alarm = await AlarmService.get(uid);
    return new Alarm(alarm);
  };

  static getAlarmState = async () => {
    return AlarmService.getState();
  };
}
export default class Alarm {
  constructor(params = null) {
    this.uid = getParam(params, 'uid', '3');
    this.title = getParam(params, 'title', 'Alarm');
    this.description = getParam(params, 'description', 'Wake up');
    this.year = getParam(params, 'year', new Date().getFullYear());
    this.month = getParam(params, 'month', new Date().getMonth());
    this.date = getParam(params, 'date', new Date().getDate());
    this.hour = getParam(params, 'hour', new Date().getHours());
    this.minutes = getParam(params, 'minutes', new Date().getMinutes() + 1);
  }

  static getEmpty() {
    return new Alarm({
      title: '',
      description: '',
      year: 0,
      month: 0,
      date: 1,
      hour: 0,
      minutes: 0,
    });
  }

  getTimeString() {
    const hour = this.hour < 10 ? '0' + this.hour : this.hour;
    const minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    return {hour, minutes};
  }

  getTime() {
    const timeDate = new Date();
    timeDate.setMinutes(this.minutes);
    timeDate.setHours(this.hour);
    return timeDate;
  }
}

function getParam(param, key, defaultValue) {
  try {
    if (param && (param[key] !== null || param[key] !== undefined)) {
      return param[key];
    } else {
      return defaultValue;
    }
  } catch (e) {
    return defaultValue;
  }
}
