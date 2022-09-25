import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  HelperText,
  Surface,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {EnhancedLabelSelectBottomSheet} from '../components/LabelSelectBottomSheet';
import {createNote, resetCreateNoteState} from '../redux/actions';

const CreateNewNoteScreen = ({
  dispatch,
  navigation,
  isCreatingNote,
  createNoteSuccess,
  createNoteFailure,
}) => {
  // ref
  const titleRef = useRef();
  const labelSelectRef = useRef();

  // variables
  const theme = useTheme();
  // states
  const [noteState, setNoteState] = useState({
    title: '',
    colorString: null,
    description: '',
    label: null,
  });
  const [error, setError] = useState(null);
  const [isLabelSelectionVisible, setIsLabelSelectionVisible] = useState(false);

  // effects
  useFocusEffect(
    useCallback(() => {
      return _onDestroy;
    }, []),
  );
  useEffect(() => {
    if (createNoteSuccess) {
      _navigateBack();
    }
  }, [createNoteSuccess]);

  // callbacks

  // render functions
  const _renderColorItem = ({item}) => {
    return (
      <Pressable
        rippleColor={`${item}30`}
        onPress={() => {
          _handleOnColorClick(item);
        }}
        style={{
          backgroundColor: item,
          height: 40,
          width: 40,
          marginRight: 6,
          borderRadius: 20,
          borderWidth: 2,
          borderColor:
            noteState.colorString === item
              ? `${theme?.colors.onSurface}`
              : '#00000000',
        }}></Pressable>
    );
  };

  // handle functions
  const _init = () => {};
  const _onDestroy = () => {
    dispatch(resetCreateNoteState());
  };

  const _handleTitleChange = title => {
    setNoteState({...noteState, title});
  };

  const _handleDescriptionChange = description => {
    setNoteState({...noteState, description});
  };
  const _handleOnColorClick = colorString => {
    setNoteState({...noteState, colorString});
  };

  const _handleOpenLabelSelection = () => {
    setIsLabelSelectionVisible(true);
  };

  const _handleOnLabelChange = label => {
    setNoteState({...noteState, label});
  };

  const _handleSave = () => {
    if (
      !noteState ||
      !noteState.title ||
      String(noteState.title).trim() === ''
    ) {
      setError('Title cannot be empty');
    } else {
      setError(null);
      dispatch(
        createNote({
          title: noteState.title,
          labelID: noteState.label ? noteState.label.id : '',
          colorString: noteState.colorString,
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
        <Appbar.Content title="New note" titleStyle={{fontWeight: '700'}} />
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
        <TextInput
          ref={titleRef}
          mode="outlined"
          label="Title"
          value={noteState.title}
          onChangeText={_handleTitleChange}
          outlineColor={theme?.colors.primary}
        />
        {error && (
          <HelperText style={{marginTop: 4, paddingLeft: 2}} type="error">
            {error}
          </HelperText>
        )}
        <TextInput
          ref={labelSelectRef}
          mode="outlined"
          focusable={false}
          label="Note"
          value={noteState.label ? noteState.label.title : ''}
          showSoftInputOnFocus={false}
          style={{marginTop: 12}}
          onPressIn={_handleOpenLabelSelection}
          outlineColor={theme?.colors.primary}
          caretHidden
        />
        <FlatList
          data={CONSTANTS.NOTE_COLORS}
          renderItem={_renderColorItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 20, flexGrow: 0}}
        />
        <Button mode="contained" style={{marginTop: 20}} onPress={_handleSave}>
          Save
        </Button>
      </Surface>
      <EnhancedLabelSelectBottomSheet
        visible={isLabelSelectionVisible}
        setVisible={setIsLabelSelectionVisible}
        selectedLabel={noteState.label}
        setSelectedLabel={_handleOnLabelChange}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    isCreatingNote: state.note.isCreatingNote,
    createNoteSuccess: state.note.createNoteSuccess,
    createNoteFailure: state.note.createNoteFailure,
  };
};
export default connect(mapStateToProps)(CreateNewNoteScreen);
