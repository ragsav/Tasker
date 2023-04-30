/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import withObservables from '@nozbe/with-observables';
import {Q} from '@nozbe/watermelondb';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {
  Button,
  Divider,
  IconButton,
  Menu,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CONSTANTS} from '../../constants';
import {database} from '../db/db';
import Label from '../db/models/Label';
import {ConfirmationDialog} from './ConfirmationDialog';
import EnhancedNoteItem from './NoteItem';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideInLeft,
  SlideInUp,
  Transition,
} from 'react-native-reanimated';

/**
 *
 * @param {object} param0
 * @param {Label} param0.label
 * @returns
 */
const LabelItem = ({label, handleDeleteLabel, handleUnGroupLabel}) => {
  // ref

  // variables
  const theme = useTheme();
  const navigation = useNavigation();

  // states

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // effects

  // callbacks

  // render functions

  // handle functions
  const _handleOpenDeleteLabelDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };
  const _handleCloseDeleteLabelDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const _handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const _handleDeleteLabel = () => {
    handleDeleteLabel(label.id);
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
  };
  const _handleUnGroupLabel = () => {
    handleUnGroupLabel(label.id);
    setIsMenuOpen(false);
  };
  const _navigateToEditLabelScreen = () => {
    setIsMenuOpen(false);
    navigation?.navigate(CONSTANTS.ROUTES.EDIT_LABEL, {
      p_id: label.id,
      p_title: label.title,
      p_iconString: label.iconString,
    });
    // navigation?.navigate(CONSTANTS.ROUTES.ADD_LABEL);
  };

  const _navigateToLabelScreen = () => {
    navigation?.navigate(CONSTANTS.ROUTES.LABEL, {
      p_id: label.id,
    });
  };

  // navigation functions

  // misc functions

  // return

  return (
    <TouchableRipple
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}
      onPress={_navigateToLabelScreen}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}>
        <ConfirmationDialog
          visible={isDeleteDialogOpen}
          title="Delete this label?"
          message="Are you sure you want to delete this label? This action is irreversible "
          handleCancel={_handleCloseDeleteLabelDialog}
          handleOk={_handleDeleteLabel}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 16,
            paddingRight: 4,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            {true && (
              <MaterialCommunityIcons
                name={label && label.iconString ? label.iconString : 'label'}
                size={24}
                style={{marginRight: 12}}
                color={theme?.colors.onSurface}
              />
            )}

            {/* <AnimatedComponent layout={Transition.duration(3000).otherModifier()} ></AnimatedComponent> */}
            <Text
              style={{
                fontWeight: '700',
              }}>
              {label?.title}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <Menu
              visible={isMenuOpen}
              onDismiss={_handleToggleMenu}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  onPress={_handleToggleMenu}
                />
              }>
              <Menu.Item
                title="Edit"
                leadingIcon={'pencil'}
                onPress={_navigateToEditLabelScreen}
              />
              <Menu.Item
                onPress={_handleOpenDeleteLabelDialog}
                title="Delete"
                leadingIcon={'delete'}
              />
              <Menu.Item
                title="Ungroup label"
                leadingIcon={'ungroup'}
                onPress={_handleUnGroupLabel}
              />
            </Menu>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const enhanceLabelItem = withObservables(['label'], ({label}) => ({
  label, // shortcut syntax for `comment: comment.observe()`
}));
export const EnhancedLabelItem = enhanceLabelItem(LabelItem);
