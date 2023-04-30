import {useReducer, useCallback} from 'react';

const ActionType = {
  Undo: 'UNDO',
  Redo: 'REDO',
  Set: 'SET',
  Reset: 'RESET',
};

const initialState = {
  past: [],
  present: null,
  future: [],
};

export const useUndo = (initialPresent, opts = {}) => {
  const {useCheckpoints} = {
    useCheckpoints: false,
    ...opts,
  };

  const reducer = (state, action) => {
    const {past, present, future} = state;

    switch (action.type) {
      case ActionType.Undo: {
        if (past.length === 0) {
          return state;
        }

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      }

      case ActionType.Redo: {
        if (future.length === 0) {
          return state;
        }
        const next = future[0];
        const newFuture = future.slice(1);

        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      }

      case ActionType.Set: {
        const isNewCheckpoint = useCheckpoints
          ? !!action.historyCheckpoint
          : true;
        const {newPresent} = action;

        if (newPresent === present) {
          return state;
        }

        return {
          past: isNewCheckpoint === false ? past : [...past, present],
          present: newPresent,
          future: [],
        };
      }

      case ActionType.Reset: {
        const {newPresent} = action;

        return {
          past: [],
          present: newPresent,
          future: [],
        };
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;
  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({type: ActionType.Undo});
    }
  }, [canUndo]);
  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({type: ActionType.Redo});
    }
  }, [canRedo]);
  const set = useCallback((newPresent, checkpoint = false) => {
    dispatch({
      type: ActionType.Set,
      newPresent,
      historyCheckpoint: checkpoint,
    });
  }, []);
  const reset = useCallback(
    newPresent => dispatch({type: ActionType.Reset, newPresent}),
    [],
  );

  return [state, {set, reset, undo, redo, canUndo, canRedo}];
};
