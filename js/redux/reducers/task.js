import {
  GET_TASKS,
  CREATE_TASK_STATE,
  EDIT_TASK_STATE,
  DELETE_TASK_STATE,
  DELETE_MULTIPLE_TASK_STATE,
} from '../actions';

export default (
  state = {
    isGettingTasks: false,
    getTasksFailure: null,
    tasks: null,

    isCreatingTask: false,
    createTaskSuccess: false,
    createTaskFailure: null,

    isUpdatingTask: false,
    editTaskSuccess: false,
    editTaskFailure: null,

    isDeletingTask: false,
    deleteTaskSuccess: false,
    deleteTaskFailure: null,

    isDeletingMultipleTasks: false,
    deleteMultipleTasksSuccess: false,
    deleteMultipleTasksFailure: null,
  },
  action,
) => {
  switch (action.type) {
    case GET_TASKS:
      return {
        ...state,
        isGettingTasks: action.state.loading,
        tasks: action.state.tasks ?? state.tasks,

        getTasksFailure: action.state.error,
      };
    case CREATE_TASK_STATE:
      return {
        ...state,
        isCreatingTask: action.state.loading,
        createTaskSuccess: action.state.success,
        createTaskFailure: action.state.error,
      };

    case EDIT_TASK_STATE:
      return {
        ...state,
        isUpdatingTask: action.state.loading,
        editTaskSuccess: action.state.success,
        editTaskFailure: action.state.error,
      };

    case DELETE_TASK_STATE:
      return {
        ...state,
        isDeletingTask: action.state.loading,
        deleteTaskSuccess: action.state.success,
        deleteTaskFailure: action.state.error,
      };
    case DELETE_MULTIPLE_TASK_STATE:
      return {
        ...state,
        isDeletingMultipleTasks: action.state.loading,
        deleteMultipleTasksSuccess: action.state.success,
        deleteMultipleTasksFailure: action.state.error,
      };
    default:
      return state;
  }
};
