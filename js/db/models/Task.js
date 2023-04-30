import {Model, Q} from '@nozbe/watermelondb';
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
import {getHash} from '../../utils/encryption';
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
  @field('is_pinned') isPinned;
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

  @reader async password() {
    const fetchedNote = await this.note.fetch();
    return fetchedNote.passwordHash;
  }

  @reader async checkPassword({password}) {
    try {
      const fetchedNote = await this.note.fetch();
      const fetchedPasswordHash = fetchedNote.passwordHash;
      if (String(fetchedPasswordHash) === '' || !Boolean(fetchedPasswordHash)) {
        return true;
      } else {
        const generatedHash = await getHash({text: password});
        return generatedHash === fetchedPasswordHash;
      }
    } catch (error) {
      console.log({error});
    }
  }

  static _backupToPrepareCreate = raw => {
    const collection = database.collections.get(CONSTANTS.TABLE_NAMES.TASKS);
    return database.collections.get('tasks').prepareCreate(task => {
      task._raw = sanitizedRaw({...raw}, collection.schema);
    });
  };
  static _jsonDataForBackup = raw => {
    return {...raw, _changed: null, _status: null};
  };
  static archived = () => {
    return Q.on('notes', Q.where('is_archived', Q.eq(true)));
  };
  static unarchived = () => {
    return Q.on(
      'notes',
      Q.or(
        Q.where('is_archived', Q.eq(undefined)),
        Q.where('is_archived', Q.eq(null)),
        Q.where('is_archived', Q.eq(false)),
      ),
    );
  };

  static sortQuery = (taskSortProperty, taskSortOrder) => {
    return Q.sortBy(
      !taskSortProperty ||
        String(taskSortProperty).trim() === '' ||
        taskSortProperty === undefined
        ? CONSTANTS.TASK_SORT.CREATED_AT.code
        : String(taskSortProperty).trim(),
      !taskSortOrder ||
        taskSortOrder === undefined ||
        String(taskSortOrder) === Q.asc ||
        String(taskSortOrder) === Q.desc
        ? taskSortOrder
        : Q.asc,
    );
  };
}
