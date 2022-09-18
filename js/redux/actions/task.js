import {database} from '../../db/db';
import {Logger} from '../../utils/logger';
import {Q} from '@nozbe/watermelondb';
import {setEndDate, setStartDate} from './timeFrame';
import {currentEndDate, currentStartDate, getWeek} from '../../utils/dateTime';
import Task from '../../db/models/Task';
import {CONSTANTS} from '../../../constants';
import ReactNativeCalendarEvents from 'react-native-calendar-events';

export const GET_TASKS = 'GET_TASKS';
export const CREATE_TASK_STATE = 'CREATE_TASK_STATE';
export const EDIT_TASK_STATE = 'EDIT_TASK_STATE';
export const DELETE_TASK_STATE = 'DELETE_TASK_STATE';
export const DELETE_MULTIPLE_TASK_STATE = 'DELETE_MULTIPLE_TASK_STATE';

export const getTasksState = ({loading, error, tasks}) => {
  return {
    type: GET_TASKS,
    state: {
      loading,
      tasks,
      error,
    },
  };
};

export const createTaskState = ({loading, success, error}) => {
  return {
    type: CREATE_TASK_STATE,
    state: {loading, success, error},
  };
};
export const resetCreateTaskState = () => {
  return {
    type: CREATE_TASK_STATE,
    state: {loading: false, success: false, error: null},
  };
};

export const editTaskState = ({loading, success, error}) => {
  return {
    type: EDIT_TASK_STATE,
    state: {loading, success, error},
  };
};
export const resetEditTaskState = () => {
  return {
    type: EDIT_TASK_STATE,
    state: {loading: false, success: false, error: null},
  };
};

export const deleteTaskState = ({loading, success, error}) => {
  return {
    type: DELETE_TASK_STATE,
    state: {loading, success, error},
  };
};

export const resetDeleteTaskState = () => {
  return {
    type: DELETE_TASK_STATE,
    state: {loading: false, success: false, error: null},
  };
};

export const deleteMultipleTasksState = ({loading, success, error}) => {
  return {
    type: DELETE_MULTIPLE_TASK_STATE,
    state: {loading, success, error},
  };
};

export const resetDeleteMultipleTasksState = () => {
  return {
    type: DELETE_MULTIPLE_TASK_STATE,
    state: {loading: false, success: false, error: null},
  };
};

export const getTasks = () => async dispatch => {
  dispatch(
    getTasksState({
      loading: true,
      error: null,
      tasks: null,
    }),
  );
  try {
    const tasks = await database.get('tasks').query().fetch();

    dispatch(
      getTasksState({
        loading: false,
        error: null,
        tasks,
      }),
    );
  } catch (error) {
    dispatch(
      getTasksState({
        loading: false,
        tasks: null,
        error,
      }),
    );
  }
};

/**
 *
 * @param {string} id
 * @returns {Promise<Task>}
 */
export const getTaskByID = async id => {
  try {
    const t = await database.get('tasks').find(id);
    return t;
  } catch (error) {
    console.log({error});
    return null;
  }
};

/**
 *
 * @param {string} id
 * @returns {Promise<Array<Task>>}
 */
export const getTaskByQuery = async query => {
  try {
    const t = await database.collections
      .get('tasks')
      .query(Q.where('title', Q.like(`%${Q.sanitizeLikeString(query)}%`)))
      .fetch();
    return t;
  } catch (error) {
    console.log({error});
    return null;
  }
};

export const createTask =
  ({
    title,
    noteID,
    startTimestamp,
    endTimestamp,
    reminderTimestamp,
    isRepeating,
  }) =>
  async dispatch => {
    dispatch(createTaskState({loading: true, success: false, error: null}));
    try {
      database.write(async () => {
        await database.get('tasks').create(task => {
          task.title = title;
          task.noteID = noteID;
          task.isBookmarked = false;
          task.isDone = false;
          task.priority = Date.now();
          task.startTimestamp = startTimestamp;
          task.endTimestamp = endTimestamp;
          task.reminderTimestamp = reminderTimestamp;
          task.isRepeating = isRepeating;
        });
      });

      dispatch(createTaskState({loading: false, success: true, error: null}));
      dispatch(getTasks());
      Logger.pageLogger('createTask : success');
    } catch (error) {
      Logger.pageLogger('createTask : error', error);
      dispatch(createTaskState({loading: false, success: true, error}));
    }
  };

export const editTask =
  ({
    id,
    title,
    noteID,
    priority,
    startTimestamp,
    endTimestamp,
    reminderTimestamp,
    isRepeating,
    isBookmarked,
    isDone,
  }) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.title = title;
          task.noteID = noteID;
          task.isBookmarked = isBookmarked;
          task.isDone = isDone;
          task.priority = priority;
          task.startTimestamp = startTimestamp;
          task.endTimestamp = endTimestamp;
          task.reminderTimestamp = reminderTimestamp;
          task.isRepeating = isRepeating;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };

