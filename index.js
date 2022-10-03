/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {NewActivityDemo} from './js/screens/NewActivityDemo';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('ReminderActivity', () => NewActivityDemo);
