import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import extractUrls from 'extract-urls';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
import DatePicker from 'react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Appbar,
  HelperText,
  List,
  Surface,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {DeleteConfirmationDialog} from '../components/DeleteConfirmationDialog';
import {LinkPreview} from '../components/URLPreview';

import {database} from '../db/db';
import Task from '../db/models/Task';
import {useDebounce} from '../hooks/useDebounce';
import {
  deleteTask,
  editTaskDescription,
  editTaskEndTimestamp,
  editTaskIsBookmark,
  editTaskIsDone,
  editTaskReminderTimestamp,
  editTaskTitle,
  resetDeleteTaskState,
} from '../redux/actions';
const BOTTOM_APPBAR_HEIGHT = 64;
/**
 *
 * @param {object} param0
 * @param {Task} param0.task
 * @returns
 */
const TaskScreen = ({navigation, task, deleteTaskSuccess, dispatch}) => {
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

  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  useEffect(() => {
    if (String(debouncedTitle).trim() === '') {
      setError('Title cannot be empty');
    } else {
      setError(null);
      dispatch(editTaskTitle({id: task.id, title: debouncedTitle}));
    }
  }, [debouncedTitle]);

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
    if (_isDue()) {
      StatusBar.setBackgroundColor(theme?.colors.errorContainer);
    } else {
      StatusBar.setBackgroundColor(theme?.colors.surface);
    }
  }, [task, task.isDone]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      const _s = extractUrls(`${task.title}   ${task.description}`);
      setURLs(_s);

      task.endTimestamp &&
        setDueDateString(moment(task.endTimestamp).calendar());
      task.reminderTimestamp &&
        setReminderDateString(moment(task.reminderTimestamp).calendar());
    }
  }, [task]);

  // callbacks

  // render functions

  // handle functions
  const _handleTitleChange = title => {
    setTitle(title);
  };
  const _handleDescriptionChange = description => {
    setDescription(description);
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
  const _handleOnReminderDateTimeChange = date => {
    dispatch(
      editTaskReminderTimestamp({
        id: task.id,
        reminderTimestamp: new Date(date),
      }),
    );
    setReminderDateString(moment(date).calendar());
    setIsReminderDateTimePickerVisible(false);
  };
  const _handleCloseReminderDateTimePicker = () => {
    setIsReminderDateTimePickerVisible(false);
  };
  const _handleAddToCalendar = () => {
    const startDate = new Date(task.createdAt).getMilliseconds();
    const endDate = new Date(task.endTimestamp).getMilliseconds();
    console.log({startDate, endDate});
    ReactNativeCalendarEvents.saveEvent(task.title, {
      calendarId: '1',
      startDate,
      endDate,
    })
      .then(result => {
        ToastAndroid.show('Event added');
      })
      .catch(error => {
        ToastAndroid.show('Event cannot be added');
      });
    //   addTaskToCalendar({calendarID: 1, taskID: task.id})

    // };
  };

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    StatusBar.setBackgroundColor(theme?.colors.surface);
    dispatch(resetDeleteTaskState());
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
      style={[styles.main, {backgroundColor: theme?.colors.primaryContainer}]}>
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
          backgroundColor: _isDue()
            ? theme?.colors.errorContainer
            : theme?.colors.surface,
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
            backgroundColor: _isDue()
              ? theme?.colors.errorContainer
              : theme?.colors.surface,
          }}>
          <TextInput
            value={title}
            autoCorrect={false}
            multiline
            underlineColor="transparent"
            activeOutlineColor="transparent"
            onChangeText={_handleTitleChange}
            style={[
              {
                borderWidth: 0,
                fontSize: 22,
                borderRadius: 0,
                backgroundColor: 'transparent',
                marginBottom: 6,
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
        {/* <Divider /> */}

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
          left={props => (
            <List.Icon
              {...props}
              icon={task.isDone ? 'checkbox-marked' : 'checkbox-blank-outline'}
              color={theme.colors.onSurface}
            />
          )}
        />

        <List.Item
          title={`Due ${String(dueDateString).toLowerCase()}`}
          titleStyle={{fontSize: 14}}
          onPress={_handleOpenDueDateTimePicker}
          left={props => (
            <List.Icon
              {...props}
              icon="calendar-range"
              color={theme.colors.onSurface}
            />
          )}
        />
        <List.Item
          title={`Reminder ${String(reminderDateString).toLowerCase()}`}
          titleStyle={{fontSize: 14}}
          onPress={_handleOpenReminderDateTimePicker}
          left={props => (
            <List.Icon {...props} icon="bell" color={theme.colors.onSurface} />
          )}
        />
        <List.Item
          title="Add to device calendar"
          onPress={_handleAddToCalendar}
          titleStyle={{fontSize: 14}}
          left={props => (
            <List.Icon
              {...props}
              icon="calendar-plus"
              color={theme.colors.onSurface}
            />
          )}
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
        {urls?.map(url => {
          return <LinkPreview text={url} />;
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
  };
};

export default connect(mapStateToProps)(EnhancedTaskScreen);

const styles = new StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});
