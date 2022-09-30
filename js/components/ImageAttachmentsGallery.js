import {FlatList, Image, Pressable, View} from 'react-native';
import React from 'react';
import {Text, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState} from 'react';
import {useEffect} from 'react';

export const ImageAttachmentGallery = ({
  URIs,
  removeURI,
  imageToView,
  setImageToView,
}) => {
  const theme = useTheme();

  const _renderURIImages = ({item, index}) => {
    const _split = String(item).split('/');

    return (
      <Pressable
        style={{position: 'relative', marginRight: 12}}
        onPress={() =>
          setImageToView({
            images: URIs?.map(uri => {
              return {uri};
            }),
            index: index,
            visible: true,
          })
        }>
        <Image
          source={{uri: item}}
          style={{height: 120, width: 200, borderRadius: 6}}
        />
        <Pressable
          onPress={() => removeURI(item)}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,

            backgroundColor: theme?.colors.backdrop,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 6,
            borderRadius: 20,
          }}>
          <MaterialCommunityIcons
            name="close"
            color={theme?.colors.surface}
            size={12}
            style={{padding: 0}}
          />
        </Pressable>
      </Pressable>
    );
  };
  return (
    <View>
      <FlatList
        data={URIs}
        horizontal={true}
        contentContainerStyle={{padding: 12}}
        renderItem={_renderURIImages}
        keyExtractor={(item, index) => item}
      />
    </View>
  );
};
