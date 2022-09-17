import {Dimensions, Text, View} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';

import {useEffect} from 'react';

const PermissionStatusProvider = ({
  isCheckingContactsPermission,
  calendarPermissionState,
  children,
}) => {
  useEffect(() => {
    console.log('PermissionStatusProvider', {calendarPermissionState});
  }, [calendarPermissionState]);
  return (
    <View
      style={{
        height: '100%',
        width: Dimensions.get('screen').width,
      }}>
      {isCheckingContactsPermission ? (
        <Text>Loading...</Text>
      ) : !calendarPermissionState ? (
        <Text>No permission</Text>
      ) : (
        children
      )}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    isCheckingCalendarPermission: state.permission.isCheckingCalendarPermission,
    calendarPermissionState: state.permission.calendarPermissionState,
  };
};
export default connect(mapStateToProps)(PermissionStatusProvider);
