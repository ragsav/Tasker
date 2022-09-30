import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import withObservables from '@nozbe/with-observables';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Pressable, View} from 'react-native';
import {
  Appbar,
  Divider,
  IconButton,
  List,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {database} from '../db/db';
import Label from '../db/models/Label';
import {Logger} from '../utils/logger';

export const ImagePickerBottomSheet = ({
  visible,
  setVisible,
  addURI,
  removeURI,
}) => {
  // hooks
  const sheetRef = useRef(null);
  const theme = useTheme();

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  useEffect(() => {
    if (!visible) {
      _handleCloseFilterSheet();
    } else {
      _handleOpenFilterSheet(0);
    }
  }, [visible, sheetRef]);

  // callbacks
  const _handleSheetChange = useCallback(index => {}, []);
  const _handleOpenFilterSheet = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const _handleCloseFilterSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const _renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    [],
  );

  const _handleOpenCamera = async () => {
    const result = await launchCamera({saveToPhotos: true});
    if (result.didCancel || result.errorCode) {
      Logger.pageLogger(
        'ImagePickerBottomSheet.js:_handleOpenCamera:cancel or error',
        result.errorMessage,
      );
    } else {
      if (
        result.assets &&
        Array.isArray(result.assets) &&
        result.assets.length > 0
      ) {
        addURI(result.assets[0].uri);
      }
      Logger.pageLogger(
        'ImagePickerBottomSheet.js:_handleOpenCamera:result',
        result,
      );
    }
    setVisible(false);
  };

  const _handleOpenFileSystem = async () => {
    const result = await launchImageLibrary();
    if (result.didCancel || result.errorCode) {
      Logger.pageLogger(
        'ImagePickerBottomSheet.js:_handleOpenFileSystem:cancel or error',
        result.errorMessage,
      );
    } else {
      if (
        result.assets &&
        Array.isArray(result.assets) &&
        result.assets.length > 0
      ) {
        addURI(result.assets[0].uri);
      }
      Logger.pageLogger(
        'ImagePickerBottomSheet.js:_handleOpenFileSystem:result',
        result,
      );
    }
    setVisible(false);
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backgroundStyle={{borderRadius: 6}}
      enablePanDownToClose={false}
      handleStyle={{display: 'none'}}
      backdropComponent={_renderBackdrop}
      onClose={() => setVisible(false)}
      onChange={_handleSheetChange}>
      <BottomSheetView onLayout={handleContentLayout}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 12,
          }}>
          <Text>Upload from</Text>
          <IconButton
            icon={'close'}
            onPress={() => {
              setVisible(false);
            }}
          />
        </View>

        <Surface
          elevation={0}
          style={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <List.Item
            left={() => <List.Icon icon={'folder'} />}
            style={{width: '100%', paddingVertical: 0}}
            onPress={_handleOpenFileSystem}
            title="From files"
            titleEllipsizeMode="tail"
          />
          <List.Item
            left={() => <List.Icon icon={'camera'} />}
            style={{width: '100%', paddingVertical: 0}}
            onPress={_handleOpenCamera}
            title="Camera"
            titleEllipsizeMode="tail"
          />
        </Surface>
      </BottomSheetView>
    </BottomSheet>
  );
};
