package com.alarm;

import android.content.Context;
import android.content.SharedPreferences;

import com.tasker.R;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

class Storage {

    static void saveAlarm(Context context, Alarm alarm) {
        SharedPreferences.Editor editor = getEditor(context);
        editor.putString(alarm.uid, Alarm.toJson(alarm));
        editor.apply();
    }

    static void saveDate(Context context, AlarmDate date) {
        SharedPreferences.Editor editor = getEditor(context);
        editor.putString(date.uid, AlarmDate.toJson(date));
        editor.apply();
    }

    static Alarm[] getAllAlarms(Context context) {
        ArrayList<Alarm> alarms = new ArrayList<>();
        SharedPreferences preferences = getSharedPreferences(context);
        Map<String, ?> keyMap = preferences.getAll();
        for (Map.Entry<String, ?> entry : keyMap.entrySet()) {
            if (AlarmDate.isDateId(entry.getKey())) continue;
            alarms.add(Alarm.fromJson((String)entry.getValue()));
        }
        return alarms.toArray(new Alarm[0]);
    }

    // static Alarm getAlarm(Context context) {
    //     ArrayList<Alarm> alarms = new ArrayList<>();
    
    //     SharedPreferences preferences = getSharedPreferences(context);
    //     Map<String, ?> keyMap = preferences.getAll();
    //     for (Map.Entry<String, ?> entry : keyMap.entrySet()) {
    //         if (AlarmDate.isDateId(entry.getKey())) continue;
    //         alarms.add(Alarm.fromJson((String)entry.getValue()));
    //     }
    //     return alarms.get(0);
    // }

    static Alarm getAlarm(Context context, String alarmUid) {
        SharedPreferences preferences = getSharedPreferences(context);
        return Alarm.fromJson(preferences.getString(alarmUid, null));
    }

    static AlarmDate getDate(Context context, String alarmUid) {
        SharedPreferences preferences = getSharedPreferences(context);
        String json = preferences.getString(AlarmDate.getDateId(alarmUid), null);
        return AlarmDate.fromJson(json);
    }

    static void removeAlarm(Context context, String alarmUid) {
        remove(context, alarmUid);
    }

    static void removeDate(Context context, String alarmUid) {
        remove(context, AlarmDate.getDateId(alarmUid));
    }

    private static void remove(Context context, String id) {
        SharedPreferences preferences = getSharedPreferences(context);
        SharedPreferences.Editor editor = preferences.edit();
        editor.remove(id);
        editor.apply();
    }

    private static SharedPreferences.Editor getEditor (Context context) {
        SharedPreferences sharedPreferences = getSharedPreferences(context);
        return sharedPreferences.edit();
    }

    private static SharedPreferences getSharedPreferences(Context context) {
        String fileKey = context.getResources().getString(R.string.notification_channel_id);
        return context.getSharedPreferences(fileKey, Context.MODE_PRIVATE);
    }

}
