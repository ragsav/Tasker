import {getLinkPreview} from 'link-preview-js';
import React, {useEffect, useState} from 'react';
import {Image, Linking, View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {Logger} from '../utils/logger';

export const LinkPreview = ({text, requestTimeout = 2000}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    setData(undefined);
    getLinkPreview(text).then(data => {
      setData(data);
    });
    return () => {
      isCancelled = true;
    };
  }, [text]);

  // useEffect(() => {
  //   Logger.pageLogger('URLPreview.js:useEffect', {data});
  // }, [data]);

  const handlePress = () => data?.link && Linking.openURL(data.link);

  return data ? (
    <Surface
      style={{flexDirection: 'row', margin: 12, borderRadius: 4}}
      mode="outlined">
      {data?.images && Array.isArray(data.images) && (
        <Image
          style={{flex: 1, height: 100, width: 100, borderRadius: 4}}
          resizeMode="cover"
          source={{uri: data.images[0]}}
        />
      )}
      <View
        style={{
          flexDirection: 'column',
          flex: 3,
          padding: 12,
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={{fontWeight: '600'}}>
          {data?.title}
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={3}
          style={{fontWeight: '400', fontSize: 12}}>
          {data?.description}
        </Text>
      </View>
    </Surface>
  ) : (
    <></>
  );
};