export const editTaskMarkBulkDone =
  ({ids}) =>
  async dispatch => {
    if (Array.isArray(ids) && ids.length > 0) {
      dispatch(editTaskState({loading: true, success: false, error: null}));
      try {
        const _d = Date.now();
        const tasksToBeMarkedDone = await database
          .get('tasks')
          .query(Q.where('id', Q.oneOf(ids)))
          .fetch();
        const batchUpdateRecords = tasksToBeMarkedDone.map(task => {
          return task.prepareUpdate(t => {
            t.isDone = true;
            task.doneTimestamp = _d;
          });
        });
        database.write(async () => {
          database.batch(...batchUpdateRecords);
        });

        dispatch(editTaskState({loading: false, success: true, error: null}));
        Logger.pageLogger('editTaskMarkBulkDone : success');
      } catch (error) {
        Logger.pageLogger('editTaskMarkBulkDone : error', error);
        dispatch(editTaskState({loading: false, success: true, error}));
      }
    }
  };
export const editTaskTitle =
  ({id, title}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.title = title;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };
export const editTaskDescription =
  ({id, description}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.description = description;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };
export const editTaskPriority =
  ({id, priority}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.priority = priority;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };
export const editTaskIsDone =
  ({id, isDone}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.isDone = isDone;
          if (isDone) {
            task.doneTimestamp = Date.now();
          }
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };
export const editTaskEndTimestamp =
  ({id, endTimestamp}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.endTimestamp = endTimestamp;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };

export const editTaskStartTimestamp =
  ({id, startTimestamp}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.startTimestamp = startTimestamp;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };

export const editTaskReminderTimestamp =
  ({id, reminderTimestamp}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.reminderTimestamp = reminderTimestamp;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };
export const editTaskIsRepeating =
  ({id, isRepeating}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.isRepeating = isRepeating;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };
export const editTaskIsBookmark =
  ({id, isBookmarked}) =>
  async dispatch => {
    dispatch(editTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeUpdated = await database.get('tasks').find(id);
      database.write(async () => {
        await taskToBeUpdated.update(task => {
          task.isBookmarked = isBookmarked;
        });
      });

      dispatch(editTaskState({loading: false, success: true, error: null}));

      dispatch(getTasks());
      Logger.pageLogger('editTask : success', taskToBeUpdated);
    } catch (error) {
      Logger.pageLogger('editTask : error', error);
      dispatch(editTaskState({loading: false, success: true, error}));
    }
  };
// export const editTaskReorder = () =>{
//   database
// }
export const deleteTask =
  ({id}) =>
  async dispatch => {
    dispatch(deleteTaskState({loading: true, success: false, error: null}));
    try {
      const taskToBeDeleted = await database.get('tasks').find(id);
      await database.write(async () => {
        await taskToBeDeleted.destroyPermanently();
      });

      dispatch(deleteTaskState({loading: false, success: true, error: null}));
      dispatch(getTasks());
      Logger.pageLogger('deleteTask : success', taskToBeDeleted);
    } catch (error) {
      Logger.pageLogger('deleteTask : error', error);
      dispatch(deleteTaskState({loading: false, success: true, error}));
    }
  };

export const deleteMultipleTasks =
  ({ids}) =>
  async dispatch => {
    dispatch(
      deleteMultipleTasksState({
        loading: true,
        success: false,
        error: null,
      }),
    );
    try {
      const tasksToBeDeleted = await database
        .get('tasks')
        .query(Q.where('id', Q.oneOf(ids)))
        .fetch();

      const deletedTasks = tasksToBeDeleted.map(task =>
        task.prepareDestroyPermanently(),
      );

      await database.write(async () => {
        await database.batch(...deletedTasks);
      });

      dispatch(
        deleteMultipleTasksState({
          loading: false,
          success: true,
          error: null,
        }),
      );
      dispatch(getTasks());
      Logger.pageLogger('deleteTask : success', tasksToBeDeleted);
    } catch (error) {
      Logger.pageLogger('deleteTask : error', error);
      dispatch(
        deleteMultipleTasksState({loading: false, success: true, error}),
      );
    }
  };

export const addTaskToCalendar = async ({calendarID, taskID}) => {
  const task = await database.collections.get('tasks').find(taskID);
  const startDate = new Date(task.createdAt).toISOString();
  const endDate = new Date(task.end_timestamp).toISOString();
  console.log({startDate, endDate});
  // return ReactNativeCalendarEvents.saveEvent(task.title, {
  //   calendarId: calendarID,
  //   startDate,
  //   endDate,
  // });
};
