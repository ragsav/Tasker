// import Toast from 'react-native-simple-toast';

import {logger} from 'react-native-logs';

var log = logger.createLogger();
export class Logger {
  static pageLogger = (page, obj) => {
    if (!__DEV__) {
      return;
    }
    const _s = String(page);
    if (_s.includes('error') || _s.includes('catch')) {
      log.warn(_s, obj);
    } else {
      log.info(_s, obj);
    }
  };
}
