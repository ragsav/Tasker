import withObservables from '@nozbe/with-observables';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Surface,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {CONSTANTS} from '../../constants';
import {EnhancedLabelSelectBottomSheet} from '../components/LabelSelectBottomSheet';
import {database} from '../db/db';
import Label from '../db/models/Label';
import {editNote, getLabelByID, resetEditNoteState} from '../redux/actions';

const EditNoteScreen = ({
  dispatch,
  navigation,
  isEditingNote,
  editNoteSuccess,
  editNoteFailure,
  route,
}) => {
  // ref
  const titleRef = useRef();
  const labelSelectRef = useRef();

  // variables
  const theme = useTheme();
  const {p_id, p_title, p_colorString, p_labelID} = route.params;
  console.log({p_colorString});

  // states
  const [noteState, setNoteState] = useState({
    title: '',
    colorString: null,
    description: '',
    label: null,
  });
  const [isLabelSelectionVisible, setIsLabelSelectionVisible] = useState(false);

  // effects
  useFocusEffect(
    useCallback(() => {
      return _onDestroy;
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      if (p_id) {
        getLabelByID(p_labelID)
          .then(label => {
            setNoteState({
              title: p_title,
              colorString: p_colorString,
              label: label,
            });
          })
          .catch(error => {
            setNoteState({
              title: p_title,
              colorString: p_colorString,
              label: null,
            });
          });
      }
    }, [p_id, p_labelID]),
  );
  useEffect(() => {
    if (editNoteSuccess) {
      _navigateBack();
    }
  }, [editNoteSuccess]);

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
    dispatch(resetEditNoteState());
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
    dispatch(
      editNote({
        id: p_id,
        title: noteState.title,
        labelID: noteState.label ? noteState.label.id : '',
        colorString: noteState.colorString,
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
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme?.colors.surface,
      }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={_navigateBack} />
        <Appbar.Content title="Edit note" titleStyle={{fontWeight: '700'}} />
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

const styles = new StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    height: '100%',
    width: '100%',
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});
// const enhanceNoteScreen = withObservables(['route'], ({route}) => ({
//   note: database.collections.get('notes').findAndObserve(route.params.p_id),
// }));
// export const EnhancedNoteScreen = enhanceNoteScreen(EditNoteScreen);

const mapStateToProps = state => {
  return {
    isEditingNote: state.note.isEditingNote,
    editNoteSuccess: state.note.editNoteSuccess,
    editNoteFailure: state.note.editNoteFailure,
  };
};
export default connect(mapStateToProps)(EditNoteScreen);
