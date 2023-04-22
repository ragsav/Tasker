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
export const getLabelByID = async ({id}) => {
  try {
    const label = await database.get('labels').find(id);
    Logger.pageLogger('label.js:getLabelByID:label', {label});
    return label;
  } catch (error) {
    Logger.pageLogger('label.js:getLabelByID:catch', {error});
    return null;
  }
};

export const createLabel =
  ({title, iconString}) =>
  async dispatch => {
    dispatch(createLabelState({loading: true, success: false, error: null}));
    try {
      Logger.pageLogger('label.js:createLabel:start');
      database.write(async () => {
        await database.get('labels').create(label => {
          label.title = title;

          label.iconString = iconString ? iconString : 'label';
        });
      });

      dispatch(createLabelState({loading: false, success: true, error: null}));
      Logger.pageLogger('label.js:createLabel:success');
    } catch (error) {
      Logger.pageLogger('label.js:createLabel:catch', {error});
      dispatch(createLabelState({loading: false, success: true, error}));
    }
  };

export const editLabel =
  ({title, iconString, id}) =>
  async dispatch => {
    dispatch(editLabelState({loading: true, success: false, error: null}));
    try {
      Logger.pageLogger('label.js:editLabel:success');
      const labelToBeUpdated = await database.get('labels').find(id);
      database.write(async () => {
        await labelToBeUpdated.update(label => {
          label.title = title;

          label.iconString = iconString;
        });
      });

      dispatch(editLabelState({loading: false, success: true, error: null}));
      Logger.pageLogger('label.js:editLabel:success');
    } catch (error) {
      Logger.pageLogger('label.js:editLabel:catch', {error});
      dispatch(editLabelState({loading: false, success: true, error}));
    }
  };

export const unGroupLabel =
  ({id}) =>
  async dispatch => {
    dispatch(editLabelState({loading: true, success: false, error: null}));
    try {
      Logger.pageLogger('label.js:unGroupLabel:start');
      const notesToBeDetached = await database
        .get('notes')
        .query(Q.where('label_id', id))
        .fetch();
      const batchUpdateRecords = notesToBeDetached.map(note => {
        return note.prepareUpdate(n => {
          n.labelID = '';
        });
      });
      Logger.pageLogger('label.js:unGroupLabel:batchUpdateRecords', {
        batchUpdateRecords,
      });
      database.write(async () => {
        database.batch(...batchUpdateRecords);
      });

      dispatch(editLabelState({loading: false, success: true, error: null}));
      Logger.pageLogger('label.js:unGroupLabel:success');
    } catch (error) {
      Logger.pageLogger('label.js:unGroupLabel:catch', {error});
      dispatch(editLabelState({loading: false, success: true, error}));
    }
  };

export const deleteLabel =
  ({id}) =>
  async dispatch => {
    dispatch(deleteLabelState({loading: true, success: false, error: null}));
    try {
      Logger.pageLogger('label.js:deleteLabel:start');
      const labelToBeDeleted = await database.get('labels').find(id);
      Logger.pageLogger('label.js:deleteLabel:labelToBeDeleted', {
        labelToBeDeleted,
      });

      const notesToBeDetached = await database
        .get('notes')
        .query(Q.where('label_id', labelToBeDeleted.id))
        .fetch();
      const batchDetachRecords = notesToBeDetached.map(note => {
        return note.prepareUpdate(n => {
          n.labelID = '';
        });
      });
      Logger.pageLogger('label.js:deleteLabel:batchDetachRecords', {
        batchDetachRecords,
      });
      database.write(async () => {
        database.batch(...batchDetachRecords);
      });

      await database.write(async () => {
        await database.batch(...batchDetachRecords);
      });
      await database.write(async () => {
        await labelToBeDeleted.destroyPermanently();
      });

      dispatch(deleteLabelState({loading: false, success: true, error: null}));
      Logger.pageLogger('label.js:deleteLabel:success', labelToBeDeleted);
    } catch (error) {
      Logger.pageLogger('label.js:deleteLabel:catch', {error});
      dispatch(deleteLabelState({loading: false, success: true, error}));
    }
  };
