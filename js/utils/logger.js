// import Toast from 'react-native-simple-toast';

export const PageLogger = (page, obj) => {
  console.log(`===========================${page}===========================`);
  console.log({obj});
};

export class Logger {
  static pageLogger = (page, obj) => {
    console.log(`-----> : ${page} |=====| `, obj);
  };
}
export const handleCopyToClipboard = value => {
  // Toast.show(`Copied to clipboard`);
};
