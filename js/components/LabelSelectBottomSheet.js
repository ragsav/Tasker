import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import withObservables from '@nozbe/with-observables';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View} from 'react-native';
import {
  Appbar,
  Divider,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {database} from '../db/db';
import Label from '../db/models/Label';

const LabelSelectBottomSheet = ({
  visible,
  setVisible,
  selectedLabel,
  setSelectedLabel,
  labels,
}) => {
  // hooks
  const sheetRef = useRef(null);
  const theme = useTheme();

  const snapPoints = useMemo(() => ['100%'], []);

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
  /**
   *
   * @param {object} param0
   * @param {Label} param0.item
   * @returns
   */
  const _renderLabels = ({item, index}) => (
    <TouchableRipple
      key={index}
      style={{
        backgroundColor: theme?.colors.surface,
      }}
      onPress={() => {
        setSelectedLabel(item);
        setVisible(false);
      }}>
      <Surface
        elevation={0}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: 12,
          backgroundColor: '#00000000',
        }}>
        <View
          style={{
            backgroundColor:
              item === selectedLabel
                ? theme?.colors.primary
                : theme?.colors.surfaceVariant,
            borderRadius: 8,
            padding: 16,
          }}>
          <MaterialCommunityIcons
            name={item.iconString ? item.iconString : 'label'}
            size={32}
            color={
              item.id === selectedLabel?.id
                ? theme?.colors.onPrimary
                : theme?.colors.primary
            }
          />
        </View>
        <Text
          variant="bodyMedium"
          style={[
            {marginLeft: 20, color: theme?.colors.onSurface, fontWeight: '700'},
          ]}>
          {item.title}
        </Text>
      </Surface>
    </TouchableRipple>
  );

  return (
    <BottomSheet
      // style={{
      //   backgroundColor: theme?.colors.surface,
      // }}
      // containerStyle={{
      //   backgroundColor: theme?.colors.surface,
      // }}
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleStyle={{display: 'none'}}
      // backdropComponent={_renderBackdrop}
      onClose={() => setVisible(false)}
      onChange={_handleSheetChange}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            setVisible(false);
          }}
        />
        <Appbar.Content titleStyle={{fontWeight: '700'}} title="Select label" />
      </Appbar.Header>
      <Divider />
      <BottomSheetFlatList
        keyboardShouldPersistTaps={'always'}
        data={labels}
        renderItem={_renderLabels}
        style={{backgroundColor: theme?.colors.surface}}
        contentContainerStyle={{
          backgroundColor: theme?.colors.surface,
        }}
        ItemSeparatorComponent={() => <Divider />}
      />
    </BottomSheet>
  );
};
const enhanceSelectLabel = withObservables([], ({}) => ({
  labels: database.collections.get('labels').query().observe(),
}));
export const EnhancedLabelSelectBottomSheet = enhanceSelectLabel(
  LabelSelectBottomSheet,
);
