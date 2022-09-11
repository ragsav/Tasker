import {
  CREATE_LABEL_STATE,
  EDIT_LABEL_STATE,
  DELETE_LABEL_STATE,
} from '../actions';

export default (
  state = {
    isCreatingLabel: false,
    createLabelSuccess: false,
    createLabelFailure: null,

    isUpdatingLabel: false,
    editLabelSuccess: false,
    editLabelFailure: null,

    isDeletingLabel: false,
    deleteLabelSuccess: false,
    deleteLabelFailure: null,
  },
  action,
) => {
  switch (action.type) {
    case CREATE_LABEL_STATE:
      return {
        ...state,
        isCreatingLabel: action.state.loading,
        createLabelSuccess: action.state.success,
        createLabelFailure: action.state.error,
      };

    case EDIT_LABEL_STATE:
      return {
        ...state,
        isUpdatingLabel: action.state.loading,
        editLabelSuccess: action.state.success,
        editLabelFailure: action.state.error,
      };

    case DELETE_LABEL_STATE:
      return {
        ...state,
        isDeletingLabel: action.state.loading,
        deleteLabelSuccess: action.state.success,
        deleteLabelFailure: action.state.error,
      };
    default:
      return state;
  }
};
