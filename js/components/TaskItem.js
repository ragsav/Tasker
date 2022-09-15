import Task from '../db/models/Task';
import React from 'react';
import {Card, IconButton, Paragraph} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import withObservables from '@nozbe/with-observables';
import moment from 'moment';
import {connect} from 'react-redux';
import {editTaskIsBookmark, editTaskIsDone} from '../redux/actions';
import {useNavigation} from '@react-navigation/native';
import {CONSTANTS} from '../../constants';
/**
 *
 * @param {object} param0
 * @param {Task} param0.task
 * @returns
 */
const TaskItem = ({task, onLongPress, noteColor, isActive, dispatch}) => {
  // ref

  // variables
  const navigation = useNavigation();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions
  const _handleMarkIsDone = () => {
    dispatch(editTaskIsDone({id: task.id, isDone: !task.isDone}));
  };
  const _handleBookmark = () => {
    dispatch(
      editTaskIsBookmark({id: task.id, isBookmarked: !task.isBookmarked}),
    );
  };

  // navigation functions
  const _navigateToTaskScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.TASK, {
      p_id: task.id,
    });
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {};

  // return

  return (
    <Card
      elevation={2}
      style={{marginBottom: 6}}
      onPress={_navigateToTaskScreen}
      onLongPress={() => {
        console.log('long pressed');
        onLongPress();
      }}>
      <Card.Title
        title={task.title}
        titleStyle={task.isDone ? {textDecorationLine: 'line-through'} : null}
        left={props => (
          <IconButton
            icon={task.isDone ? 'radiobox-marked' : 'radiobox-blank'}
            onPress={_handleMarkIsDone}
          />
        )}
        right={props => (
          <IconButton
            icon={task.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            onPress={_handleBookmark}
          />
        )}
      />
      {task.isDone && (
        <Card.Content>
          <Paragraph>{`Marked done ${moment(task.doneTimestamp)
            .calendar()
            .toLowerCase()}`}</Paragraph>
        </Card.Content>
      )}
    </Card>
  );
};

const enhanceTask = withObservables(['task'], ({task}) => ({
  task,
}));

const mapStateToProps = state => {
  return {
    isDeletingNote: state.note.isDeletingNote,
    deleteNoteSuccess: state.note.deleteNoteSuccess,
    deleteNoteFailure: state.note.deleteNoteFailure,
  };
};

const EnhancedTaskItem = enhanceTask(TaskItem);
export default connect(mapStateToProps)(EnhancedTaskItem);
