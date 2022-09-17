import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {Appbar, Menu} from 'react-native-paper';
import {connect} from 'react-redux';
import TaskItem from '../components/TaskItem';
import {database} from '../db/db';
import Task from '../db/models/Task';
import {resetDeleteNoteState} from '../redux/actions';

/**
 *
 * @param {object} param0
 * @param {Array<Task>} param0.tasks
 * @returns
 */
const DayScreen = ({navigation, tasks, deleteNoteSuccess, dispatch}) => {
  // ref

  // variables
  const theme = useTheme();

  // states
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  useEffect(() => {
    if (deleteNoteSuccess) {
      _navigateBack();
    }
  }, [deleteNoteSuccess]);

  // callbacks

  // render functions
  /**
   *
   * @param {object} param0
   * @param {Task} param0.item
   * @returns
   */
  const _renderTaskItem = ({item, drag, isActive}) => {
    return <TaskItem task={item} disabled={isActive} onLongPress={drag} />;
  };

  // handle functions

  const _handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetDeleteNoteState());
  };

  // return
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.surface,
      }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title={'My day'} titleStyle={{fontWeight: '700'}} />

        <Menu
          visible={isMenuOpen}
          onDismiss={_handleToggleMenu}
          anchor={
            <Appbar.Action icon={'dots-vertical'} onPress={_handleToggleMenu} />
          }>
          <Menu.Item title="Mark all done" leadingIcon={'check-all'} />
          <Menu.Item onPress={() => {}} title="Sort by" leadingIcon={'sort'} />
        </Menu>
      </Appbar.Header>

      <FlatList
        contentContainerStyle={{padding: 12}}
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={_renderTaskItem}
      />
    </SafeAreaView>
  );
};
const s = new Date();
const e = new Date();
s.setHours(0, 0, 0, 0);
e.setHours(23, 59, 59, 999);

const enhanceDayScreen = withObservables([], ({}) => ({
  tasks: database.collections
    .get('tasks')
    .query(Q.where('end_timestamp', Q.between(s.getTime(), e.getTime()))),
}));
const EnhancedDayScreen = enhanceDayScreen(DayScreen);

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(EnhancedDayScreen);

const styles = new StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: '100%',
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});
