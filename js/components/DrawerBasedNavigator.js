import React, {useEffect, useState} from 'react';
import {database} from '../db/db';
import withObservables from '@nozbe/with-observables';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import SettingScreen from '../screens/Settings';
import EnhancedLabelByIdScreenScreen from '../screens/LabelByIDScreen';
import {Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

export const CustomDrawer = props => {
  const theme = useTheme();
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',

            flexGrow: 0,
            paddingHorizontal: 18,
            paddingVertical: 4,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              padding: 0,
              lineHeight: 50,
              color: theme?.colors.primary,
            }}>
            Gaurdian
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              padding: 0,
              lineHeight: 50,
              marginLeft: 5,
            }}>
            Safety
          </Text>
        </View>

        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 5}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const DrawerBasedNavigation = ({labels}) => {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: theme?.colors.primaryContainer,
        drawerActiveTintColor: theme?.colors.primary,
        drawerInactiveTintColor: theme?.colors.secondary,
        drawerLabelStyle: {
          fontSize: 15,
          borderRadius: 20,
          marginLeft: -25,
          color: theme?.colors.secondary,
        },
        drawerItemStyle: {
          borderRadius: 25,
          paddingHorizontal: 10,
        },
        drawerStyle: {
          padding: 0,
        },
        drawerContentStyle: {
          padding: 0,
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}
      drawerStyle={{backgroundColor: 'white'}}>
      {labels &&
        Array.isArray(labels) &&
        labels.map((label, index) => {
          return (
            <Drawer.Screen
              key={`labels-drawer-${label.id}`}
              options={{
                drawerLabel: label.title,
                drawerIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name={label.iconString}
                    size={22}
                    color={theme?.colors.primary}
                  />
                ),
              }}
              initialParams={{labelID: label.id}}
              name={`${label.id}`}
              component={EnhancedLabelByIdScreenScreen}
            />
          );
        })}
      <Drawer.Screen
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name={'cog'}
              size={22}
              color={theme?.colors.primary}
            />
          ),
        }}
        name={`setting`}
        component={SettingScreen}
      />
    </Drawer.Navigator>
  );
};

const enhanceDrawerBasedNavigation = withObservables([], ({}) => ({
  labels: database.collections.get('labels').query(),
}));
const EnhancedDrawerBasedNavigation = enhanceDrawerBasedNavigation(
  DrawerBasedNavigation,
);

export default EnhancedDrawerBasedNavigation;
