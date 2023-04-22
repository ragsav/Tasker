/**
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import {TransitionPresets} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {Provider as PaperProvider} from 'react-native-paper';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import AllTaskScreen from '../screens/AllTaskScreen';
import ArchivedNotesScreen from '../screens/ArchivedNotesScreen';
import BackupConfigScreen from '../screens/BackupConfigScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CompletedScreen from '../screens/CompletedScreen';
import CreateNewLabelScreen from '../screens/CreateNewLabelScreen';
import CreateNewNoteScreen from '../screens/CreateNewNoteScreen';
import DayScreen from '../screens/DayScreen';
import DeletedTasksScreen from '../screens/DeletedTasksScreen';
import EditLabelScreen from '../screens/EditLabelScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import LabelScreen from '../screens/LabelScreen';
import NoteScreen from '../screens/NoteScreen';
import PinScreen from '../screens/PinScreen';
import {SearchScreen} from '../screens/SearchScreen';
import Settings from '../screens/Settings';
import TaskScreen from '../screens/TaskScreen';
import EnhancedDrawerBasedNavigation from './DrawerBasedNavigator';
import PermissionsProvider from './PermissionsProvider';
// const Stack = createStackNavigator();
const Stack = createSharedElementStackNavigator();
const opacityTransition = {
  gestureDirection: 'horizontal', // we will swipe right if we want to close the screen;
  transitionSpec: {
    open: {
      animation: 'timing',
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200,
      },
    },
  },
  cardStyleInterpolator: ({current}) => ({
    cardStyle: {
      opacity: current.progress,
    }, // updates the opacity depending on the transition progress value of the current screen
  }),
};
const Router = ({theme, defaultHomeScreen, dispatch}) => {
  // ref

  // variables
  // const theme = useTheme();

  // states

  // effects
  useEffect(() => {}, []);

  // callbacks

  // render functions

  // handle functions

  // navigation functions

  // misc functions

  // return
  return (
    <PermissionsProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={theme?.statusBarStyle}
          backgroundColor={theme?.colors.surface}
          // translucent
        />

        <NavigationContainer
          theme={theme}
          onReady={() => {
            RNBootSplash.hide();
          }}>
          <Stack.Navigator
            initialRouteName={CONSTANTS.ROUTES.LABEL_DRAWER}
            screenOptions={{...TransitionPresets.ScaleFromCenterAndroid}}>
            <Stack.Screen
              name={CONSTANTS.ROUTES.LABEL_DRAWER}
              component={EnhancedDrawerBasedNavigation}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name={CONSTANTS.ROUTES.LABEL}
              component={LabelScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={CONSTANTS.ROUTES.PINNED_NOTES}
              component={PinScreen}
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
              sharedElements={(route, otherRoute, showing) => {
                const {p_id} = route.params;
                return [`note.${p_id}.hero`];
              }}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={CONSTANTS.ROUTES.MY_DAY}
              component={DayScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={CONSTANTS.ROUTES.ALL_TASKS}
              component={AllTaskScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={CONSTANTS.ROUTES.COMPLETED}
              component={CompletedScreen}
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
            <Stack.Screen
              name={CONSTANTS.ROUTES.SEARCH}
              component={SearchScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={CONSTANTS.ROUTES.SETTINGS}
              component={Settings}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={CONSTANTS.ROUTES.DELETED_TASKS}
              component={DeletedTasksScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={CONSTANTS.ROUTES.ARCHIVED_NOTES}
              component={ArchivedNotesScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={CONSTANTS.ROUTES.BACKUP}
              component={BackupConfigScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </PermissionsProvider>
  );
};

const mapStateToProps = state => {
  return {
    // theme: state.settings.theme,
    defaultHomeScreen: state.settings.defaultHomeScreen,
  };
};
export default connect(mapStateToProps)(Router);
