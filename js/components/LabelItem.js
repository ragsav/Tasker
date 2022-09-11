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
import {StyleSheet, View} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {Menu, MenuItem} from 'react-native-material-menu';
import {
  Divider,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CONSTANTS} from '../../constants';
import Label from '../db/models/Label';
import {DeleteConfirmationDialog} from './DeleteConfirmationDialog';
import {EnhancedNoteItem} from './NoteItem';

/**
 *
 * @param {object} param0
 * @param {Label} param0.label
 * @returns
 */
const LabelItem = ({label, notes, handleDeleteLabel}) => {
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
  const _renderMenu = () => {
    return (
      <Menu visible={isMenuOpen} onRequestClose={_handleToggleMenu}>
        <MenuItem onPress={_handleOpenDeleteLabelDialog}>Delete label</MenuItem>
        <MenuItem onPress={_navigateToEditLabelScreen}>Edit label</MenuItem>
        <MenuItem disabled onPress={_handleToggleMenu}>
          Ungroup label
        </MenuItem>
      </Menu>
    );
  };

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
                color={theme.colors.onSurface}
              />
            }
            <Text style={{marginLeft: 12}}>{label?.title}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            {!collapsed && (
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={_handleToggleMenu}
                // onPress={_navigateToEditLabelScreen}
              />
            )}
            {_renderMenu()}
            <IconButton
              icon={collapsed ? 'chevron-down' : 'chevron-up'}
              size={24}
              onPress={_handleToggleCollapse}
            />
          </View>
        </View>
        <Collapsible collapsed={collapsed} style={{paddingLeft: 20}}>
          {notes.map((note, index) => {
            return <EnhancedNoteItem note={note} key={index} />;
          })}
        </Collapsible>
        <Divider />
      </View>
    </TouchableRipple>
  );
};

const enhanceLabelItem = withObservables(['label'], ({label}) => ({
  label, // shortcut syntax for `comment: comment.observe()`
  notes: label.notes,
}));
export const EnhancedLabelItem = enhanceLabelItem(LabelItem);

const styles = StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    right: 16,
    padding: 0,
  },
});
