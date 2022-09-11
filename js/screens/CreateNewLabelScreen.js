import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  Surface,
  TextInput,
  IconButton,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {IconSelectBottomSheet} from '../components/IconSelectBottomSheet';
import {createLabel, resetCreateLabelState} from '../redux/actions';
const CreateNewLabelScreen = ({
  dispatch,
  navigation,
  isCreatingLabel,
  createLabelSuccess,
  createLabelFailure,
}) => {
  // ref

  // variables
  const theme = useTheme();

  // states
  const [labelState, setLabelState] = useState({title: '', iconString: null});
  const [isIconSelectionVisible, setIsIconSelectionVisible] = useState(false);

  // effects
  useFocusEffect(
    useCallback(() => {
      return _onDestroy;
    }, []),
  );
  useEffect(() => {
    if (createLabelSuccess) {
      _navigateBack();
    }
  }, [createLabelSuccess]);

  // callbacks

  // render functions

  // handle functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetCreateLabelState());
  };

  const _handleTitleChange = title => {
    setLabelState({...labelState, title});
  };
  const _handleOpenIconSelection = () => {
    setIsIconSelectionVisible(true);
  };
  const _handleOnIconChange = iconString => {
    setLabelState({...labelState, iconString});
  };

  const _handleSave = () => {
    dispatch(
      createLabel({title: labelState.title, iconString: labelState.iconString}),
    );
  };
  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions

  // return
  return (
    <SafeAreaView style={styles.main}>
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title="New label" />
      </Appbar.Header>
      <Surface style={styles.container}>
        <IconButton
          style={{backgroundColor: theme.colors.onSecondary, margin: 0}}
          icon={labelState.iconString ? labelState.iconString : 'label'}
          size={42}
          onPress={_handleOpenIconSelection}
        />
        <TextInput
          mode="outlined"
          label="Title"
          value={labelState.title}
          onChangeText={_handleTitleChange}
          style={{marginTop: 20}}
        />
        <Button mode="contained" style={{marginTop: 20}} onPress={_handleSave}>
          Save
        </Button>
      </Surface>
      <IconSelectBottomSheet
        visible={isIconSelectionVisible}
        setVisible={setIsIconSelectionVisible}
        selectedIcon={labelState.iconString}
        setSelectedIcon={_handleOnIconChange}
      />
    </SafeAreaView>
  );
};

const styles = new StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    height: '100%',
    width: '100%',
    padding: 12,
  },
});
const mapStateToProps = state => {
  return {
    isCreatingLabel: state.label.isCreatingLabel,
    createLabelSuccess: state.label.createLabelSuccess,
    createLabelFailure: state.label.createLabelFailure,
  };
};
export default connect(mapStateToProps)(CreateNewLabelScreen);
