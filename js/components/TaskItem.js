import withObservables from '@nozbe/with-observables';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {View} from 'react-native';
import {
  IconButton,
  Paragraph,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import Task from '../db/models/Task';
import {
  editTaskIsArchived,
  editTaskIsBookmark,
  editTaskIsDone,
  restoreTask,
} from '../redux/actions';
import {Logger} from '../utils/logger';
/**
 *
 * @param {object} param0
 * @param {Task} param0.task
 * @returns
 */
const TaskItem = ({task, onLongPress, noteColor, isActive, dispatch, note}) => {
  // ref

  // variables
  const navigation = useNavigation();
  const theme = useTheme();

  // states

  // effects

  // callbacks

  // render functions
  const _renderArchiveTime = () => {
    return task.isArchived ? (
      <Paragraph
        style={{
          fontWeight: '400',
          color: theme.colors.onSurface,
          fontSize: 12,
          flexWrap: 'wrap',
          flex: 1,
          paddingHorizontal: 12,
        }}
        numberOfLines={2}
        ellipsizeMode="tail">{`Archived ${moment(task.archiveTimestamp)
        .calendar()
        .toLowerCase()}`}</Paragraph>
    ) : null;
  };
  const _renderDeletionTime = () => {
    return task.isMarkedDeleted ? (
      <Paragraph
        style={{
          fontWeight: '400',
          color: theme.colors.onSurface,
          fontSize: 12,
          flexWrap: 'wrap',
          flex: 1,
          paddingHorizontal: 12,
        }}
        numberOfLines={2}
        ellipsizeMode="tail">{`Deleted ${moment(task.markedDeletedTimestamp)
        .calendar()
        .toLowerCase()}`}</Paragraph>
    ) : null;
  };

  const _renderNoteDetails = render => {
    return render ? (
      <Paragraph
        style={{
          fontWeight: '600',
          color: theme.colors.onSurface,
          fontSize: 14,
          flexWrap: 'wrap',
          flex: 1,
          paddingHorizontal: 12,
        }}
        numberOfLines={2}
        ellipsizeMode="tail">{`Belongs to #${note.title} note`}</Paragraph>
    ) : null;
  };

  const _renderDoneTime = (render = true) => {
    return task.isDone && task.doneTimestamp && render ? (
      <Paragraph
        style={{
          fontWeight: '400',
          color: theme.colors.onSurface,
          fontSize: 12,
          flexWrap: 'wrap',
          flex: 1,
          paddingHorizontal: 12,
        }}
        numberOfLines={2}
        ellipsizeMode="tail">{`Marked done ${moment(task.doneTimestamp)
        .calendar()
        .toLowerCase()}`}</Paragraph>
    ) : null;
  };

  const _renderDueDate = (render = true) => {
    return !task.isDone && task.endTimestamp && render ? (
      <Paragraph
        style={{
          fontWeight: '400',
          color: theme.colors.onSurface,
          fontSize: 12,
          flexWrap: 'wrap',
          flex: 1,
          paddingHorizontal: 12,
        }}
        numberOfLines={2}
        ellipsizeMode="tail">{`Due ${
        task.endTimestamp < Date.now() ? 'was' : 'is'
      } ${moment(task.endTimestamp).calendar().toLowerCase()}`}</Paragraph>
    ) : null;
  };

  // handle functions
  const _handleMarkIsDone = () => {
    dispatch(editTaskIsDone({id: task.id, isDone: !task.isDone}));
  };
  const _handleUnarchiveTask = (unarchiveNoteIfRequired = true) => {
    dispatch(
      editTaskIsArchived({
        id: task.id,
        isArchived: false,
        unarchiveNoteIfRequired,
      }),
    );
  };
  const _handleRestoreTask = () => {
    dispatch(restoreTask({id: task.id}));
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
  const _isDue = () => {
    return (
      task.endTimestamp &&
      new Date(task.endTimestamp) < new Date() &&
      !task.isDone
    );
  };

  // return

  return (
    <TouchableRipple
      style={{
        marginBottom: 6,
        borderLeftColor: _isDue()
          ? theme?.colors.error
          : noteColor
          ? noteColor
          : theme?.colors.primary,
        borderLeftWidth: 4,
        backgroundColor: _isDue()
          ? theme?.colors.errorContainer
          : theme?.colors.primaryContainer,
        borderRadius: 4,
      }}
      onPress={_navigateToTaskScreen}
      onLongPress={() => {
        Logger.pageLogger('TaskItem.js:onLongPress');
        onLongPress?.();
      }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              flex: 4,
            }}>
            <IconButton
              icon={task.isDone ? 'radiobox-marked' : 'radiobox-blank'}
              onPress={_handleMarkIsDone}
            />
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                fontWeight: '600',
                color: theme.colors.onSurface,
                fontSize: 16,
                flexWrap: 'wrap',
                flex: 1,
              }}>
              {task.title}
            </Text>
          </View>
          {task.isArchived ? (
            <IconButton
              icon={'package-up'}
              onPress={_handleUnarchiveTask}
              size={24}
            />
          ) : task.isMarkedDeleted ? (
            <IconButton
              onPress={_handleRestoreTask}
              icon={'delete-restore'}
              size={24}
            />
          ) : (
            <IconButton
              icon={task.isBookmarked ? 'bookmark' : 'bookmark-outline'}
              onPress={_handleBookmark}
              size={24}
            />
          )}
        </View>

        {!task.description || String(task.description).trim() === '' ? null : (
          <Paragraph
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontWeight: '400',
              color: theme.colors.onSurface,
              fontSize: 14,
              flexWrap: 'wrap',
              flex: 1,
              paddingHorizontal: 12,
            }}>
            {task.description}
          </Paragraph>
        )}
        {_renderNoteDetails(task.isArchived || task.isMarkedDeleted)}
        {_renderArchiveTime()}
        {_renderDeletionTime()}
        {_renderDoneTime(!task.isArchived && !task.isMarkedDeleted)}
        {_renderDueDate(!task.isArchived && !task.isMarkedDeleted)}
      </View>
    </TouchableRipple>
  );
};

const enhanceTask = withObservables(['task'], ({task}) => ({
  task,
  note: task.note,
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
