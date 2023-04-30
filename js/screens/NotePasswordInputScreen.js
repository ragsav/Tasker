import {Animated, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  HelperText,
  Paragraph,
  TextInput,
  useTheme,
} from 'react-native-paper';
import React, {useRef} from 'react';
import {useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
export const NotePasswordInputScreen = ({
  passwordScreenState,
  handleCheckPassword,
}) => {
  // ref
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // variables
  const navigation = useNavigation();
  const theme = useTheme();

  // states
  const [password, setPassword] = useState('');

  // effects
  useFocusEffect(
    useCallback(() => {
      _init();
      return _onDestroy;
    }, []),
  );

  // callbacks

  // render functions

  // handle functions
  const _handleSubmitPassword = () => {
    handleCheckPassword({password});
  };

  // navigation functions

  // misc functions
  const _init = () => {
    _fadeIn();
  };
  const _onDestroy = () => {
    _fadeOut();
  };
  const _navigateBack = () => {
    navigation?.pop();
  };
  const _fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const _fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // return

  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <Animated.View
        style={[
          {
            // Bind opacity to animated value
            flex: 1,
            opacity: fadeAnim,
          },
        ]}>
        <Appbar.Header
          style={{
            backgroundColor: theme?.colors.surface,
          }}>
          <Appbar.BackAction onPress={_navigateBack} />
          <Appbar.Content />
        </Appbar.Header>
        <View
          style={{
            flex: 1,
            padding: 10,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          {passwordScreenState.isLoading ? (
            <ActivityIndicator />
          ) : (
            <View
              style={{
                flex: 1,
                padding: 10,
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}>
              <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                mode="outlined"
                autoFocus={true}
                onSubmitEditing={_handleSubmitPassword}
                error={passwordScreenState.error}
              />
              {passwordScreenState.error && (
                <Paragraph style={{marginTop: 6, color: theme?.colors.error}}>
                  {passwordScreenState.error}
                </Paragraph>
              )}
            </View>
          )}
          <Button mode="contained" onPress={_handleSubmitPassword}>
            Submit
          </Button>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
