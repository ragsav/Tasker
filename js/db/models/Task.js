import {Model} from '@nozbe/watermelondb';
import {
  field,
  text,
  relation,
  children,
  writer,
  date,
  readonly,
  reader,
  lazy,
} from '@nozbe/watermelondb/decorators';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import {CONSTANTS} from '../../../constants';
import {database} from '../db';
export default class Task extends Model {
  static table = 'tasks';
  static associations = {
    notes: {type: 'belongs_to', key: 'note_id'},
  };

  @text('title') title;
  @text('description') description;
  @text('image_uris') imageURIs;
  @text('note_id') noteID;
  @field('is_bookmarked') isBookmarked;
  @field('is_done') isDone;
  @date('done_timestamp') doneTimestamp;

  @field('priority') priority;
  @date('start_timestamp') startTimestamp;
  @date('end_timestamp') endTimestamp;
  @date('reminder_timestamp') reminderTimestamp;
  @text('reminder_id') reminderID;
  @field('is_repeating') isRepeating;
  @field('is_archived') isArchived;
  @date('archive_timestamp') archiveTimestamp;
  @field('is_marked_deleted') isMarkedDeleted;
  @date('marked_deleted_timestamp') markedDeletedTimestamp;

  @text('repeat_cron') repeatCron;

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @relation('notes', 'note_id') note;

  static _backupToPrepareCreate = raw => {
    const collection = database.collections.get(CONSTANTS.TABLE_NAMES.TASKS);
    return database.collections.get('tasks').prepareCreate(task => {
      task._raw = sanitizedRaw({...raw}, collection.schema);
    });
  };
  static _jsonDataForBackup = raw => {
    return {...raw, _changed: null, _status: null};
  };
}
