import {Model} from '@nozbe/watermelondb';
import {
  field,
  text,
  relation,
  children,
  writer,
  date,
  readonly,
} from '@nozbe/watermelondb/decorators';
import {database} from '../db';

export default class Label extends Model {
  static table = 'labels';

  static associations = {
    notes: {type: 'has_many', foreignKey: 'label_id'},
  };

  @text('title') title;
  @text('icon_string') iconString;
  @field('is_archived') isArchived;
  @date('archive_timestamp') archiveTimestamp;
  @field('is_marked_deleted') isMarkedDeleted;
  @date('marked_deleted_timestamp') markedDeletedTimestamp;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @children('notes') notes;

  static _backupToPrepareCreate = raw => {
    return database.collections.get('notes').prepareCreate(label => {
      label.id = raw.id;
      label.title = raw.title;
      label.iconString = raw.icon_string;
      label.isArchived = raw.is_archived;
      label.archiveTimestamp = raw.archive_timestamp;
      label.isMarkedDeleted = raw.is_marked_deleted;
      label.markedDeletedTimestamp = raw.marked_deleted_timestamp;
    });
  };
}
