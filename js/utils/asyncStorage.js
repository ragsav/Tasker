import AsyncStorage from '@react-native-async-storage/async-storage';

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
    } catch (e) {
      console.log(e);
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
    } catch (e) {
      console.log(e);
    }
  };
}
