import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  Surface,
  TextInput,
  useTheme,
  IconButton,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {IconSelectBottomSheet} from '../components/IconSelectBottomSheet';
import {database} from '../db/db';
import {editLabel, reseteditLabelState} from '../redux/actions';
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

  // variables
  const theme = useTheme();
  const {p_id, p_title, p_iconString} = route.params;

  // states
  const [labelState, setLabelState] = useState({title: '', iconString: null});
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
    dispatch(reseteditLabelState());
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
      editLabel({
        id: p_id,
        title: labelState.title,
        iconString: labelState.iconString,
      }),
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
        <Appbar.Content title="Edit label" />
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
          defaultValue={p_title}
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
