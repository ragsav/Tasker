/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import RNBootSplash from 'react-native-bootsplash';
import {connect} from 'react-redux';
import Home from '../screens/Home';
import {CustomLightTheme} from '../../themes';
import {CONSTANTS} from '../../constants';
import CreateNewLabelScreen from '../screens/CreateNewLabelScreen';
import {useTheme} from 'react-native-paper';
import CreateNewNoteScreen from '../screens/CreateNewNoteScreen';
import EditLabelScreen from '../screens/EditLabelScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import NoteScreen from '../screens/NoteScreen';
import DayScreen from '../screens/DayScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import TaskScreen from '../screens/TaskScreen';
import CalendarScreen from '../screens/CalendarScreen';

const Stack = createStackNavigator();

const Router = () => {
  // ref

  // variables
  const theme = useTheme();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions

  // navigation functions

  // misc functions

  // return
  return (
    <NavigationContainer theme={theme} onReady={() => RNBootSplash.hide()}>
      <Stack.Navigator
        initialRouteName={CONSTANTS.ROUTES.HOME}
        screenOptions={{...TransitionPresets.SlideFromRightIOS}}>
        <Stack.Screen
          name={CONSTANTS.ROUTES.HOME}
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.ADD_LABEL}
          component={CreateNewLabelScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.EDIT_LABEL}
          component={EditLabelScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.ADD_NOTE}
          component={CreateNewNoteScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.EDIT_NOTE}
          component={EditNoteScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.NOTE}
          component={NoteScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.MY_DAY}
          component={DayScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.BOOKMARKS}
          component={BookmarkScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.TASK}
          component={TaskScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CONSTANTS.ROUTES.CALENDAR}
          component={CalendarScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = state => {
  return {};
};
export default connect(mapStateToProps)(Router);
