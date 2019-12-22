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
import {checkAndShowInterestial} from '../components/AdsManager'

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs, Tab, TabHeading, Segment } from 'native-base';

import { HeaderText, NoDataText } from '../components/StyledText';
import VehicleBasicReport from '../components/VehicleBasicReport'
import AppConstants from '../constants/AppConstants'
import {actVehicleDeleteVehicle, actVehicleAddVehicle} from '../redux/UserReducer'
import Layout from '../constants/Layout'
import AppLocales from '../constants/i18n'
import GasUsageReport from '../components/GasUsageReport'
import MoneyUsageByTimeReport from '../components/MoneyUsageByTimeReport'
import MoneyUsageReportServiceMaintain from '../components/MoneyUsageReportServiceMaintain'

import apputils from '../constants/AppUtils';

function getNameOfSortType(type) {
  if (type == "auth") return "Sắp Xếp theo 'Lịch Đăng Kiểm'";
  if (type == "oil") return "Sắp Xếp theo 'Lịch Thay Dầu'";
  if (type == "kmLarge") return "Sắp Xếp theo 'Đi Nhiều'";
  if (type == "kmSmall") return "Sắp Xếp theo 'Đi Ít'";
  if (type == "gasBest") return "Sắp Xếp theo 'Hiệu Suất Xăng Tốt'";
  if (type == "gasWorst") return "Sắp Xếp theo 'Hiệu Suất Xăng Kém'";
  if (type == "moneyMonthlyLarge") return "Sắp Xếp theo 'Số Tiền Hàng Tháng Lớn'";
  if (type == "moneyMonthlySmall") return "Sắp Xếp theo 'Số Tiền Hàng Tháng Nhỏ'";
  return "Default";
}

