import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useState} from 'react';
import {BackHandler, Keyboard, View} from 'react-native';
import {
  Appbar,
  Divider,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconsData} from '../../icons';

export const DescriptionBottomSheet = ({
  visible,
  setVisible,
  description,
  setDescription,
}) => {
  // ref
  const sheetRef = useRef(null);

  // variables
  const theme = useTheme();

  const snapPoints = useMemo(() => ['100%'], []);

  // states
  const [localDescription, setLocalDescription] = useState('');

  // effects
  useEffect(() => {
    const hardwareBackPress = () => {
      _onDestroy();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);
    return BackHandler.removeEventListener(
      'hardwareBackPress',
      hardwareBackPress,
    );
  }, []);
  useEffect(() => {
    if (!visible) {
      _handleCloseFilterSheet();
    } else {
      _handleOpenFilterSheet(0);
    }
  }, [visible, sheetRef]);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  // callbacks

  // render functions

  // handle functions
  const _handleChangeLocalDescription = description => {
    setLocalDescription(description);
  };
  const _handleSaveDescription = () => {
    setDescription(localDescription);
    setVisible(false);
  };
  const _handleSheetChange = useCallback(index => {}, []);
  const _handleOpenFilterSheet = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const _handleCloseFilterSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // navigation functions

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    Keyboard.dismiss();
    setVisible(false);
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

  // return
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
        <Appbar.Action icon={'close'} onPress={_handleCloseFilterSheet} />
        <Appbar.Content title="Description" titleStyle={{fontWeight: '700'}} />
        <Appbar.Action
          icon={'check'}
          onPress={_handleSaveDescription}
          isLeading={true}
        />
      </Appbar.Header>
      <Divider />
      <BottomSheetTextInput
        style={{
          backgroundColor: theme?.colors.surface,
          color: theme?.colors.onSurface,
          padding: 12,
          height: '100%',
          textAlignVertical: 'top',
        }}
        onChangeText={_handleChangeLocalDescription}
        value={localDescription}
      />
    </BottomSheet>
  );
};
