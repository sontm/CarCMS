import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import Layout from '../constants/Layout'
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import AppLocales from '../constants/i18n';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, H2, H3, H1 } from 'native-base';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
import { MonoText } from '../components/StyledText';
import {
  LineChart
} from "react-native-chart-kit";
import GasUsageReport from '../components/GasUsageReport'
import MoneyUsageByTimeReport from '../components/MoneyUsageByTimeReport'
import MoneyUsageReport from '../components/MoneyUsageReport'
import ReminderReport from '../components/ReminderReport'

import {actVehicleDeleteVehicle, actVehicleAddVehicle} from '../redux/UserReducer'
import {actTempCalculateCarReport} from '../redux/UserReducer'

// vehicleList: {brand: "Kia", model: "Cerato", licensePlate: "18M1-78903", checkedDate: "01/14/2019", id: 3}
// fillGasList: {vehicleId: 2, fillDate: "10/14/2019, 11:30:14 PM", amount: 2, price: 100000, currentKm: 123344, id: 1}
// fillOilList: {vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1}
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleList:[],
      fillGasList:[],
      fillOilList:[],
      authorizeCarList:[],
    };

    this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this)
  }
  componentDidMount() {
    console.log("HOMESCreen DidMount")
    //this.loadFromStorage()
    this.props.userData.vehicleList.forEach(element => {
      this.props.actTempCalculateCarReport(element, null, this.props.userData)
    });
  }
  loadFromStorage = async () => {
    // const vehicleList = await AsyncStorage.getItem(AppContants.STORAGE_VEHICLE_LIST)
    // const fillGasList = await AsyncStorage.getItem(AppContants.STORAGE_FILL_GAS_LIST)
    // const fillOilList = await AsyncStorage.getItem(AppContants.STORAGE_FILL_OIL_LIST)
    // const authorizeCarList = await AsyncStorage.getItem(AppContants.STORAGE_AUTHORIZE_CAR_LIST)
    // JSON.parse(vehicleList).forEach(item => {
    //   this.props.actVehicleAddVehicle(item)
    // })
    // JSON.parse(fillGasList).forEach(item => {
    //   this.props.actVehicleAddFillItem(item)
    // })
    // JSON.parse(fillOilList).forEach(item => {
    //   this.props.actVehicleAddFillItem(item)
    // })
    // JSON.parse(authorizeCarList).forEach(item => {
    //   this.props.actVehicleAddFillItem(item)
    // })

    //this.clearAsyncStorage()
  }
  clearAsyncStorage = async() => {
    AsyncStorage.clear();
  }
  handleDeleteVehicle(vehicleId, licensePlate) {
    this.props.actVehicleDeleteVehicle(vehicleId, licensePlate)
  }

  componentDidUpdate() {
    console.log("HOMESCreen DIDUpdate")
  }
  componentWillReceiveProps(nextProps) {
    console.log("HOMESCreen WillReceiveProps")
  }
  componentWillUnmount() {
    console.log("HOMESCreen Will UnMount")
  }
  calculateAllVehicleTotalMoney() {
    let totalMoneyPrivate = 0;
    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {
        let {totalMoneySpend} = this.props.userData.carReports[element.id].moneyReport;

        totalMoneyPrivate += totalMoneySpend;
      }
    });
    return totalMoneyPrivate;
  }
  calculateAllVehicleTotalMoneyTeam() {
    let totalMoneyTeam = 0;
    this.props.teamData.teamCarList.forEach(element => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        let {totalMoneySpend} = this.props.teamData.teamCarReports[element.id].moneyReport;
        
        totalMoneyTeam += totalMoneySpend;
      }
    });
    return totalMoneyTeam;
  }
  render() {
    console.log("HOMESCreen Render")
    let totalMoneyPrivate = this.calculateAllVehicleTotalMoney();
    let totalMoneyTeam = this.calculateAllVehicleTotalMoneyTeam();
    return (
      <Container>
        <Header style={styles.headerContainer}>
          <Left>
          </Left>
          <Body>
            <Title>Tổng Quan</Title>
          </Body>
          <Right />
        </Header>
        
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              
              <View style={styles.statRow}>
                <Card style={styles.equalStartRow}>
                    <CardItem header>
                        <Text><H2>{AppUtils.formatMoneyToK(totalMoneyPrivate)}</H2></Text>
                    </CardItem>
                    <CardItem>
                    <Body>
                        <Text style={{alignSelf: "center", fontSize: 13}}>
                        {AppLocales.t("HOME_TOTAL_PRIVATE")}
                        </Text>
                    </Body>
                    </CardItem>
                </Card>
                <Card style={styles.equalStartRow}>
                    <CardItem header>
                        <Text><H2>{AppUtils.formatMoneyToK(totalMoneyTeam)}</H2></Text>
                    </CardItem>
                    <CardItem footer>
                    <Body>
                    <Text style={{alignSelf: "center", fontSize: 13}}>
                        {AppLocales.t("HOME_TOTAL_TEAM")}
                        </Text>
                    </Body>
                    </CardItem>
                </Card>
              </View>

              <ReminderReport />
              <MoneyUsageByTimeReport isTotalReport={true} />
              <GasUsageReport isTotalReport={true} />

            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_BG
  },
  contentContainer: {

  },
  headerContainer: {
    backgroundColor: AppConstants.COLOR_PICKER_TEXT
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 100,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: AppConstants.COLOR_PICKER_TEXT
  },
  equalStartRow: {
      flex: 1,
      margin: 5,
      padding: 0,
      borderWidth: 0.5,
      borderRadius: 7,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
  },


  textRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingLeft: 5,
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    flexGrow: 100
  },
  moneySpendContainer: {
    backgroundColor: "white",
    flexDirection: "column",
    borderWidth: 0.5,
    borderColor: "grey",
    justifyContent: "space-between",
    marginBottom: 20,
    borderRadius: 7,
  },
  barChartStackContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  gasUsageContainer: {
    width: "96%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

const mapStateToProps = (state) => ({
  userData: state.userData,
  teamData: state.teamData
});
const mapActionsToProps = {
  actVehicleDeleteVehicle, actVehicleAddVehicle,
  actTempCalculateCarReport
};

export default connect(
  mapStateToProps,mapActionsToProps
)(HomeScreen);

