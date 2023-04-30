import {sha256, sha256Bytes} from 'react-native-sha256';
export const getHash = async ({text}) => {
  try {
    const hash = await sha256(String(text));
    console.log({hash});
    return hash;
  } catch (error) {
    console.log({error});
  }
};
