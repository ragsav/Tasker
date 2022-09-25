import AsyncStorage from '@react-native-async-storage/async-storage';
import {Logger} from './logger';

export class Storage {
  /**
   *
   * @param {string} key
   * @param {any} value
   */
  static storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      Logger.pageLogger('asyncStorage.js:storeData:catch', {error});
    }
  };
  /**
   *
   * @param {string} key
   * @returns
   */
  static getData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      Logger.pageLogger('asyncStorage.js:getData:catch', {error});
    }
  };
}
