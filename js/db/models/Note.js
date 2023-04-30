import {Model, Q} from '@nozbe/watermelondb';
import {
  field,
  text,
  relation,
  children,
  writer,
  date,
  readonly,
  lazy,
  reader,
} from '@nozbe/watermelondb/decorators';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import {CONSTANTS} from '../../../constants';
import {database} from '../db';
import {getHash} from '../../utils/encryption';
export default class Note extends Model {
  static table = 'notes';
  static associations = {
    tasks: {type: 'has_many', foreignKey: 'note_id'},
    labels: {type: 'belongs_to', key: 'label_id'},
  };

  @text('title') title;
  @text('description') description;
  @text('password_hash') passwordHash;
  @text('color_string')
  colorString;
  @text('label_id') labelID;
  @field('is_archived') isArchived;
  @field('is_pinned') isPinned;
  @date('archive_timestamp') archiveTimestamp;
  @field('is_marked_deleted') isMarkedDeleted;
  @date('marked_deleted_timestamp') markedDeletedTimestamp;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @children('tasks') tasks;

  @reader async checkPassword({password}) {
    try {
      const generatedHash = await getHash({text: password});
      if (String(this.passwordHash) === '' || !Boolean(this.passwordHash)) {
        return true;
      }
      return generatedHash === this.passwordHash;
    } catch (error) {
      console.log({error});
    }
  }

  static _backupToPrepareCreate = raw => {
    const collection = database.collections.get(CONSTANTS.TABLE_NAMES.NOTES);
    return database.collections
      .get(CONSTANTS.TABLE_NAMES.NOTES)
      .prepareCreate(note => {
        note._raw = sanitizedRaw({...raw}, collection.schema);
      });
  };
  static _jsonDataForBackup = raw => {
    return {...raw, _changed: null, _status: null};
  };

  static noteSortQuery = (noteSortProperty, noteSortOrder) => {
    return Q.sortBy(
      !noteSortProperty ||
        String(noteSortProperty).trim() === '' ||
        noteSortProperty === undefined
        ? CONSTANTS.NOTE_SORT.CREATED_AT.code
        : String(noteSortProperty).trim(),
      !noteSortOrder ||
        noteSortOrder === undefined ||
        String(noteSortOrder) === Q.asc ||
        String(noteSortOrder) === Q.desc
        ? noteSortOrder
        : Q.asc,
    );
  };
}
