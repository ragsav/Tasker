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
export default class Task extends Model {
  static table = 'tasks';
  static associations = {
    notes: {type: 'belongs_to', key: 'note_id'},
  };

  @text('title') title;
  @text('note_id') noteID;
  @field('is_bookmarked') isBookmarked;
  @field('is_done') isDone;

  @field('priority') priority;
  @date('start_timestamp') startTimestamp;
  @date('end_timestamp') endTimestamp;
  @date('reminder_timestamp') reminderTimestamp;
  @field('is_repeating') isRepeating;

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @relation('notes', 'note_id') notes;
}
