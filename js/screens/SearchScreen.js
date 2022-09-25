import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {Appbar, Searchbar, useTheme} from 'react-native-paper';

import {useEffect} from 'react';
import TaskItem from '../components/TaskItem';
import Task from '../db/models/Task';
import {getTaskByQuery} from '../redux/actions';

/**
 *
 * @param {object} param0
 * @param {Search} param0.note
 * @returns
 */
export const SearchScreen = ({navigation}) => {
  // ref

  // variables
  const theme = useTheme();

  // states
  const [query, setQuery] = useState('');
  const [tasks, setTasks] = useState([]);

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  useEffect(() => {
    if (query === '' || !query || query === undefined) {
      return;
    } else {
      getTaskByQuery(query).then(value => {
        setTasks(value);
      });
    }
  }, [query]);

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

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {};

  // return
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <Appbar.Header>
        <Searchbar
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholder="Search"
          icon="arrow-left"
          iconColor={theme?.colors.onSurface}
          onIconPress={_navigateBack}
          elevation={1}
          style={{margin: 8, backgroundColor: theme?.colors.surface}}
        />
      </Appbar.Header>
      <FlatList
        renderItem={_renderTaskItem}
        data={tasks}
        contentContainerStyle={{
          padding: 12,
        }}
      />

      {/* <Surface style={styles.container}></Surface> */}
    </SafeAreaView>
  );
};
