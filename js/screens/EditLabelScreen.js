import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useRef} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  IconButton,
  Surface,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {IconSelectBottomSheet} from '../components/IconSelectBottomSheet';
import {editLabel, resetEditLabelState} from '../redux/actions';
const EditLabelScreen = ({
  dispatch,
  navigation,
  isUpdatingLabel,
  editLabelSuccess,
  editLabelFailure,
  route,
  label,
}) => {
  // ref
  const titleRef = useRef();

  // variables
  const theme = useTheme();
  const {p_id, p_title, p_iconString} = route.params;

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
  useFocusEffect(
    useCallback(() => {
      if (p_title) {
        setLabelState({title: p_title, iconString: p_iconString});
      }
    }, [p_title, p_iconString]),
  );
  useEffect(() => {
    if (editLabelSuccess) {
      _navigateBack();
    }
  }, [editLabelSuccess]);

  // callbacks

  // render functions

  // handle functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetEditLabelState());
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
        editLabel({
          id: p_id,
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
        <Appbar.Content title="Edit label" titleStyle={{fontWeight: '700'}} />
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
          defaultValue={p_title}
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
// const enhanceEditLabel = withObservables(['route'], ({route}) => ({
//   label: database.collections.get('labels').findAndObserve(route.p_id),
// }));
// const EnhancedEditLabel = enhanceEditLabel(EditLabelScreen);
const mapStateToProps = state => {
  return {
    isUpdatingLabel: state.label.isUpdatingLabel,
    editLabelSuccess: state.label.editLabelSuccess,
    editLabelFailure: state.label.editLabelFailure,
  };
};
export default connect(mapStateToProps)(EditLabelScreen);
