import PushNotification, {Importance} from 'react-native-push-notification';
import {CONSTANTS} from '../../constants';
import {Logger} from '../utils/logger';

export default class NotificationService {
  static configure() {}
  static createChannel() {
    PushNotification.createChannel(
      {
        channelId: CONSTANTS.NOTIFICATION_CHANNEL_ID,
        channelName: 'Notes channel',
        channelDescription: 'Notes notification channel',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created => {
        if (created) {
          Logger.pageLogger(
            `notifications.js:PushNotification.channelExists:${CONSTANTS.NOTIFICATION_CHANNEL_ID} channel created`,
          );
        } else {
          Logger.pageLogger(
            `notifications.js:PushNotification.channelExists:${CONSTANTS.NOTIFICATION_CHANNEL_ID} already exists`,
          );
        }
      },
    );
  }
  static getAllScheduledNotifications() {
    PushNotification.getScheduledLocalNotifications(notifications => {
      Logger.pageLogger(
        'notifications.js:PushNotification.getScheduledLocalNotifications:notifications',
        {notifications},
      );
    });
  }
  static scheduleTaskReminder({notificationID, title, timestamp}) {
    Logger.pageLogger(
      'notifications.js:PushNotification.scheduleTaskReminder',
      {notificationID, title, timestamp},
    );

    PushNotification.localNotificationSchedule({
      id: `${notificationID}`,
      title: '#Task reminder',
      smallIcon: 'ic_notification',
      largeIcon: '',
      message: title,
      date: new Date(timestamp),
      allowWhileIdle: false,
      channelId: CONSTANTS.NOTIFICATION_CHANNEL_ID,
      playSound: true,
      soundName: 'default',
      vibrate: true,
      vibration: 300,
    });
  }
  static liveNotification({notificationID, description, timestamp}) {
    Logger.pageLogger('notifications.js:PushNotification.liveNotification', {
      notificationID,
      description,
      timestamp,
    });
    PushNotification.localNotification({
      when: new Date(timestamp),
      channelId: CONSTANTS.NOTIFICATION_CHANNEL_ID,
      id: notificationID,
      vibrate: true,
      vibration: 300,
      title: 'Live notification',
      message: description,
      playSound: true,
      soundName: 'default',
    });
  }
  static cancelNotification(notificationID) {
    Logger.pageLogger(
      'notifications.js:PushNotification.cancelNotification:notificationID',
      {
        notificationID,
      },
    );
    PushNotification.cancelLocalNotification(notificationID);
  }
}
