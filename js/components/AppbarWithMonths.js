import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {useRef} from 'react';
import {View} from 'react-native';
import {Appbar, IconButton, Text} from 'react-native-paper';
import {connect} from 'react-redux';
import {setEndDate, setStartDate} from '../redux/actions';
const AppbarWithMonths = ({
  dispatch,
  sDate,
  eDate,
  handleDecrementMonth,
  handleIncrementMonth,
}) => {
  // ref

  // variables
  const navigation = useNavigation();

  // states

  // effects

  // callbacks

  // render functions

  // handle functions

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
        <IconButton icon={'chevron-left'} onPress={handleDecrementMonth} />
        <Text style={{fontWeight: '700'}}>{`${moment(sDate)
          .format('MMMM')
          .substring(0, 3)} ${moment(sDate).year()}`}</Text>
        <IconButton icon={'chevron-right'} onPress={handleIncrementMonth} />
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
