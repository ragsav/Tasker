import {getLinkPreview} from 'link-preview-js';
import * as React from 'react';
import {Linking, StyleSheet} from 'react-native';
import {Avatar, Button, Card, Paragraph, Title} from 'react-native-paper';

export const LinkPreview = React.memo(({text, requestTimeout = 2000}) => {
  const [data, setData] = React.useState();

  React.useEffect(() => {
    let isCancelled = false;
    setData(undefined);
    getLinkPreview(text).then(data => {
      setData(data);
    });
    return () => {
      isCancelled = true;
    };
  }, [text]);

  const handlePress = () => data?.link && Linking.openURL(data.link);

  return (
    <Card style={{margin: 12}} elevation={2}>
      <Card.Title
        title={data?.title}
        subtitle={data?.description}
        left={props =>
          data?.favicons &&
          Array.isArray(data.favicons) && (
            <Avatar.Image {...props} source={{uri: data.favicons[0]}} />
          )
        }
      />

      {data?.images && Array.isArray(data.images) && (
        <Card.Cover source={{uri: data.images[0]}} />
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  description: {
    marginTop: 4,
  },
  header: {
    marginBottom: 6,
  },
  image: {
    alignSelf: 'center',
    backgroundColor: '#f7f7f8',
  },
  metadataContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  metadataTextContainer: {
    flex: 1,
  },
  minimizedImage: {
    borderRadius: 12,
    height: 48,
    marginLeft: 4,
    width: 48,
  },
  textContainer: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  title: {
    fontWeight: 'bold',
  },
});
