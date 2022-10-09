export const CONSTANTS = Object.freeze({
  NOTIFICATION_CHANNEL_ID:
    'Tasker-Notifications-dc5ee189-65a6-48a7-9ae6-b0ec9d067825',

  DAILY_REMINDER_ID: 1023,
  NOTIFICATION_CLEAR_DELAY_BUFFER: 1 * 60 * 1000,

  TABLE_NAMES: {
    LABELS: 'labels',
    NOTES: 'notes',
    TASKS: 'tasks',
  },
  ROUTES: {
    HOME: 'HOME',
    INTRO: 'INTRO',
    PINNED_NOTES: 'PINNED_NOTES',
    BOOKMARKS: 'BOOKMARKS',
    ADD_LABEL: 'ADD_LABEL',
    EDIT_LABEL: 'EDIT_LABEL',

    ADD_NOTE: 'ADD_NOTE',
    EDIT_NOTE: 'EDIT_NOTE',

    TASK: 'TASK',
    ARCHIVED_TASKS: 'ARCHIVED_TASKS',
    ARCHIVED_NOTES: 'ARCHIVED_NOTES',
    DELETED_TASKS: 'DELETED_TASKS',

    NOTE: 'NOTE',
    BACKUP: 'BACKUP',
    FILTER: 'FILTER',
    MY_DAY: 'MY_DAY',
    CALENDAR: 'CALENDAR',
    SEARCH: 'SEARCH',
    SETTINGS: 'SETTINGS',
    COMPLETED: 'COMPLETED',
    ALL: 'ALL',
  },
  TASK_SORT: {
    TITLE: {text: 'Title', code: 'title'},
    START_DATE: {text: 'Start time', code: 'start_timestamp'},
    DUE_DATE: {text: 'Due date', code: 'end_timestamp'},
    MARK_DONE: {text: 'Marked done on', code: 'done_timestamp'},
    UPDATE_AT: {text: 'Updated on', code: 'updated_at'},
    CREATED_AT: {text: 'Created on', code: 'created_at'},
  },
  TASK_SORT_ORDER: {
    ASC: {
      text: 'Ascensing',
      code: 'asc',
    },
    DESC: {
      text: 'Descending',
      code: 'desc',
    },
  },
  TASK_FILTER: {
    BOOKMARKS: {
      text: 'Bookmarks',
      field: 'is_bookmarked',
    },
    DONE: {
      text: 'Done',
      field: 'is_done',
    },
  },

  NOTE_COLORS: [
    '#e6194b',
    '#3cb44b',
    '#998608',
    '#4363d8',
    '#c15d16',
    '#911eb4',
    '#0d7676',
    '#a72ea1',
    '#607030',
    '#5e3030',
    '#008080',
    '#3e1c54',
    '#9a6324',
    '#5d5b47',
    '#800000',
    '#224e30',
    '#808000',
    '#846749',
    '#000075',
    '#808080',
    '#000000',
  ],
  LOCAL_STORAGE_KEYS: {
    LAST_BACKUP_TIMESTAMP: 'LAST_BACKUP_TIMESTAMP',
    LAST_RESTORE_TIMESTAMP: 'LAST_RESTORE_TIMESTAMP',
    LOCAL_THEME: 'LOCAL_THEME',
    QUICK_LIST_SETTING: 'QUICK_LIST_SETTING',
    RENDER_URL_IN_TASK_SETTING: 'RENDER_URL_IN_TASK_SETTING',
    DAILY_REMINDER_TIMESTAMP: 'DAILY_REMINDER_TIMESTAMP',
    TASK_SORT_ORDER: 'TASK_SORT_ORDER',
    TASK_SORT_PROPERTY: 'TASK_SORT_PROPERTY',
  },
});