// vehicleList: {brand: "Kia", model: "Cerato", licensePlate: "18M1-78903", checkedDate: "01/14/2019", id: 3}
// fillGasList: {vehicleId: 2, fillDate: "10/14/2019, 11:30:14 PM", amount: 2, price: 100000, currentKm: 123344, id: 1}
// fillOilList: {vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1}
class MyVehicleScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortType: "auth",
      changedSort: false,
      activePage: 0
    };

    this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this)
    this.onSortChange = this.onSortChange.bind(this)
    this.changeActivePage = this.changeActivePage.bind(this)
  }
  componentDidMount() {
    console.log("HOMESCreen DidMount")
  }
 
  clearAsyncStorage = async() => {
    AsyncStorage.clear();
  }
  handleDeleteVehicle(vehicleId, licensePlate) {
    // Clear all Notifications of this Car
    if (this.props.userData.carReports[vehicleId]) {
      let report = this.props.userData.carReports[vehicleId];
      // if (report.scheduledNotification) {
      //   if (report.scheduledNotification.authNotify) {
      //       let notObj = report.scheduledNotification.authNotify;
      //       if (notObj.notificationId != null && notObj.notificationId != undefined) {
      //         apputils.cancelAppLocalNotification(notObj.notificationId)
      //       }
      //   }
      //   if (report.scheduledNotification.insuranceNotify) {
      //       let notObj = report.scheduledNotification.insuranceNotify;
      //       if (notObj.notificationId != null && notObj.notificationId != undefined) {
      //         apputils.cancelAppLocalNotification(notObj.notificationId)
      //       }
      //   }
      //   if (report.scheduledNotification.roadFeeNotify) {
      //       let notObj = report.scheduledNotification.roadFeeNotify;
      //       if (notObj.notificationId != null && notObj.notificationId != undefined) {
      //         apputils.cancelAppLocalNotification(notObj.notificationId)
      //       }
      //   }
      // }
    }
    //
    this.props.actVehicleDeleteVehicle(vehicleId, licensePlate)
  }

  componentDidUpdate() {
    console.log("MyVehicleScreen DIDUpdate")
  }
  componentWillReceiveProps(nextProps) {
    console.log("MyVehicleScreen WillReceiveProps")
  }
  componentWillUnmount() {
    console.log("MyVehicleScreen Will UnMount")
  }
  onSortChange(value) {
    this.setState({
      sortType: value,
      changedSort: true
    })
  }

  changeActivePage(val) {
    this.setState({activePage: val})
  }

  render() {
    console.log("MyVehicleScreen Render")
    console.log(Object.keys(this.props.userData.carReports))
    if (this.state.activePage==1) {
      var viewPage1 = (
          <Tabs style={{flex: 1}}>
            <Tab heading={AppLocales.t("TEAM_REPORT_REPORT_TAB1")}
                tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
              <Content><View style={styles.container}><ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>

                <MoneyUsageByTimeReport isTotalReport={true} key={"MoneyUsageByTimeReportPrivate"}/>
                <MoneyUsageReportServiceMaintain isTotalReport={true} isTeamDisplay={false} 
                  key={"MoneyUsageReportServiceMaintain"}/>

              </ScrollView></View></Content>
            </Tab>
            <Tab heading={AppLocales.t("TEAM_REPORT_REPORT_TAB2")} 
                tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <Content><View style={styles.container}><ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>

                <GasUsageReport isTotalReport={true} />

              </ScrollView></View></Content>
            </Tab>
          </Tabs>
      )
    } else {
      var viewPage0 = (
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>

              {(this.state.activePage == 0 && this.props.userData.vehicleList && this.props.userData.vehicleList.length > 0) ? (
                this.props.userData.vehicleList && this.props.userData.vehicleList.map(item => (
                  <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={this.handleDeleteVehicle}
                    navigation={this.props.navigation} {...this.state} requestDisplay={"all"} isTeamDisplay={false} isMyVehicle={true}
                  />
                ))
               ) : <NoDataText />}

            </ScrollView>
          </View>
        </Content>
      )
    }
    return (
      <Container>
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex:0}}/>
          <Body style={{flex:5, flexDirection: "row", justifyContent:"center", alignItems:"center",backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <Segment style={{alignSelf:"center",backgroundColor: AppConstants.COLOR_HEADER_BG}}>
              <Button first style={this.state.activePage === 0 ? styles.activeSegment : styles.inActiveSegment}
                  onPress={() => {this.changeActivePage(0); checkAndShowInterestial()}}>
                <Text style={this.state.activePage === 0 ? styles.activeSegmentText : styles.inActiveSegmentText}>
                  {AppLocales.t("MYCAR_HEADER")}</Text>
              </Button>
              <Button last style={this.state.activePage === 1 ? styles.activeSegment : styles.inActiveSegment}
                  onPress={() => {this.changeActivePage(1); checkAndShowInterestial()}}>
                <Text style={this.state.activePage === 1 ? styles.activeSegmentText : styles.inActiveSegmentText}>
                  {AppLocales.t("MYCAR_HEADER_REPORT")}</Text>
              </Button>
            </Segment>
          </Body>
          <Right style={{flex:1}}/>
        </Header>

        {this.state.activePage==1? (
          viewPage1
        ): (
          viewPage0
        ) }
      </Container>
    );
  }
}

MyVehicleScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG
  },
  contentContainer: {
  },
  sortContainer: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },

  filterHeaderInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 4,
  },
  filterHeaderInfoLeftButton: {
    flex: 1,
    paddingLeft: 0,
    marginLeft: 0
  },
  filterHeaderInfoText: {
    flex: 3,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  filterHeaderInfoTextDefault: {
    flex: 3,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold"
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  activeSegment: {
    //backgroundColor: AppConstants.COLOR_BUTTON_BG,
    backgroundColor: "white",
    color:AppConstants.COLOR_BUTTON_BG,
    borderColor: "white"
  },
  inActiveSegment: {
    backgroundColor: "#aec7e8",
    color:AppConstants.COLOR_PICKER_TEXT,
    borderColor: "white"
  },
  activeSegmentText: {
      //color:"white",
      color:AppConstants.COLOR_PICKER_TEXT,
      fontSize: 12
  },
  inActiveSegmentText: {
      color: "black",
      fontSize: 12
  },
});

const mapStateToProps = (state) => ({
  userData: state.userData
});
const mapActionsToProps = {
  actVehicleDeleteVehicle, actVehicleAddVehicle
};

export default connect(
  mapStateToProps,mapActionsToProps
)(MyVehicleScreen);

