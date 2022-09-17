import {database} from '../../db/db';
import Label from '../../db/models/Label';
import {Logger} from '../../utils/logger';
import {Q} from '@nozbe/watermelondb';
export const CREATE_LABEL_STATE = 'CREATE_LABEL_STATE';
export const EDIT_LABEL_STATE = 'EDIT_LABEL_STATE';
export const DELETE_LABEL_STATE = 'DELETE_LABEL_STATE';

export const createLabelState = ({loading, success, error}) => {
  return {
    type: CREATE_LABEL_STATE,
    state: {loading, success, error},
  };
};

export const resetCreateLabelState = () => {
  return {
    type: CREATE_LABEL_STATE,
    state: {loading: false, success: false, error: null},
  };
};

export const editLabelState = ({loading, success, error}) => {
  return {
    type: EDIT_LABEL_STATE,
    state: {loading, success, error},
  };
};
export const resetEditLabelState = () => {
  return {
    type: EDIT_LABEL_STATE,
    state: {loading: false, success: false, error: null},
  };
};
export const deleteLabelState = ({loading, success, error}) => {
  return {
    type: DELETE_LABEL_STATE,
    state: {loading, success, error},
  };
};

export const resetDeleteLabelState = () => {
  return {
    type: DELETE_LABEL_STATE,
    state: {loading: false, success: false, error: null},
  };
};

/**
 *
 * @param {string} id
 * @returns {Promise<Label>}
 */
export const getLabelByID = async id => {
  try {
    const a = await database.get('labels').find(id);
    return a;
  } catch (error) {
    console.log({error});
    return null;
  }
};

export const createLabel =
  ({title, iconString}) =>
  async dispatch => {
    dispatch(createLabelState({loading: true, success: false, error: null}));
    try {
      database.write(async () => {
        await database.get('labels').create(label => {
          label.title = title;

          label.iconString = iconString ? iconString : 'label';
        });
      });

      dispatch(createLabelState({loading: false, success: true, error: null}));
      Logger.pageLogger('createLabel : success');
    } catch (error) {
      Logger.pageLogger('createLabel : error', error);
      dispatch(createLabelState({loading: false, success: true, error}));
    }
  };

export const editLabel =
  ({title, iconString, id}) =>
  async dispatch => {
    dispatch(editLabelState({loading: true, success: false, error: null}));
    try {
      const labelToBeUpdated = await database.get('labels').find(id);
      database.write(async () => {
        await labelToBeUpdated.update(label => {
          label.title = title;

          label.iconString = iconString;
        });
      });

      dispatch(editLabelState({loading: false, success: true, error: null}));
      Logger.pageLogger('editLabel : success');
    } catch (error) {
      Logger.pageLogger('editLabel : error', error);
      dispatch(editLabelState({loading: false, success: true, error}));
    }
  };
export const unGroupLabel =
  ({id}) =>
  async dispatch => {
    dispatch(editLabelState({loading: true, success: false, error: null}));
    try {
      const notesToBeDetached = await database
        .get('notes')
        .query(Q.where('label_id', id))
        .fetch();
      const batchUpdateRecords = notesToBeDetached.map(note => {
        return note.prepareUpdate(n => {
          n.labelID = '';
        });
      });
      database.write(async () => {
        database.batch(...batchUpdateRecords);
      });

      dispatch(editLabelState({loading: false, success: true, error: null}));
      Logger.pageLogger('unGroupLabel : success');
    } catch (error) {
      Logger.pageLogger('unGroupLabel : error', error);
      dispatch(editLabelState({loading: false, success: true, error}));
    }
  };

export const deleteLabel =
  ({id}) =>
  async dispatch => {
    dispatch(deleteLabelState({loading: true, success: false, error: null}));
    try {
      const labelToBeDeleted = await database.get('labels').find(id);
      const notesToBeDeleted = await database
        .get('notes')
        .query(Q.where('label_id', labelToBeDeleted.id))
        .fetch();
      const notesIDs = notesToBeDeleted.map(note => note.id);
      const tasksToBeDeleted = await database
        .get('tasks')
        .query(Q.where('note_id', Q.oneOf(notesIDs)))
        .fetch();

      const deletedTasks = tasksToBeDeleted.map(task =>
        task.prepareDestroyPermanently(),
      );
      const deletedNotes = notesToBeDeleted.map(task =>
        task.prepareDestroyPermanently(),
      );

      await database.write(async () => {
        await database.batch(...deletedTasks, ...deletedNotes);
        await labelToBeDeleted.destroyPermanently();
      });

      dispatch(deleteLabelState({loading: false, success: true, error: null}));
      Logger.pageLogger('deleteLabel : success', labelToBeDeleted);
    } catch (error) {
      Logger.pageLogger('deleteLabel : error', error);
      dispatch(deleteLabelState({loading: false, success: true, error}));
    }
  };
