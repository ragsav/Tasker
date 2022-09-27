/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {
  Button,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {database} from '../db/db';
import Note from '../db/models/Note';
import {editNoteIsArchived} from '../redux/actions';

/**
 *
 * @param {object} param0
 * @param {Note} param0.note
 * @returns
 */
const NoteItem = ({note, tasksCount, handleDeleteNote, dispatch}) => {
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
    navigation?.navigate(CONSTANTS.ROUTES.NOTE, {
      p_id: note.id,
      p_title: note.title,
      p_colorString: note.colorString,
      p_labelID: note.labelID,
    });
  };

  // navigation functions
  const _handleUnarchiveNote = () => {
    dispatch(
      editNoteIsArchived({id: note.id, isArchived: false, unarchiveAll: false}),
    );
  };

  // misc functions

  // return

  return (
    <TouchableRipple
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingHorizontal: 12,
        paddingRight: 0,
        paddingVertical: note.isArchived ? 2 : 8,
        borderLeftColor:
          note && note.colorString ? note.colorString : theme?.colors.error,
        borderLeftWidth: 5,
      }}
      onPress={note.isArchived ? null : _navigateToNoteScreen}>
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
              color={theme?.colors.onSurface}
            />
          }
          <Text style={{marginLeft: 12}}>{note?.title}</Text>
        </View>

        {note.isArchived ? (
          <IconButton icon={'package-up'} onPress={_handleUnarchiveNote} />
        ) : (
          <Button>{tasksCount}</Button>
        )}
      </View>
    </TouchableRipple>
  );
};

const enhanceNoteItem = withObservables(['note'], ({note}) => ({
  note, // shortcut syntax for `comment: comment.observe()`
  // tasksCount: note.tasks.observeCount(
  //   Q.or(
  //     Q.where('is_marked_deleted', Q.eq(null)),
  //     Q.where('is_marked_deleted', Q.eq(false)),
  //   ),
  // ),
  tasksCount: database.collections
    .get('tasks')
    .query(
      Q.or(
        Q.where('is_marked_deleted', Q.eq(null)),
        Q.where('is_marked_deleted', Q.eq(false)),
      ),
      Q.where('is_archived', Q.notEq(!note.isArchived)),
      Q.where('note_id', note.id),
    )
    .observeCount(),
}));
const EnhancedNoteItem = enhanceNoteItem(NoteItem);
const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(EnhancedNoteItem);
