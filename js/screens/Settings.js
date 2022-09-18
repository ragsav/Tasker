import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Divider,
  List,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {resetDeleteNoteState, setTheme} from '../redux/actions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {_customDarkTheme, _customLightTheme} from '../../themes';
import {useEffect} from 'react';
/**
 *
 * @param {object} param0
 * @returns
 */
const Settings = ({navigation, dispatch}) => {
  // ref

  // variables
  const theme = useTheme();

  // states

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
  const _handleToggleTheme = () => {
    if (theme.dark) {
      dispatch(setTheme({theme: _customLightTheme}));
    } else {
      dispatch(setTheme({theme: _customDarkTheme}));
    }
  };

  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions
  const _init = () => {};
  const _onDestroy = () => {};

  // return
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
        height: 300,
      }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title={'Settings'} titleStyle={{fontWeight: '700'}} />
      </Appbar.Header>
      <ScrollView>
        <List.Item
          title="My calendar"
          left={props => (
            <List.Icon
              {...props}
              icon="palette"
              color={theme.colors.onSurface}
            />
          )}
          right={props => (
            <Switch value={theme.dark} onValueChange={_handleToggleTheme} />
          )}
        />

        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};

// const enhanceSettings = withObservables([], ({}) => ({}));
// const EnhancedSettings = enhanceSettings(Settings);

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(Settings);

const styles = new StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: '100%',
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});
