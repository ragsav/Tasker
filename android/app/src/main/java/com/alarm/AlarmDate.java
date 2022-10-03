package com.alarm;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;

public class AlarmDate {

    private static final String postfix = "_DATE";
    String uid;
    String alarmUid;
    Calendar date;
    int notificationId;

    public AlarmDate (String alarmUid, Calendar date) {
        this.uid = alarmUid + postfix;
        this.alarmUid = alarmUid;
        this.date = date;
        this.notificationId = randomId();
    }

    public static String getDateId (String alarmUid) {
        return alarmUid + postfix;
    }

    public int getNotificationId () {
        return notificationId;
    }

    public static Calendar setNextWeek (Calendar d) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(d.getTime());
        calendar.add(Calendar.DATE, 7);
        return calendar;
    }



    public static boolean isDateId (String id) {
        return id.contains(postfix);
    }

    public int getCurrentNotificationId () {
        return notificationId;
    }

    public Calendar getCurrentDate () {
        Calendar calendar = Calendar.getInstance();
        return  date;
    }

    public Calendar getDate () {
        return date;
    }

    public long getTime () {
        return date.getTime().getTime();
    }

    public void update (Calendar updated) {
        date = updated;
        return;
    }

    public static AlarmDate fromJson (String json) {
        return new Gson().fromJson(json, AlarmDate.class);
    }

    public static String toJson (AlarmDate d) {
        return new Gson().toJson(d);
    }

    private static int randomId () {
        return (int)(Math.random() * 10000000);
    }
}
