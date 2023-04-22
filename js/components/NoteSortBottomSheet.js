import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Appbar, Divider, List, useTheme} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {setNoteSortOrder, setNoteSortProperty} from '../redux/actions';

const NoteSortBottomSheet = ({
  visible,
  setVisible,
  noteSortProperty,
  noteSortOrder,
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
  const _handleSetSortProperty = noteSortProperty => {
    dispatch(setNoteSortProperty({noteSortProperty}));
  };
  const _handleSetSortOrder = noteSortOrder => {
    dispatch(setNoteSortOrder({noteSortOrder}));
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
  const _renderNoteSortField = ({item, index}) => {
    return (
      <List.Item
        onPress={() => _handleSetSortProperty(CONSTANTS.NOTE_SORT[item].code)}
        key={index}
        title={String(CONSTANTS.NOTE_SORT[item].text)}
        left={props => (
          <List.Icon
            {...props}
            icon={
              noteSortProperty === CONSTANTS.NOTE_SORT[item].code
                ? 'radiobox-marked'
                : 'radiobox-blank'
            }
          />
        )}
      />
    );
  };
  const _renderNoteSortOrder = ({item, index}) => {
    return (
      <List.Item
        onPress={() =>
          _handleSetSortOrder(CONSTANTS.NOTE_SORT_ORDER[item].code)
        }
        key={index}
        title={String(CONSTANTS.NOTE_SORT_ORDER[item].text)}
        left={props => (
          <List.Icon
            {...props}
            icon={
              noteSortOrder === CONSTANTS.NOTE_SORT_ORDER[item].code
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
        <Appbar.Content title="Sort notes" titleStyle={{fontWeight: '700'}} />
      </Appbar.Header>
      <Divider />
      <BottomSheetScrollView
        style={{backgroundColor: theme?.colors.surface}}
        contentContainerStyle={{
          backgroundColor: theme?.colors.surface,
        }}>
        {Object.keys(CONSTANTS.NOTE_SORT).map((item, index) =>
          _renderNoteSortField({item, index}),
        )}
        <Divider />
        {Object.keys(CONSTANTS.NOTE_SORT_ORDER).map((item, index) =>
          _renderNoteSortOrder({item, index}),
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const mapStateToProps = state => {
  return {
    noteSortProperty: state.noteSort.noteSortProperty,
    noteSortOrder: state.noteSort.noteSortOrder,
  };
};

export default connect(mapStateToProps)(NoteSortBottomSheet);
