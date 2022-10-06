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
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import {CONSTANTS} from '../../../constants';
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
    const collection = database.collections.get(CONSTANTS.TABLE_NAMES.LABELS);
    return database.collections
      .get(CONSTANTS.TABLE_NAMES.LABELS)
      .prepareCreate(label => {
        label._raw = sanitizedRaw({...raw}, collection.schema);
      });
  };
  static _jsonDataForBackup = raw => {
    return {...raw, _changed: null, _status: null};
  };
}
