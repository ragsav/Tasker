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
    return database.collections.get('tasks').prepareCreate(task => {
      task.id = raw.id;
      task.title = raw.title;
      task.description = raw.description;
      task.imageURIs = raw.image_uris;
      task.noteID = raw.note_id;
      task.isBookmarked = raw.is_bookmarked;
      task.isDone = raw.is_done;
      task.doneTimestamp = raw.done_timestamp;
      task.priority = raw.priority;
      task.startTimestamp = raw.start_timestamp;
      task.endTimestamp = raw.end_timestamp;
      task.reminderTimestamp = raw.reminder_timestamp;
      task.reminderID = raw.reminder_id;
      task.isRepeating = raw.is_repeating;
      task.isArchived = raw.is_archived;
      task.archiveTimestamp = raw.archive_timestamp;
      task.isMarkedDeleted = raw.is_marked_deleted;
      task.markedDeletedTimestamp = raw.marked_deleted_timestamp;
      task.repeatCron = raw.repeat_cron;
    });
  };
}
