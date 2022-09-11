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
import {Pressable, StyleSheet, TouchableHighlight, View} from 'react-native';
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
import Note from '../db/models/Note';
import {DeleteConfirmationDialog} from './DeleteConfirmationDialog';

/**
 *
 * @param {object} param0
 * @param {Note} param0.note
 * @returns
 */
const NoteItem = ({note, tasksCount, handleDeleteNote}) => {
  // ref

  // variables
  const theme = useTheme();
  const navigation = useNavigation();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions

  const _navigateToNoteScreen = () => {
    console.log({note: note.colorString});
    navigation?.navigate(CONSTANTS.ROUTES.NOTE, {
      p_id: note.id,
      p_title: note.title,
      p_colorString: note.colorString,
      p_labelID: note.labelID,
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
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderLeftColor:
          note && note.colorString ? note.colorString : theme.colors.error,
        borderLeftWidth: 3,
      }}
      onPress={_navigateToNoteScreen}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          {
            <MaterialCommunityIcons
              name={'format-list-bulleted'}
              size={24}
              color={theme.colors.onSurface}
            />
          }
          <Text style={{marginLeft: 12}}>{note?.title}</Text>
        </View>

        <Text style={{marginLeft: 12}}>{tasksCount}</Text>
      </View>
    </TouchableRipple>
  );
};

const enhanceNoteItem = withObservables(['note'], ({note}) => ({
  note, // shortcut syntax for `comment: comment.observe()`
  tasksCount: note.tasks.observeCount(),
}));
export const EnhancedNoteItem = enhanceNoteItem(NoteItem);

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
