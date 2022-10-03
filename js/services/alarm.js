import {NativeModules} from 'react-native';

import React from 'react';

const AlarmService = NativeModules.AlarmModule;
console.log({NativeModules});
export async function scheduleAlarm(alarm) {
  if (!(alarm instanceof Alarm)) {
    alarm = new Alarm(alarm);
  }
  await AlarmService.set(alarm);
  console.log('scheduling alarm: ', JSON.stringify(alarm));
}

export async function stopAlarm() {
  await AlarmService.stop();
}

export async function removeAlarm(uid) {
  await AlarmService.remove(uid);
}

export async function updateAlarm(alarm) {
  if (!(alarm instanceof Alarm)) {
    alarm = new Alarm(alarm);
  }
  await AlarmService.update(alarm);
}

export async function removeAllAlarms() {
  await AlarmService.removeAll();
}

export async function getAllAlarms() {
  const alarms = await AlarmService.getAll();
  console.log({alarms});
  return alarms;
}

export async function getAlarm(uid) {
  const alarm = await AlarmService.get(uid);
  return new Alarm(alarm);
}

export async function getAlarmState() {
  return AlarmService.getState();
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
