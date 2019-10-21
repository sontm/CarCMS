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
import PayServiceScreen from '../screens/addinfo/PayServiceScreen';
import PayExpenseScreen from '../screens/addinfo/PayExpenseScreen';

import VehicleDetailReport from '../screens/VehicleDetailReport';
import VehicleDetailHistory from '../screens/VehicleDetailHistory';

import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import VehicleSettingScreen from '../screens/setting/VehicleSettingScreen';
import AppConstants from '../constants/AppConstants';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    NewVehicle: RegisterVehicleScreen,
    VehicleDetail: VehicleDetailReport,
    VehicleHistory: VehicleDetailHistory,
    NewVehicle: RegisterVehicleScreen,
    FillGas: FillGasScreen,
    FillOil: FillOilScreen,
    CarAuthorize: CarAuthorizeScreen,
    PayExpense: PayExpenseScreen,
    PayService: PayServiceScreen
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

const DetailStack = createStackNavigator(
  {
    VehicleDetail: VehicleDetailReport,
    VehicleHistory: VehicleDetailHistory,
    NewVehicle: RegisterVehicleScreen,
    FillGas: FillGasScreen,
    FillOil: FillOilScreen,
    CarAuthorize: CarAuthorizeScreen,
    PayExpense: PayExpenseScreen,
    PayService: PayServiceScreen
  },
  config
);
const BUTTONS = [
  { text: "Thêm Xe", icon: "american-football", iconColor: "#2c8ef4" },//0
  { text: "Đổ Xăng", icon: "american-football", iconColor: "#2c8ef4" },//1
  { text: "Thay Dầu", icon: "analytics", iconColor: "#f42ced" },//2
  { text: "Đăng Kiểm", icon: "analytics", iconColor: "#f42ced" },//3
  { text: "Chi Phí", icon: "analytics", iconColor: "#f42ced" },//4
  { text: "Sửa Chữa", icon: "analytics", iconColor: "#f42ced" },//5
  { text: "Đóng", icon: "close", iconColor: "#25de5b" }//6
];
const NEW_VEHICLE = 0;
const FILLGAS_INDEX = 1;
const FILLOIL_INDEX = 2;
const CAR_AUTHORIZE_INDEX = 3;
const PAY_EXPENSE_INDEX = 4;
const PAY_SERVICE_INDEX = 5;
const CANCEL_INDEX = 6;

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    VehicleSetting: VehicleSettingScreen,
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
    DetailStack,
    HomeStack,
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
              active={props.navigation.state.index === 1}
              onPress={() => {
                AppConstants.CURRENT_VEHICLE_ID = "0";
                AppConstants.CURRENT_EDIT_FILL_ID = "0";
                props.navigation.navigate("HomeStack")
              }}>
              <Icon name='list' style={{fontSize: 26}}/>
              <Text>List</Text>
            </Button>
            <Button
              vertical
              //active={props.navigation.state.index === 0}
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
                          {createNew: true})
                  } else if (btnIndex == FILLOIL_INDEX) {
                      props.navigation.navigate("FillOil", 
                          {createNew: true})
                  } else if (btnIndex == CAR_AUTHORIZE_INDEX) {
                      props.navigation.navigate("CarAuthorize", 
                          {createNew: true})
                  } else if (btnIndex == PAY_EXPENSE_INDEX) {
                      props.navigation.navigate("PayExpense", 
                          {createNew: true})
                  } else if (btnIndex == PAY_SERVICE_INDEX) {
                      props.navigation.navigate("PayService", 
                          {createNew: true})
                  }
                })
              }>
              <Icon type="AntDesign" name='pluscircle' style={{fontSize: 60, marginTop: -20, color: "blue"}}/>
            </Button>
            <Button
              vertical
              active={props.navigation.state.index === 2}
              onPress={() => {
                AppConstants.CURRENT_VEHICLE_ID = "0";
                AppConstants.CURRENT_EDIT_FILL_ID = "0";
                props.navigation.navigate("SettingsStack")
              }}>
              <Icon name='more' style={{fontSize: 26}}/>
              <Text>More</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
);

tabNavigator.path = '';

export default (tabNavigator);
