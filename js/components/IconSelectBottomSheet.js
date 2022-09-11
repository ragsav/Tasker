import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Appbar,
  Divider,
  Surface,
  TouchableRipple,
  Text,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CONSTANTS} from '../../constants';
import {IconsData} from '../../icons';
import {CustomLightTheme} from '../../themes';

export const IconSelectBottomSheet = ({
  visible,
  setVisible,
  selectedIcon,
  setSelectedIcon,
}) => {
  // hooks
  const sheetRef = useRef(null);

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
  const _renderIcons = ({item}) => (
    <TouchableRipple
      rippleColor={CustomLightTheme.colors.elevation.level5}
      style={{
        backgroundColor: CustomLightTheme.colors.surface,
      }}
      onPress={() => {
        setSelectedIcon(item);
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
          style={[
            styles.transaction_category_avatar_icon,
            {
              backgroundColor:
                item === selectedIcon
                  ? CustomLightTheme.colors.onPrimary
                  : CustomLightTheme.colors.surfaceVariant,
            },
          ]}>
          <MaterialCommunityIcons
            name={item}
            size={32}
            color={
              item === selectedIcon
                ? CustomLightTheme.colors.inversePrimary
                : CustomLightTheme.colors.onPrimary
            }
          />
        </View>
        <Text
          style={[{marginLeft: 20, color: CustomLightTheme.colors.onSurface}]}>
          {item}
        </Text>
      </Surface>
    </TouchableRipple>
  );

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
        <Appbar.Content titleStyle={{fontSize: 18}} title="Transaction Icons" />
      </Appbar.Header>
      <Divider />
      <BottomSheetFlatList
        data={IconsData}
        keyExtractor={i => i}
        renderItem={_renderIcons}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <Divider />}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  transaction_category_item_container: {
    padding: 6,
    backgroundColor: CONSTANTS.COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopColor: CONSTANTS.COLORS.LIGHT_FONT,
    borderTopWidth: 1,
  },
  transaction_category_filter_title: {
    width: '100%',

    color: CONSTANTS.COLORS.DARK_FONT,
    fontWeight: '500',
    fontSize: 16,
    padding: 6,
    borderBottomColor: CONSTANTS.COLORS.LIGHT_FONT,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  transaction_category_avatar_icon: {
    borderColor: CONSTANTS.COLORS.LIGHT_FONT,
    backgroundColor: CONSTANTS.COLORS.LIGHT_100,

    borderRadius: 8,
    padding: 16,
  },
});