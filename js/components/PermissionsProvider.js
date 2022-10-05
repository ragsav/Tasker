import {Dimensions, Text, View} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';

import {useEffect} from 'react';
import {Logger} from '../utils/logger';
import {LoadingScreen} from '../screens/LoadingScreen';
import PermissionsScreen from '../screens/PermissionsScreen';

const PermissionStatusProvider = ({
  isCheckingContactsPermission,
  isCheckingStorageWritePermission,
  calendarPermissionState,
  storageWritePermissionState,
  children,
}) => {
  useEffect(() => {
    Logger.pageLogger('PermissionStatusProvider', {
      calendarPermissionState,
      storageWritePermissionState,
    });
  }, [calendarPermissionState, storageWritePermissionState]);
  return (
    <View
      style={{
        height: '100%',
        width: Dimensions.get('screen').width,
      }}>
      {isCheckingContactsPermission || isCheckingStorageWritePermission ? (
        <LoadingScreen />
      ) : !calendarPermissionState || !storageWritePermissionState ? (
        <PermissionsScreen />
      ) : (
        children
      )}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    isCheckingCalendarPermission: state.permission.isCheckingCalendarPermission,
    isCheckingStorageWritePermission:
      state.permission.isCheckingStorageWritePermission,
    calendarPermissionState: state.permission.calendarPermissionState,
    storageWritePermissionState: state.permission.storageWritePermissionState,
  };
};
export default connect(mapStateToProps)(PermissionStatusProvider);
