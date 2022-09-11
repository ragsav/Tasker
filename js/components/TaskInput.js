import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  TextInput,
  Text,
  useTheme,
  Portal,
  Modal,
  Chip,
} from 'react-native-paper';
import {connect} from 'react-redux';

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import {createTask} from '../redux/actions/task';
const TaskInput = ({
  createTaskSuccess,
  dispatch,
  visible,
  setVisible,
  noteID,
}) => {
  // ref
  const sheetRef = useRef(null);
  const textInputRef = useRef(null);
  // variables
  const theme = useTheme();
  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  // states
  const [taskData, setTaskData] = useState({
    title: '',
    startTimestamp: null,
    endTimestamp: null,
    reminderTimeStamp: null,
  });
  const [dueDateString, setDueDateString] = useState('Set due');
  const [isDueDateTimePickerVisible, setIsDueDateTimePickerVisible] =
    useState(false);

  const [reminderDateString, setReminderDateString] = useState('Set reminder');
  const [isReminderDateTimePickerVisible, setIsReminderDateTimePickerVisible] =
    useState(false);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  // effects
  useEffect(() => {
    _init();
    return _onDestroy;
  }, []);

  useEffect(() => {
    if (visible) {
      _handleOpenSheet(0);
    }
  }, [visible, sheetRef]);

  // callbacks
  const _handleSheetChange = useCallback(index => {}, []);
  const _handleOpenSheet = useCallback(index => {
    textInputRef?.current.focus();
    sheetRef.current?.snapToIndex(index);
  }, []);
  const _handleCloseSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const _handleOnCloseSheet = useCallback(() => {
    textInputRef?.current.blur();
    setVisible(false);
  }, []);

  // render functions
  const _renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.2}
      />
    ),
    [],
  );

  // handle functions
  const _handleOnTitleChange = title => {
    setTaskData({...taskData, title});
  };
  const _handleOpenDueDateTimePicker = () => {
    setIsDueDateTimePickerVisible(true);
  };
  const _handleOnDueDateTimeChange = date => {
    setTaskData({...taskData, endTimestamp: new Date(date)});
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
    setTaskData({...taskData, reminderTimeStamp: new Date(date)});
    setReminderDateString(moment(date).calendar());
    setIsReminderDateTimePickerVisible(false);
  };
  const _handleCloseReminderDateTimePicker = () => {
    setIsReminderDateTimePickerVisible(false);
  };
  const _handleSave = () => {
    dispatch(
      createTask({
        title: taskData.title,
        noteID,
        startTimestamp: taskData.startTimestamp,
        endTimestamp: taskData.endTimestamp,
        reminderTimestamp: taskData.reminderTimeStamp,
      }),
    );
  };

  // navigation functions

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {};

  // return
  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backdropComponent={_renderBackdrop}
      onClose={_handleOnCloseSheet}
      style={{backgroundColor: theme.colors.surface}}
      overDragResistanceFactor={0}
      handleStyle={{display: 'none'}}>
      <BottomSheetView
        style={[
          styles.contentContainer,
          {backgroundColor: theme.colors.surface},
        ]}
        onLayout={handleContentLayout}>
        <TextInput
          ref={textInputRef}
          label="Add task"
          style={styles.input}
          value={taskData.title}
          onChangeText={_handleOnTitleChange}
          right={
            <TextInput.Icon icon="arrow-up-bold-circle" onPress={_handleSave} />
          }
        />
        <DatePicker
          modal
          open={isDueDateTimePickerVisible}
          date={taskData.endTimestamp ? taskData.endTimestamp : new Date()}
          onConfirm={_handleOnDueDateTimeChange}
          onCancel={_handleCloseDueDateTimePicker}
        />
        <DatePicker
          modal
          open={isReminderDateTimePickerVisible}
          date={
            taskData.reminderTimeStamp ? taskData.reminderTimeStamp : new Date()
          }
          onConfirm={_handleOnReminderDateTimeChange}
          onCancel={_handleCloseReminderDateTimePicker}
        />
        <BottomSheetScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflow: 'scroll',
            marginBottom: 12,
          }}>
          <Chip
            icon={'calendar-range'}
            onPress={_handleOpenDueDateTimePicker}
            style={{marginRight: 12}}>
            {dueDateString}
          </Chip>
          <Chip
            icon={'bell'}
            onPress={_handleOpenReminderDateTimePicker}
            style={{marginRight: 12}}>
            {reminderDateString}
          </Chip>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const mapStateToProps = state => {
  return {
    isCreatingTask: state.task.isCreatingTask,
    createTaskSuccess: state.task.createTaskSuccess,
    createTaskFailure: state.task.createTaskFailure,
  };
};

export default connect(mapStateToProps)(TaskInput);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    padding: 12,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  input: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: 'rgba(151, 151, 151, 0)',
  },
});