/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import withObservables from '@nozbe/with-observables';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {
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
import {DeleteConfirmationDialog} from './DeleteConfirmationDialog';
import EnhancedNoteItem from './NoteItem';

/**
 *
 * @param {object} param0
 * @param {Label} param0.label
 * @returns
 */
const LabelItem = ({label, notes, handleDeleteLabel, handleUnGroupLabel}) => {
  // ref

  // variables
  const theme = useTheme();
  const navigation = useNavigation();

  // states
  const [collapsed, setCollapsed] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // effects
  // useEffect(() => {
  // 	navigation.setOptions({
  // 		p_id: label.id,
  //     p_title: label.title,
  //     p_iconString: label.iconString,
  // 	});
  // }, [isMasterDetail, navigation]);

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
  const _handleToggleCollapse = () => setCollapsed(!collapsed);
  const _handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const _handleLongPressLabel = () => {};
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
      onPress={_handleToggleCollapse}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}>
        <DeleteConfirmationDialog
          visible={isDeleteDialogOpen}
          message="label"
          handleCancel={_handleCloseDeleteLabelDialog}
          handleDelete={_handleDeleteLabel}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            {
              <MaterialCommunityIcons
                name={label && label.iconString ? label.iconString : 'label'}
                size={24}
                color={theme?.colors.onSurface}
              />
            }
            <Text
              style={{marginLeft: 12, fontWeight: collapsed ? '400' : '700'}}>
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
                !collapsed && (
                  <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={_handleToggleMenu}
                  />
                )
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
            {/* {_renderMenu()} */}
            <IconButton
              icon={collapsed ? 'chevron-down' : 'chevron-up'}
              size={24}
              onPress={_handleToggleCollapse}
            />
          </View>
        </View>

        <Collapsible collapsed={collapsed} style={{paddingLeft: 20}}>
          <Divider />
          {notes.map((note, index) => {
            return <EnhancedNoteItem note={note} key={index} />;
          })}
          <Divider />
        </Collapsible>
      </View>
    </TouchableRipple>
  );
};

const enhanceLabelItem = withObservables(['label'], ({label}) => ({
  label, // shortcut syntax for `comment: comment.observe()`
  notes: label.notes,
  notes: database.collections
    .get('notes')
    .query(Q.where('is_archived', Q.notEq(true)), Q.where('label_id', label.id))
    .observe(),
}));
export const EnhancedLabelItem = enhanceLabelItem(LabelItem);
