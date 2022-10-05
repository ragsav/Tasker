/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {ReminderClickScreen} from './js/screens/ReminderClickScreen';

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => ReminderClickScreen);
AppRegistry.registerComponent('ReminderActivity', () => ReminderClickScreen);
