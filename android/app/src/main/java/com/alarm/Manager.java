package com.alarm;

import android.content.Context;
import android.util.Log;
import java.util.Calendar;
import java.util.Date;

public class Manager {

    private static final String TAG = "AlarmManager";
    private static Sound sound;
    private static String activeAlarmUid;

    static String getActiveAlarm() {
        return activeAlarmUid;
    }

    static void schedule(Context context, Alarm alarm) {
        AlarmDate date = alarm.getAlarmDate();
        Helper.scheduleAlarm(context, alarm.uid, date.getTime(), date.getNotificationId());
        Storage.saveAlarm(context, alarm);
        Storage.saveDate(context, date);
    }

    public static void reschedule(Context context) {
        Alarm[] alarms = Storage.getAllAlarms(context);
        for (Alarm alarm : alarms) {
            Storage.removeDate(context, alarm.uid);
            AlarmDate date = alarm.getAlarmDate();
            Storage.saveDate(context, date);
            Helper.scheduleAlarm(context, alarm.uid, date.getTime(), date.getNotificationId());
            Log.d(TAG, "rescheduling alarm: " + alarm.uid);
        }
    }

    static void update(Context context, Alarm alarm) {
        AlarmDate prevDate = Storage.getDate(context, alarm.uid);
        AlarmDate date = alarm.getAlarmDate();
        Helper.scheduleAlarm(context, alarm.uid, date.getTime(), date.getNotificationId());
        Storage.saveAlarm(context, alarm);
        Storage.saveDate(context, date);
        if (prevDate == null) return;
        Helper.cancelAlarm(context, date.getNotificationId());
    }


    static void removeAll(Context context) {
        Alarm[] alarms = Storage.getAllAlarms(context);
        for (Alarm alarm : alarms) {
            remove(context, alarm.uid);
        }
    }

    static void remove(Context context, String alarmUid) {
        Alarm alarm = Storage.getAlarm(context, alarmUid);
        if(alarm==null) return;
        AlarmDate date = Storage.getDate(context, alarm.uid);
        Storage.removeAlarm(context, alarm.uid);
        Storage.removeDate(context, alarm.uid);
        if (date == null) return;
        int notificationID = date.getNotificationId();
        Helper.cancelAlarm(context, notificationID);
    }




    static void start(Context context, String alarmUid) {
        activeAlarmUid = alarmUid;
        sound = new Sound(context);
        sound.play("default");

        Log.d(TAG, "Starting " + activeAlarmUid);
    }

    // static void stop(Context context) {
    //     Log.d(TAG, "Stopping " + activeAlarmUid);
    //     if (sound != null) {
    //         sound.stop();
    //     }
        
    //     Alarm alarm = Storage.getAlarm(context, activeAlarmUid);
    //     if(alarm==null) return;
    //     AlarmDate date = Storage.getDate(context, activeAlarmUid);
    //     // Manager.remove(context,activeAlarmUid);
    //     activeAlarmUid = null;
    // }
    static void stop(Context context) {
        Log.d(TAG, "Stopping " + activeAlarmUid);

        if (sound != null) {
            sound.stop();
        }
        Alarm alarm = Storage.getAlarm(context, activeAlarmUid);
        AlarmDate date = Storage.getDate(context, activeAlarmUid);
        Storage.saveAlarm(context, alarm);
        Storage.removeDate(context, activeAlarmUid);
        activeAlarmUid = null;
    }



}