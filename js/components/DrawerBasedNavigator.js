import withObservables from '@nozbe/with-observables';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {database} from '../db/db';
import EnhancedLabelScreen from '../screens/LabelScreen';

import {Divider, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CONSTANTS} from '../../constants';
import {connect} from 'react-redux';

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
            alignItems: 'center',

            flexGrow: 0,
            paddingHorizontal: 18,
            paddingVertical: 4,
          }}>
          <Image
            style={{
              height: 22,
              width: 22,
              backgroundColor: '#007acc',
              resizeMode: 'contain',
              borderRadius: 11,
              marginRight: 8,
            }}
            source={require('../../assets/logo_fore.png')}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              padding: 0,
              lineHeight: 50,
              color: theme?.colors.primary,
            }}>
            Tasker
          </Text>
          {/* <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              padding: 0,
              lineHeight: 50,
              marginLeft: 5,
              color: theme?.colors.onBackground,
              textAlignVertical: 'bottom',
            }}>
            Safety
          </Text> */}
        </View>

        <View style={{flex: 1, paddingTop: 5}}>
          <DrawerItemList {...props} />
        </View>

        {props?.quickListSettings?.myDay && (
          <DrawerItem
            label="My day"
            style={{borderRadius: 25, paddingHorizontal: 0}}
            labelStyle={{
              fontSize: 15,
              borderRadius: 20,
              marginLeft: -25,
              color: theme?.colors.secondary,
            }}
            onPress={() => {
              props.navigation.navigate(CONSTANTS.ROUTES.MY_DAY);
            }}
            icon={() => (
              <MaterialCommunityIcons
                name={'calendar-today'}
                size={22}
                color={theme?.colors.primary}
              />
            )}
          />
        )}

        {props?.quickListSettings?.myDay && (
          <DrawerItem
            label="Pinned Notes"
            style={{borderRadius: 25, paddingHorizontal: 0}}
            labelStyle={{
              fontSize: 15,
              borderRadius: 20,
              marginLeft: -25,
              color: theme?.colors.secondary,
            }}
            onPress={() => {
              props.navigation.navigate(CONSTANTS.ROUTES.PINNED_NOTES);
            }}
            icon={() => (
              <MaterialCommunityIcons
                name={'pin'}
                size={22}
                color={theme?.colors.primary}
              />
            )}
          />
        )}
        <DrawerItem
          label="Archived Notes"
          style={{borderRadius: 25, paddingHorizontal: 0}}
          labelStyle={{
            fontSize: 15,
            borderRadius: 20,
            marginLeft: -25,
            color: theme?.colors.secondary,
          }}
          onPress={() => {
            props.navigation.navigate(CONSTANTS.ROUTES.ARCHIVED_NOTES);
          }}
          icon={() => (
            <MaterialCommunityIcons
              name={'package-down'}
              size={22}
              color={theme?.colors.primary}
            />
          )}
        />

        {props?.quickListSettings?.all && (
          <DrawerItem
            label="All tasks"
            style={{borderRadius: 25, paddingHorizontal: 0}}
            labelStyle={{
              fontSize: 15,
              borderRadius: 20,
              marginLeft: -25,
              color: theme?.colors.secondary,
            }}
            onPress={() => {
              props.navigation.navigate(CONSTANTS.ROUTES.ALL_TASKS);
            }}
            icon={() => (
              <MaterialCommunityIcons
                name={'all-inclusive'}
                size={22}
                color={theme?.colors.primary}
              />
            )}
          />
        )}
        {props?.quickListSettings?.completed && (
          <DrawerItem
            label="Completed"
            style={{borderRadius: 25, paddingHorizontal: 0}}
            labelStyle={{
              fontSize: 15,
              borderRadius: 20,
              marginLeft: -25,
              color: theme?.colors.secondary,
            }}
            onPress={() => {
              props.navigation.navigate(CONSTANTS.ROUTES.COMPLETED);
            }}
            icon={() => (
              <MaterialCommunityIcons
                name={'check-all'}
                size={22}
                color={theme?.colors.primary}
              />
            )}
          />
        )}
        {props?.quickListSettings?.bookmarks && (
          <DrawerItem
            label="Bookmarked"
            style={{borderRadius: 25, paddingHorizontal: 0}}
            labelStyle={{
              fontSize: 15,
              borderRadius: 20,
              marginLeft: -25,
              color: theme?.colors.secondary,
            }}
            onPress={() => {
              props.navigation.navigate(CONSTANTS.ROUTES.BOOKMARKS);
            }}
            icon={() => (
              <MaterialCommunityIcons
                name={'bookmark'}
                size={22}
                color={theme?.colors.primary}
              />
            )}
          />
        )}
        {props?.quickListSettings?.myCalendar && (
          <DrawerItem
            label="My calendar"
            style={{borderRadius: 25, paddingHorizontal: 0}}
            labelStyle={{
              fontSize: 15,
              borderRadius: 20,
              marginLeft: -25,
              color: theme?.colors.secondary,
            }}
            onPress={() => {
              props.navigation.navigate(CONSTANTS.ROUTES.CALENDAR);
            }}
            icon={() => (
              <MaterialCommunityIcons
                name={'calendar'}
                size={22}
                color={theme?.colors.primary}
              />
            )}
          />
        )}

        <DrawerItem
          style={{borderRadius: 25, paddingHorizontal: 0}}
          labelStyle={{
            fontSize: 15,
            borderRadius: 20,
            marginLeft: -25,
            color: theme?.colors.secondary,
          }}
          label="Add label"
          onPress={() => {
            props.navigation.navigate(CONSTANTS.ROUTES.ADD_LABEL);
          }}
          icon={() => (
            <MaterialCommunityIcons
              name={'plus'}
              size={22}
              color={theme?.colors.primary}
            />
          )}
        />
        <Divider />

        <DrawerItem
          label="Settings"
          style={{borderRadius: 25, paddingHorizontal: 0}}
          labelStyle={{
            fontSize: 15,
            borderRadius: 20,
            marginLeft: -25,
            color: theme?.colors.secondary,
          }}
          onPress={() => {
            props.navigation.navigate(CONSTANTS.ROUTES.SETTINGS);
          }}
          icon={() => (
            <MaterialCommunityIcons
              name={'cog'}
              size={22}
              color={theme?.colors.primary}
            />
          )}
        />
      </DrawerContentScrollView>
    </View>
  );
};

const DrawerBasedNavigation = ({labels, quickListSettings}) => {
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
        },
        drawerStyle: {
          padding: 0,
          backgroundColor: theme?.colors.background,
        },
        drawerContentStyle: {
          padding: 0,
        },
      }}
      drawerContent={props => (
        <CustomDrawer {...{...props, quickListSettings}} />
      )}>
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
              initialParams={{p_id: label.id}}
              name={`${label.id}`}
              component={EnhancedLabelScreen}
            />
          );
        })}
    </Drawer.Navigator>
  );
};

const enhanceDrawerBasedNavigation = withObservables([], ({}) => ({
  labels: database.collections.get('labels').query(),
}));
const EnhancedDrawerBasedNavigation = enhanceDrawerBasedNavigation(
  DrawerBasedNavigation,
);

const mapStateToProps = state => {
  return {
    quickListSettings: state.settings.quickListSettings,
  };
};

export default connect(mapStateToProps)(EnhancedDrawerBasedNavigation);

// export default EnhancedDrawerBasedNavigation;
