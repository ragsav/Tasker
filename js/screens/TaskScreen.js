import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import moment from 'moment';
import {
  Appbar,
  Card,
  Divider,
  IconButton,
  Paragraph,
  Surface,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeleteConfirmationDialog} from '../components/DeleteConfirmationDialog';
import {database} from '../db/db';
import Task from '../db/models/Task';
import {
  deleteTask,
  editTaskEndTimestamp,
  editTaskIsBookmark,
  editTaskIsDone,
  editTaskReminderTimestamp,
  editTaskTitle,
  resetDeleteTaskState,
} from '../redux/actions';
import DatePicker from 'react-native-date-picker';
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

  // states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dueDateString, setDueDateString] = useState('date');
  const [isDueDateTimePickerVisible, setIsDueDateTimePickerVisible] =
    useState(false);

  const [reminderDateString, setReminderDateString] = useState('time');
  const [isReminderDateTimePickerVisible, setIsReminderDateTimePickerVisible] =
    useState(false);

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  useEffect(() => {
    if (deleteTaskSuccess) {
      _navigateBack();
    }
  }, [deleteTaskSuccess]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);

      task.endTimestamp &&
        setDueDateString(moment(task.endTimestamp).calendar());
      task.reminderTimestamp &&
        setReminderDateString(moment(task.reminderTimestamp).calendar());
    }
  }, [task]);

  // callbacks

  // render functions
  const _renderTitleInput = () => {
    return <TextInput value={task.title} onChangeText={_handleTitleChange} />;
  };

  // handle functions
  const _handleTitleChange = title => {
    setTitle(title);
  };
  const _handleOnTitleInputBlur = () => {
    dispatch(editTaskTitle({id: task.id, title}));
  };
  const _handleOpenDeleteTaskDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };
  const _handleCloseDeleteTaskDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  const _handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
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

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetDeleteTaskState());
  };

  // return
  return (
    <SafeAreaView style={[styles.main, {backgroundColor: task?.colorString}]}>
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
      <Appbar.Header style={{backgroundColor: task?.colorString}}>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content mode="medium" />
      </Appbar.Header>
      <ScrollView keyboardShouldPersistTaps="never">
        <Surface style={{padding: 12}}>
          <TextInput
            value={title}
            autoCorrect={false}
            dense
            multiline
            underlineColor="transparent"
            onChangeText={_handleTitleChange}
            style={{
              borderWidth: 0,

              backgroundColor: 'transparent',
            }}
            onBlur={_handleOnTitleInputBlur}
          />
        </Surface>
        {/* <Divider /> */}

        <TouchableRipple
          onPress={_handleMarkIsDone}
          style={{
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 12,
                backgroundColor: 'transparent',
              }}>
              <MaterialCommunityIcons
                name={
                  task.isDone ? 'checkbox-marked' : 'checkbox-blank-outline'
                }
                size={24}
                color={theme.colors.onSurface}
              />
              <Text style={{marginLeft: 12}}>
                {task.isDone
                  ? `Marked done ${moment(task.doneTimestamp)
                      .calendar()
                      .toLowerCase()}`
                  : 'Mark as done'}
              </Text>
            </View>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={_handleOpenDueDateTimePicker}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 12,
                backgroundColor: 'transparent',
              }}>
              <MaterialCommunityIcons
                name="calendar-range"
                size={24}
                color={theme.colors.onSurface}
              />
              <Text style={{marginLeft: 12}}>
                Due {String(dueDateString).toLowerCase()}
              </Text>
            </View>
          </View>
        </TouchableRipple>

        <TouchableRipple
          onPress={_handleOpenReminderDateTimePicker}
          style={{paddingHorizontal: 8}}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 12,
                backgroundColor: 'transparent',
              }}>
              <MaterialCommunityIcons
                name="bell"
                size={24}
                color={theme.colors.onSurface}
              />
              <Text style={{marginLeft: 12}}>
                Reminder {String(reminderDateString).toLowerCase()}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      </ScrollView>
      <Surface
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 12,
        }}>
        <Text>Created {moment(task.createdAt).calendar()}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <IconButton
            icon={task.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            onPress={_handleBookmark}
            style={{}}
          />
          <IconButton icon={'delete'} onPress={_handleOpenDeleteTaskDialog} />
        </View>
      </Surface>
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
  container: {
    width: '100%',
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});
