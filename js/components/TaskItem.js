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
import {editTaskIsBookmark, editTaskIsDone} from '../redux/actions';
import {Logger} from '../utils/logger';
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
  const theme = useTheme();

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
        paddingBottom: 6,
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
          <IconButton
            icon={task.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            onPress={_handleBookmark}
            size={24}
          />
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

        {task.isDone && task.endTimestamp ? (
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
        ) : task.endTimestamp ? (
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
            ellipsizeMode="tail">{`Due date ${moment(task.endTimestamp)
            .calendar()
            .toLowerCase()}`}</Paragraph>
        ) : (
          _isDue() && (
            <Paragraph
              style={{
                fontWeight: '400',
                color: theme?.colors.onErrorContainer,
                fontSize: 12,
                flexWrap: 'wrap',
                flex: 1,
                paddingHorizontal: 12,
              }}
              numberOfLines={2}
              ellipsizeMode="tail">{`Due on ${moment(task.endTimestamp)
              .calendar()
              .toLowerCase()}`}</Paragraph>
          )
        )}
      </View>
    </TouchableRipple>
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
