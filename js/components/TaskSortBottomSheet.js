import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Appbar, Divider, List, useTheme} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {setTaskSortOrder, setTaskSortProperty} from '../redux/actions';

const TaskSortBottomSheet = ({
  visible,
  setVisible,
  taskSortProperty,
  taskSortOrder,
  dispatch,
}) => {
  // hooks
  const sheetRef = useRef(null);
  const theme = useTheme();

  const snapPoints = useMemo(() => ['100%'], []);

  useEffect(() => {
    if (!visible) {
      _handleCloseSortSheet();
    } else {
      _handleOpenSortSheet(0);
    }
  }, [visible, sheetRef]);

  // callbacks
  const _handleSheetChange = useCallback(index => {}, []);
  const _handleOpenSortSheet = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const _handleCloseSortSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const _handleSetSortProperty = taskSortProperty => {
    dispatch(setTaskSortProperty({taskSortProperty}));
  };
  const _handleSetSortOrder = taskSortOrder => {
    dispatch(setTaskSortOrder({taskSortOrder}));
  };

  const _renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={1}
      />
    ),
    [],
  );
  const _renderTaskSortField = ({item, index}) => {
    return (
      <List.Item
        onPress={() => _handleSetSortProperty(CONSTANTS.TASK_SORT[item].code)}
        key={index}
        title={String(CONSTANTS.TASK_SORT[item].text)}
        left={props => (
          <List.Icon
            {...props}
            icon={
              taskSortProperty === CONSTANTS.TASK_SORT[item].code
                ? 'radiobox-marked'
                : 'radiobox-blank'
            }
          />
        )}
      />
    );
  };
  const _renderTaskSortOrder = ({item, index}) => {
    return (
      <List.Item
        onPress={() =>
          _handleSetSortOrder(CONSTANTS.TASK_SORT_ORDER[item].code)
        }
        key={index}
        title={String(CONSTANTS.TASK_SORT_ORDER[item].text)}
        left={props => (
          <List.Icon
            {...props}
            icon={
              taskSortOrder === CONSTANTS.TASK_SORT_ORDER[item].code
                ? 'radiobox-marked'
                : 'radiobox-blank'
            }
          />
        )}
      />
    );
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleStyle={{display: 'none'}}
      backdropComponent={_renderBackdrop}
      onClose={() => setVisible(false)}
      onChange={_handleSheetChange}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            setVisible(false);
          }}
        />
        <Appbar.Content title="Sort tasks" titleStyle={{fontWeight: '700'}} />
      </Appbar.Header>
      <Divider />
      <BottomSheetScrollView
        style={{backgroundColor: theme?.colors.surface}}
        contentContainerStyle={{
          backgroundColor: theme?.colors.surface,
        }}>
        {Object.keys(CONSTANTS.TASK_SORT).map((item, index) =>
          _renderTaskSortField({item, index}),
        )}
        <Divider />
        {Object.keys(CONSTANTS.TASK_SORT_ORDER).map((item, index) =>
          _renderTaskSortOrder({item, index}),
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const mapStateToProps = state => {
  return {
    taskSortProperty: state.taskSort.taskSortProperty,
    taskSortOrder: state.taskSort.taskSortOrder,
  };
};

export default connect(mapStateToProps)(TaskSortBottomSheet);
