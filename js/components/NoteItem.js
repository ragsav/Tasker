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
  Divider,
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
const NoteItem = ({note, tasks, tasksCount, handleDeleteNote, dispatch}) => {
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
    <View style={{padding: 4}}>
      <TouchableRipple
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: 10,
          width: '100%',
          borderColor:
            note && note.colorString ? note.colorString : theme?.colors.error,
          borderWidth: 1,
          borderRadius: 6,
          marginBottom: 10,
          flex: 1,
        }}
        onPress={note.isArchived ? null : _navigateToNoteScreen}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flex: 4,
            }}>
            <Text
              style={{fontSize: 18, fontWeight: '700'}}
              numberOfLines={1}
              ellipsizeMode="tail">
              {note?.title}
            </Text>
          </View>

          {tasks &&
            Array.isArray(tasks) &&
            tasks.slice(0, 6).map(task => {
              return <Text key={`note-tasks-${task.id}`}>{task.title}</Text>;
            })}

          <Text
            style={{
              textAlign: 'right',
              flex: 1,
              fontSize: 12,
              marginTop: 10,
            }}>
            {String(tasksCount) + '  tasks'}
          </Text>
        </View>
      </TouchableRipple>
    </View>
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
  tasks: database.collections
    .get('tasks')
    .query(
      Q.or(
        Q.where('is_marked_deleted', Q.eq(null)),
        Q.where('is_marked_deleted', Q.eq(false)),
      ),
      Q.where('is_archived', Q.notEq(!note.isArchived)),
      Q.where('note_id', note.id),
    )
    .observe(),
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
