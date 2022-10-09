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
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import {SharedElement} from 'react-navigation-shared-element';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {database} from '../db/db';
import Note from '../db/models/Note';
import Task from '../db/models/Task';
import {editNoteIsArchived} from '../redux/actions';

/**
 *
 * @param {object} param0
 * @param {Note} param0.note
 * @param {Array<Task>} param0.tasks
 * @returns
 */
const PinnedNoteItem = ({note, tasks, handleDeleteNote, dispatch}) => {
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

  // return

  return (
    <View style={{padding: 6}}>
      <TouchableRipple
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',

          borderRadius: 6,
          width: '100%',
          borderColor:
            note && note.colorString ? note.colorString : theme?.colors.error,
          borderWidth: 1,
          backgroundColor: 'white',
        }}
        onPress={note.isArchived ? null : _navigateToNoteScreen}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingHorizontal: 8,
            paddingVertical: 6,
          }}>
          <SharedElement id={`note.${note.id}.hero`}>
            <Text
              variant="bodyMedium"
              style={{fontWeight: '700', marginBottom: 8}}
              numberOfLines={1}
              ellipsizeMode="tail">
              {note?.title}
            </Text>
          </SharedElement>

          {tasks &&
            Array.isArray(tasks) &&
            tasks.map(task => {
              return (
                <Text
                  style={{fontSize: 12}}
                  key={task.id}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {task?.title}
                </Text>
              );
            })}
        </View>
      </TouchableRipple>
    </View>
  );
};

const enhancePinnedNoteItem = withObservables(['note'], ({note}) => ({
  note, // shortcut syntax for `comment: comment.observe()`
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
}));
const EnhancedPinnedNoteItem = enhancePinnedNoteItem(PinnedNoteItem);
const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(EnhancedPinnedNoteItem);
