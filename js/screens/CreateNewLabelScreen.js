import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  HelperText,
  IconButton,
  Surface,
  TextInput,
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
  const titleRef = useRef();

  // variables
  const theme = useTheme();

  // states
  const [labelState, setLabelState] = useState({title: '', iconString: null});
  const [error, setError] = useState(null);
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
    if (
      !labelState ||
      !labelState.title ||
      String(labelState.title).trim() === ''
    ) {
      setError('Title cannot be empty');
    } else {
      setError(null);
      dispatch(
        createLabel({
          title: labelState.title,
          iconString: labelState.iconString,
        }),
      );
    }
  };
  // navigation functions
  const _navigateBack = () => {
    navigation?.pop();
  };

  // misc functions

  // return
  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title="New label" titleStyle={{fontWeight: '700'}} />
      </Appbar.Header>
      <Surface
        style={{
          height: '100%',
          width: '100%',
          padding: 12,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: theme?.colors.surface,
        }}>
        <IconButton
          style={{backgroundColor: theme?.colors.surfaceVariant, margin: 0}}
          icon={labelState.iconString ? labelState.iconString : 'label'}
          size={42}
          onPress={_handleOpenIconSelection}
        />
        <TextInput
          ref={titleRef}
          mode="outlined"
          label="Title"
          value={labelState.title}
          onChangeText={_handleTitleChange}
          style={{marginTop: 20}}
          outlineColor={theme?.colors.primary}
        />
        {error && (
          <HelperText style={{marginTop: 4, paddingLeft: 2}} type="error">
            {error}
          </HelperText>
        )}
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

const mapStateToProps = state => {
  return {
    isCreatingLabel: state.label.isCreatingLabel,
    createLabelSuccess: state.label.createLabelSuccess,
    createLabelFailure: state.label.createLabelFailure,
  };
};
export default connect(mapStateToProps)(CreateNewLabelScreen);
