import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import extractUrls from 'extract-urls';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Appbar,
  Divider,
  HelperText,
  List,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {DeleteConfirmationDialog} from '../components/DeleteConfirmationDialog';
import {LinkPreview} from '../components/URLPreview';

import {database} from '../db/db';
import Task from '../db/models/Task';
import {useDebounce} from '../hooks/useDebounce';
import {
  deleteTask,
  editTaskAddReminder,
  editTaskDescription,
  editTaskEndTimestamp,
  editTaskIsArchived,
  editTaskIsBookmark,
  editTaskIsDone,
  editTaskRemoveDueDate,
  editTaskRemoveReminder,
  editTaskTitle,
  resetDeleteTaskState,
  resetEditTaskState,
} from '../redux/actions';

const BOTTOM_APPBAR_HEIGHT = 64;
/**
 *
 * @param {object} param0
 * @param {Task} param0.task
 * @returns
 */
const TaskScreen = ({
  navigation,
  task,
  deleteTaskSuccess,
  renderURLInTask,
  dispatch,
}) => {
  // ref

  // variables
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();

  // states

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [appBarTitleOpacity, setAppbarTitleOpacity] = useState(0);
  const [error, setError] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dueDateString, setDueDateString] = useState('date');
  const [isDueDateTimePickerVisible, setIsDueDateTimePickerVisible] =
    useState(false);

  const [reminderDateString, setReminderDateString] = useState('time');
  const [isReminderDateTimePickerVisible, setIsReminderDateTimePickerVisible] =
    useState(false);
  const [urls, setURLs] = useState([]);

  const debouncedDescription = useDebounce(description, 500);

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  useEffect(() => {
    dispatch(
      editTaskDescription({id: task.id, description: debouncedDescription}),
    );
  }, [debouncedDescription]);

  useEffect(() => {
    if (deleteTaskSuccess) {
      _navigateBack();
    }
  }, [deleteTaskSuccess]);

  useEffect(() => {
    if (task) {
      if (String(task.reminderID).trim() != '' && task.reminderTimestamp > 0) {
        const _s = `Reminder ${
          task.reminderTimestamp < Date.now() ? 'was' : 'is'
        } ${moment(task.reminderTimestamp).calendar().toLowerCase()}`;
        setReminderDateString(_s);
      } else {
        setReminderDateString('Set reminder');
      }
    }
  }, [task, task.reminderID, task.reminderTimestamp]);

  useEffect(() => {
    if (task) {
      if (task.endTimestamp) {
        const _s = `Due ${
          task.endTimestamp < Date.now() ? 'was' : 'is'
        } ${moment(task.endTimestamp).calendar().toLowerCase()}`;
        setDueDateString(_s);
      } else {
        setDueDateString('Set due date');
      }
    }
  }, [task, task.endTimestamp]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      if (renderURLInTask) {
        const _s = extractUrls(`${task.title}   ${task.description}`);
        setURLs(_s);
      }
    }
  }, [task]);

  useFocusEffect(
    useCallback(() => {
      if (renderURLInTask) {
        const _s = extractUrls(`${task.title}   ${task.description}`);
        setURLs(_s);
      }
    }, [renderURLInTask]),
  );

  // callbacks

  // render functions

  // handle functions
  const _handleTitleChange = title => {
    setTitle(title);
  };

  const _handleOnTitleBlur = () => {
    if (task && String(title).trim() === '') {
      setError('Title cannot be empty');
    } else {
      setError(null);
      dispatch(editTaskTitle({id: task.id, title}));
    }
  };
  const _handleDescriptionChange = description => {
    setDescription(description);
  };

  const _handleToggleArchive = () => {
    dispatch(
      editTaskIsArchived({
        id: task.id,
        isArchived: !task.isArchived,
        unarchiveNoteIfRequired: true,
      }),
    );
    _navigateBack();
  };

  const _handleOpenDeleteTaskDialog = () => {
    setIsDeleteDialogOpen(true);
  };
  const _handleCloseDeleteTaskDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const _handleDeleteTask = () => {
    dispatch(deleteTask({id: task.id}));
    setIsDeleteDialogOpen(false);
  };

  const _handleMarkIsDone = () => {
    dispatch(editTaskIsDone({id: task.id, isDone: !task.isDone}));
  };
  const _handleBookmark = () => {
    dispatch(
      editTaskIsBookmark({id: task.id, isBookmarked: !task.isBookmarked}),
    );
  };

  const _handleOpenDueDateTimePicker = () => {
    setIsDueDateTimePickerVisible(true);
  };
  const _handleOnDueDateTimeChange = date => {
    dispatch(editTaskEndTimestamp({id: task.id, endTimestamp: new Date(date)}));
    setDueDateString(moment(date).calendar());
    setIsDueDateTimePickerVisible(false);
  };
  const _handleCloseDueDateTimePicker = () => {
    setIsDueDateTimePickerVisible(false);
  };

  const _handleOpenReminderDateTimePicker = () => {
    setIsReminderDateTimePickerVisible(true);
  };
  const _handleRemoveReminder = () => {
    dispatch(editTaskRemoveReminder({id: task.id}));
  };
  const _handleRemoveDueDate = () => {
    dispatch(editTaskRemoveDueDate({id: task.id}));
  };
  const _handleOnReminderDateTimeChange = date => {
    dispatch(
      editTaskAddReminder({
        id: task.id,
        reminderTimestamp: new Date(date),
      }),
    );
    setIsReminderDateTimePickerVisible(false);
  };
  const _handleCloseReminderDateTimePicker = () => {
    setIsReminderDateTimePickerVisible(false);
  };

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetDeleteTaskState());
    dispatch(resetEditTaskState());
  };
  const _isDue = () => {
    const _v =
      task.endTimestamp &&
      new Date(task.endTimestamp) < new Date() &&
      !task.isDone;
    return _v;
  };

  // return
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <DeleteConfirmationDialog
        visible={isDeleteDialogOpen}
        message="Task"
        handleCancel={_handleCloseDeleteTaskDialog}
        handleDelete={_handleDeleteTask}
      />
      <DatePicker
        modal
        open={isDueDateTimePickerVisible}
        date={task.endTimestamp ? task.endTimestamp : new Date()}
        onConfirm={_handleOnDueDateTimeChange}
        onCancel={_handleCloseDueDateTimePicker}
      />
      <DatePicker
        modal
        open={isReminderDateTimePickerVisible}
        date={task.reminderTimeStamp ? task.reminderTimeStamp : new Date()}
        onConfirm={_handleOnReminderDateTimeChange}
        onCancel={_handleCloseReminderDateTimePicker}
      />
      <Appbar.Header
        style={{
          backgroundColor: theme?.colors.surface,
        }}>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content
          title={<Text ellipsizeMode="tail">{task.title}</Text>}
          titleStyle={{
            opacity: appBarTitleOpacity,
            fontWeight: '700',
            flexWrap: 'wrap',
          }}
        />
        <Appbar.Action
          isLeading={false}
          icon={task.isBookmarked ? 'bookmark' : 'bookmark-outline'}
          // iconColor={theme?.colors.onPrimary}
          onPress={_handleBookmark}
        />
        <Appbar.Action
          isLeading={false}
          icon={task.isArchived ? 'package-up' : 'package-down'}
          // iconColor={theme?.colors.onPrimary}
          onPress={_handleToggleArchive}
        />
        <Appbar.Action
          isLeading={false}
          icon={'delete'}
          // iconColor={theme?.colors.onPrimary}
          onPress={_handleOpenDeleteTaskDialog}
        />
      </Appbar.Header>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="never"
        onScroll={event => {
          setAppbarTitleOpacity(event.nativeEvent.contentOffset.y / 90);
        }}
        contentContainerStyle={{paddingBottom: BOTTOM_APPBAR_HEIGHT + 20}}>
        <Surface
          style={{
            // padding: 12,
            padding: 6,
            justifyContent: 'center',
            backgroundColor: theme?.colors.surface,
          }}>
          <TextInput
            value={title}
            autoCorrect={false}
            multiline
            // underlineColor="transparent"
            activeOutlineColor="transparent"
            onChangeText={_handleTitleChange}
            onBlur={_handleOnTitleBlur}
            style={[
              {
                borderWidth: 0,
                fontSize: 22,
                borderRadius: 0,
                backgroundColor: 'transparent',

                paddingHorizontal: 0,
              },
            ]}
            mode="outlined"
            outlineColor="transparent"
          />
          {error && <HelperText type="error">{error}</HelperText>}
          <Text
            variant="bodySmall"
            style={{paddingHorizontal: 14}}>{`Created ${moment(task.createdAt)
            .calendar()
            .toLowerCase()}`}</Text>
        </Surface>
        <Divider />

        <List.Item
          title={
            task.isDone
              ? `Marked done ${moment(task.doneTimestamp)
                  .calendar()
                  .toLowerCase()}`
              : 'Mark as done'
          }
          titleStyle={{fontSize: 14}}
          onPress={_handleMarkIsDone}
          style={{
            backgroundColor: _isDue()
              ? theme?.colors.errorContainer
              : theme?.colors.surface,
          }}
          left={props => (
            <List.Icon
              {...props}
              icon={task.isDone ? 'checkbox-marked' : 'checkbox-blank-outline'}
              color={theme.colors.onSurface}
            />
          )}
        />

        <List.Item
          title={dueDateString}
          titleStyle={{fontSize: 14}}
          onPress={_handleOpenDueDateTimePicker}
          left={props => (
            <List.Icon
              {...props}
              icon="calendar-range"
              color={theme.colors.onSurface}
            />
          )}
          right={
            task.endTimestamp
              ? props => (
                  <Pressable onPress={_handleRemoveDueDate}>
                    <List.Icon
                      {...props}
                      icon="close"
                      color={theme.colors.onSurface}
                    />
                  </Pressable>
                )
              : null
          }
        />
        <List.Item
          title={reminderDateString}
          titleStyle={{fontSize: 14}}
          onPress={_handleOpenReminderDateTimePicker}
          left={props => (
            <List.Icon
              {...props}
              icon={
                String(task.reminderID).trim() === '' ? 'bell' : 'bell-ring'
              }
              color={theme.colors.onSurface}
            />
          )}
          right={
            String(task.reminderID).trim() === ''
              ? null
              : props => (
                  <Pressable onPress={_handleRemoveReminder}>
                    <List.Icon
                      {...props}
                      icon="close"
                      color={theme.colors.onSurface}
                    />
                  </Pressable>
                )
          }
        />

        <TextInput
          value={description}
          autoCorrect={false}
          multiline
          underlineColor="transparent"
          onChangeText={_handleDescriptionChange}
          style={[
            {
              fontSize: 16,
              margin: 12,
            },
          ]}
          mode="outlined"
          numberOfLines={5}
          placeholder="Add description"
        />
        {renderURLInTask &&
          urls?.map((url, index) => {
            return <LinkPreview text={url} key={index} />;
          })}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
const enhanceTaskScreen = withObservables(['route'], ({route}) => ({
  task: database.collections.get('tasks').findAndObserve(route.params.p_id),
}));
const EnhancedTaskScreen = enhanceTaskScreen(TaskScreen);

const mapStateToProps = state => {
  return {
    isDeletingTask: state.task.isDeletingTask,
    deleteTaskSuccess: state.task.deleteTaskSuccess,
    deleteTaskFailure: state.task.deleteTaskFailure,
    renderURLInTask: state.settings.renderURLInTask,
  };
};

export default connect(mapStateToProps)(EnhancedTaskScreen);
