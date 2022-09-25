import {Q} from '@nozbe/watermelondb';
import {database} from '../../db/db';
import Note from '../../db/models/Note';
import {Logger} from '../../utils/logger';
export const CREATE_NOTE_STATE = 'CREATE_NOTE_STATE';
export const EDIT_NOTE_STATE = 'EDIT_NOTE_STATE';
export const DELETE_NOTE_STATE = 'DELETE_NOTE_STATE';

export const createNoteState = ({loading, success, error}) => {
  return {
    type: CREATE_NOTE_STATE,
    state: {loading, success, error},
  };
};

export const resetCreateNoteState = () => {
  return {
    type: CREATE_NOTE_STATE,
    state: {loading: false, success: false, error: null},
  };
};

export const editNoteState = ({loading, success, error}) => {
  return {
    type: EDIT_NOTE_STATE,
    state: {loading, success, error},
  };
};

export const resetEditNoteState = () => {
  return {
    type: EDIT_NOTE_STATE,
    state: {loading: false, success: false, error: null},
  };
};
export const deleteNoteState = ({loading, success, error}) => {
  return {
    type: DELETE_NOTE_STATE,
    state: {loading, success, error},
  };
};
export const resetDeleteNoteState = () => {
  return {
    type: DELETE_NOTE_STATE,
    state: {loading: false, success: false, error: null},
  };
};

/**
 *
 * @param {string} id
 * @returns {Promise<Note>}
 */
export const getNoteByID = async id => {
  try {
    const note = await database.get('notes').find(id);
    Logger.pageLogger('note.js:getNoteByID:note', {note});
    return note;
  } catch (error) {
    Logger.pageLogger('note.js:getNoteByID:catch', {error});
    return null;
  }
};

export const createNote =
  ({title, colorString, labelID}) =>
  async dispatch => {
    dispatch(
      createNoteState({
        loading: true,
        success: false,
        error: null,
      }),
    );
    try {
      Logger.pageLogger('note.js:createNoteState:start');
      await database.write(async () => {
        await database.get('notes').create(note => {
          note.title = title;
          note.colorString = colorString;
          note.labelID = labelID;
        });
      });

      dispatch(
        createNoteState({
          loading: false,
          success: true,
          error: null,
        }),
      );
      Logger.pageLogger('note.js:createNoteState:success');
    } catch (error) {
      Logger.pageLogger('note.js:createNote:catch', {error});
      dispatch(createNoteState({loading: false, success: true, error}));
    }
  };

export const editNote =
  ({id, title, colorString, labelID}) =>
  async dispatch => {
    dispatch(
      editNoteState({
        loading: true,
        success: false,
        error: null,
      }),
    );
    try {
      Logger.pageLogger('note.js:editNote:start');
      const noteToBeUpdated = await database.get('notes').find(id);
      database.write(async () => {
        await noteToBeUpdated.update(note => {
          note.title = title;
          note.colorString = colorString;
          note.labelID = labelID;
        });
      });

      dispatch(
        editNoteState({
          loading: false,
          success: true,
          error: null,
        }),
      );
      Logger.pageLogger('note.js:editNote:success');
    } catch (error) {
      Logger.pageLogger('note.js:editNote:catch', {error});
      dispatch(editNoteState({loading: false, success: true, error}));
    }
  };

export const duplicateNote =
  ({id}) =>
  async dispatch => {
    dispatch(createNoteState({loading: true, success: false, error: null}));
    try {
      Logger.pageLogger('note.js:duplicateNote:start');
      const noteToBeDuplicated = await database.get('notes').find(id);
      const dNote = await database.write(async () => {
        return await database.get('notes').create(note => {
          note.title = `${noteToBeDuplicated.title}-copy`;
          note.colorString = noteToBeDuplicated.colorString;
          note.labelID = noteToBeDuplicated.labelID;
        });
      });
      Logger.pageLogger('note.js:duplicateNote:dNote', {dNote});
      const tasksToBeDuplicated = await database
        .get('tasks')
        .query(Q.where('note_id', id))
        .fetch();
      Logger.pageLogger('note.js:duplicateNote:tasksToBeDuplicated', {
        tasksToBeDuplicated,
      });

      const batchTaskCreateRecords = tasksToBeDuplicated.map(dTask => {
        return database.get('tasks').prepareCreate(task => {
          task.title = dTask.title;
          task.description = dTask.description;
          task.noteID = dNote.id;
          task.isBookmarked = dTask.isBookmarked;
          task.isDone = dTask.isDone;
          task.priority = dTask.priority;
          task.startTimestamp = dTask.startTimestamp;
          task.endTimestamp = dTask.endTimestamp;
          task.reminderTimestamp = dTask.reminderTimestamp;
          task.isRepeating = dTask.isRepeating;
          task.doneTimestamp = dTask.doneTimestamp;
        });
      });
      database.write(async () => {
        database.batch(...batchTaskCreateRecords);
      });

      dispatch(createNoteState({loading: false, success: true, error: null}));
      Logger.pageLogger('note.js:duplicateNote:success');
    } catch (error) {
      Logger.pageLogger('note.js:duplicateNote:catch', {error});
      dispatch(createNoteState({loading: false, success: true, error}));
    }
  };
export const deleteNote =
  ({id}) =>
  async dispatch => {
    dispatch(
      deleteNoteState({
        loading: true,
        success: false,
        error: null,
      }),
    );
    try {
      Logger.pageLogger('note.js:deleteNote:success');
      const noteToBeDeleted = await database.get('notes').find(id);
      Logger.pageLogger('note.js:deleteNote:noteToBeDeleted', {
        noteToBeDeleted,
      });

      const tasksToBeDeleted = await database
        .get('tasks')
        .query(Q.where('note_id', noteToBeDeleted.id))
        .fetch();
      Logger.pageLogger('note.js:deleteNote:tasksToBeDeleted', {
        tasksToBeDeleted,
      });

      const deletedTasks = tasksToBeDeleted.map(task =>
        task.prepareDestroyPermanently(),
      );

      await database.write(async () => {
        await database.batch(...deletedTasks);
        await noteToBeDeleted.destroyPermanently();
      });

      dispatch(
        deleteNoteState({
          loading: false,
          success: true,
          error: null,
        }),
      );
      Logger.pageLogger('note.js:deleteNote:success');
    } catch (error) {
      Logger.pageLogger('note.js:deleteNote:catch', {error});
      dispatch(deleteNoteState({loading: false, success: true, error}));
    }
  };
