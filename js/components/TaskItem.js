import Task from '../db/models/Task';
import React from 'react';
import {Card, IconButton} from 'react-native-paper';
import withObservables from '@nozbe/with-observables';
/**
 *
 * @param {object} param0
 * @param {Task} param0.task
 * @returns
 */
const TaskItem = ({
  task,
  handleMarkIsDone,
  handleBookmark,
  onLongPress,
  isActive,
}) => {
  return (
    <Card
      elevation={2}
      style={{marginBottom: 6}}
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
            onPress={() =>
              handleMarkIsDone({id: task.id, isDone: !task.isDone})
            }
          />
        )}
        right={props => (
          <IconButton
            icon={task.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            onPress={() =>
              handleBookmark({id: task.id, isBookmarked: !task.isBookmarked})
            }
          />
        )}
      />
    </Card>
  );
};

const enhanceTask = withObservables(['task'], ({task}) => ({
  task,
}));
export default enhanceTask(TaskItem);
