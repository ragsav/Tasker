import withObservables from '@nozbe/with-observables';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {Image, View} from 'react-native';
import {
  IconButton,
  Paragraph,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated, {
  Layout,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {database} from '../db/db';
import Task from '../db/models/Task';
import {
  editTaskIsArchived,
  editTaskIsBookmark,
  editTaskIsDone,
  restoreTask,
  setTaskListDetailView,
} from '../redux/actions';
import {Logger} from '../utils/logger';
import extractUrls from 'extract-urls';
import {LinkPreview} from './URLPreview';

const ImageDisplayItem = ({URIs}) => {
  const uriArray = JSON.parse(URIs);
  return (
    uriArray &&
    Array.isArray(uriArray) &&
    uriArray.map((uri, index) => {
      return (
        <Image
          source={{uri}}
          key={`task-images-${index}`}
          style={{
            height: 120,
            width: '100%',
            resizeMode: 'cover',
            borderBottomRightRadius: index === uriArray.length - 1 ? 4 : 0,
          }}
        />
      );
    })
  );
};

const URLPreviewMini = ({title, description}) => {
  const extractedURLs = extractUrls(`${title}   ${description}`);
  return extractedURLs?.map((url, index) => {
    return (
      <LinkPreview
        text={url}
        key={index}
        style={{
          margin: 0,
          borderRadius: 0,
          borderBottomRightRadius: index === extractUrls.length - 1 ? 4 : 0,
        }}
        imageStyle={{borderRadius: 0}}
      />
    );
  });
};
/**
 *
 * @param {object} param0
 * @param {Task} param0.task
 * @returns
 */
const TaskItem = ({
  task,
  index,
  onLongPress,
  noteColor,
  isActive,
  dispatch,
  detailedView,
  renderURLInTask,
  note,
}) => {
  // ref

  // variables
  const navigation = useNavigation();
  const theme = useTheme();

  // states

  // effects

  // callbacks

  // render functions

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
    <Animated.View
      entering={SlideInLeft.delay(index * 200)}
      layout={Layout.springify()}>
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
                  textDecorationLine: task.isDone ? 'line-through' : null,
                  textDecorationStyle: 'solid',
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

          {!task.description ||
          String(task.description).trim() === '' ? null : (
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
                paddingBottom: 6,
              }}>
              {task.description}
            </Paragraph>
          )}
          {note && _renderNoteDetails(task.isMarkedDeleted)}
          {_renderDeletionTime()}
          {detailedView &&
            _renderDoneTime(!task.isArchived && !task.isMarkedDeleted)}
          {detailedView &&
            _renderDueDate(!task.isArchived && !task.isMarkedDeleted)}

          {detailedView && <ImageDisplayItem URIs={task.imageURIs} />}
          {detailedView && renderURLInTask && (
            <URLPreviewMini title={task.title} description={task.description} />
          )}
        </View>
      </TouchableRipple>
    </Animated.View>
  );
};

const enhanceTask = withObservables(['task'], ({task}) => ({
  task,
  //TODO: if note is not present this throughs error. some solution is needed
  note: task.note,
}));

const mapStateToProps = state => {
  return {
    isDeletingNote: state.note.isDeletingNote,
    deleteNoteSuccess: state.note.deleteNoteSuccess,
    deleteNoteFailure: state.note.deleteNoteFailure,
    renderURLInTask: state.settings.renderURLInTask,
  };
};

const EnhancedTaskItem = enhanceTask(TaskItem);
export default connect(mapStateToProps)(EnhancedTaskItem);
