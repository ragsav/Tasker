import {
  CREATE_NOTE_STATE,
  EDIT_NOTE_STATE,
  DELETE_NOTE_STATE,
} from '../actions';

export default (
  state = {
    isCreatingNote: false,
    createNoteSuccess: false,
    createNoteFailure: null,

    isUpdatingNote: false,
    editNoteSuccess: false,
    editNoteFailure: null,

    isDeletingNote: false,
    deleteNoteSuccess: false,
    deleteNoteFailure: null,
  },
  action,
) => {
  switch (action.type) {
    case CREATE_NOTE_STATE:
      return {
        ...state,
        isCreatingNote: action.state.loading,
        createNoteSuccess: action.state.success,
        createNoteFailure: action.state.error,
      };

    case EDIT_NOTE_STATE:
      return {
        ...state,
        isUpdatingNote: action.state.loading,
        editNoteSuccess: action.state.success,
        editNoteFailure: action.state.error,
      };

    case DELETE_NOTE_STATE:
      return {
        ...state,
        isDeletingNote: action.state.loading,
        deleteNoteSuccess: action.state.success,
        deleteNoteFailure: action.state.error,
      };
    default:
      return state;
  }
};
