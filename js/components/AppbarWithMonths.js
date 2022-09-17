import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {useRef} from 'react';
import {View} from 'react-native';
import {Appbar, IconButton, Text} from 'react-native-paper';
import {connect} from 'react-redux';
import {setEndDate, setStartDate} from '../redux/actions';
const AppbarWithMonths = ({dispatch, sDate, eDate}) => {
  // ref
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);
  // variables
  const navigation = useNavigation();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions
  const _handleIncrementMonth = () => {
    const sDateLocal = new Date(sDate);
    const finalStartDate = new Date(
      sDateLocal.getFullYear(),
      sDateLocal.getMonth(),
    );
    finalStartDate.setMonth(sDateLocal.getMonth() + 1);

    const finalEndDate = new Date(
      sDateLocal.getFullYear(),
      sDateLocal.getMonth(),
    );
    finalEndDate.setMonth(sDateLocal.getMonth() + 2);

    dispatch(
      setStartDate({
        sDate: finalStartDate,
      }),
    );
    dispatch(
      setEndDate({
        eDate: finalEndDate,
      }),
    );
  };
  const _handleDecrementMonth = () => {
    const sDateLocal = new Date(sDate);
    const finalStartDate = new Date(
      sDateLocal.getFullYear(),
      sDateLocal.getMonth(),
    );
    finalStartDate.setMonth(sDateLocal.getMonth() - 1);

    const finalEndDate = new Date(
      sDateLocal.getFullYear(),
      sDateLocal.getMonth(),
    );

    dispatch(
      setStartDate({
        sDate: finalStartDate,
      }),
    );
    dispatch(
      setEndDate({
        eDate: finalEndDate,
      }),
    );
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
    <Appbar.Header
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Appbar.BackAction onPress={_navigateBack} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <IconButton icon={'chevron-left'} onPress={_handleDecrementMonth} />
        <Text style={{fontWeight: '700'}}>{`${moment(sDate)
          .format('MMMM')
          .substring(0, 3)} ${moment(sDate).year()}`}</Text>
        <IconButton icon={'chevron-right'} onPress={_handleIncrementMonth} />
      </View>
    </Appbar.Header>
  );
};
const mapStateToProps = state => {
  return {
    sDate: state.timeFrame.sDate,
    eDate: state.timeFrame.eDate,
  };
};

export default connect(mapStateToProps)(AppbarWithMonths);
