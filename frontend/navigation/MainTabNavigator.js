import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { withNavigation } from 'react-navigation';

import { Button, Text, Icon, Footer, FooterTab, ActionSheet } from "native-base";

import TabBarIcon from '../components/TabBarIcon';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import RegisterVehicleScreen from '../screens/RegisterVehicleScreen';
import FillGasScreen from '../screens/addinfo/FillGasScreen';
import FillOilScreen from '../screens/addinfo/FillOilScreen';
import CarAuthorizeScreen from '../screens/addinfo/CarAuthorizeScreen';

import VehicleDetailReport from '../screens/VehicleDetailReport';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    VehicleDetail: VehicleDetailReport,
    NewVehicle: RegisterVehicleScreen,
    FillGas: FillGasScreen,
    FillOil: FillOilScreen,
    CarAuthorize: CarAuthorizeScreen
  },
  config
);

// HomeStack.navigationOptions = {
//   tabBarLabel: 'Home',
//   tabBarIcon: ({ focused }) => (
//     <Ionicons
//       name={
//         Platform.OS === 'ios'
//           ? `ios-information-circle${focused ? '' : '-outline'}`
//           : 'md-information-circle'
//       }
//       size={26}
//       style={{ marginBottom: -3 }}
//       color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
//     />
//   ),
// };

// HomeStack.path = '';

const AddNewStack = createStackNavigator(
  {
    VehicleDetail: VehicleDetailReport,
    FillGas: FillGasScreen,
    FillOil: FillOilScreen,
    CarAuthorize: CarAuthorizeScreen
  },
  config
);
const BUTTONS = [
  { text: "New Vehicle", icon: "american-football", iconColor: "#2c8ef4" },
  { text: "Fill Gas", icon: "american-football", iconColor: "#2c8ef4" },
  { text: "Fill Oil", icon: "analytics", iconColor: "#f42ced" },
  { text: "Car Authorize", icon: "analytics", iconColor: "#f42ced" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
const NEW_VEHICLE = 0;
const FILLGAS_INDEX = 1;
const FILLOIL_INDEX = 2;
const CAR_AUTHORIZE_INDEX = 3;
const CANCEL_INDEX = 4;

// AddNewStack.navigationOptions = {
//   tabBarLabel: 'Links',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
//   ),
// };
// AddNewStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'User',
  tabBarIcon: ({ focused }) => (
    <Ionicons
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
      size={26}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
    HomeStack,
    // AddNewStack,
    // VehicleDetail: { screen: VehicleDetailReport },
    SettingsStack,

    // NewVehicle: { screen: RegisterVehicleScreen },
    // FillGas: { screen: FillGasScreen },
    // FillOil: { screen: FillOilScreen },
    // CarAuthorize: { screen: CarAuthorizeScreen },
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
            <Button
              vertical
              active={props.navigation.state.index === 0}
              onPress={() => props.navigation.navigate("HomeStack")}>
              <Icon type="AntDesign" name='home' style={{fontSize: 26}}/>
              <Text>Home</Text>
            </Button>
            <Button
              vertical
              // active={props.navigation.state.index === 1}
              onPress={() =>
                ActionSheet.show(
                {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    title: "Choose category"
                },
                (btnIndex) => {
                  if (btnIndex == NEW_VEHICLE) {
                      props.navigation.navigate("NewVehicle")
                  } else if (btnIndex == FILLGAS_INDEX) {
                      props.navigation.navigate("FillGas", 
                          {vehicleId: 0})
                  } else if (btnIndex == FILLOIL_INDEX) {
                      props.navigation.navigate("FillOil", 
                          {vehicleId: 0})
                  } else if (btnIndex == CAR_AUTHORIZE_INDEX) {
                      props.navigation.navigate("CarAuthorize", 
                          {vehicleId: 0})
                  }
                })
              }>
              <Icon type="AntDesign" name='pluscircle' style={{fontSize: 60, marginTop: -20, color: "blue"}}/>
            </Button>
            <Button
              vertical
              active={props.navigation.state.index === 1}
              onPress={() => props.navigation.navigate("SettingsStack")}>
              <Ionicons
                name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
                size={26}
                color={props.navigation.state.index === 1 ? Colors.tabIconSelected : Colors.tabIconDefault}
              />
              <Text>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
);

tabNavigator.path = '';

export default (tabNavigator);
