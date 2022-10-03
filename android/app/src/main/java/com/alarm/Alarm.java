package com.alarm;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Calendar;


public class Alarm implements Cloneable {

    String uid;
    int year;
    int month;
    int date;
    int hour;
    int minutes;
    String title;
    String description;

    Alarm(String uid, int year,
          int month,
          int date,
          int hour,
          int minutes, String title, String description) {
        this.uid = uid;
        this.year = year;
        this.month = month;
        this.date = date;
        this.hour = hour;
        this.minutes = minutes;
        this.title = title;
        this.description = description;

    }

    static Alarm fromJson(String json) {
        return new Gson().fromJson(json, Alarm.class);
    }

    static String toJson(Alarm alarm) {
        return new Gson().toJson(alarm);
    }

    Calendar getDate() {
        Calendar _d = Helper.getDate(year, month, date, hour, minutes);
        return _d;
    }

    AlarmDate getAlarmDate() {
        return new AlarmDate(uid, getDate());
    }

    public Alarm clone() throws CloneNotSupportedException {
        return (Alarm) super.clone();
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Alarm)) return false;
        Alarm alarm = (Alarm) o;
        return (
                this.year == alarm.year && this.month == alarm.month && this.date == alarm.date &&
                        this.hour == alarm.hour &&
                        this.minutes == alarm.minutes &&

                        this.uid.equals(alarm.uid) &&

                        this.title.equals(alarm.title) &&
                        this.description.equals(alarm.description)
        );
    }
}
