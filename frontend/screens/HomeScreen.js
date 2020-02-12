import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';
import Layout from '../constants/Layout'
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import AppLocales from '../constants/i18n';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Thumbnail , Badge} from 'native-base';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
import { HeaderText, WhiteText } from '../components/StyledText';
import {
  LineChart
} from "react-native-chart-kit";
import HomeMoneyUsageByTime from '../components/HomeMoneyUsageByTime'
import HomeMoneyUsageByTimeTeam from '../components/HomeMoneyUsageByTimeTeam'
import ReminderReport from '../components/ReminderReport'

import {actVehicleDeleteVehicle, actVehicleAddVehicle, actUserGetNotifications, actUserSyncPartlyOK} from '../redux/UserReducer'
import {actTempCalculateCarReport} from '../redux/UserReducer'
import backend from '../constants/Backend';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// vehicleList: {brand: "Kia", model: "Cerato", licensePlate: "18M1-78903", checkedDate: "01/14/2019", id: 3}
// fillGasList: {vehicleId: 2, fillDate: "10/14/2019, 11:30:14 PM", amount: 2, price: 100000, currentKm: 123344, id: 1}
// fillOilList: {vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1}
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notSeenNotiCount: 0,
      showPRModal: false,
      imgUrl:"",
      linkUrl:"",
    };

  }
  componentWillMount() {
    AppUtils.CONSOLE_LOG("HOME Mounting...")
    if (!this.props.appData.isDebugMode) {
      AppConstants.IS_DEBUG_MODE = false;
    }

    backend.getPromoteImageLink(
      response => {
        AppUtils.CONSOLE_LOG("PR Image ")
        AppUtils.CONSOLE_LOG(response.data)
        if (response.data && response.data.imgUrl) {
          this.setState({
            showPRModal:true,
            linkUrl: response.data.linkUrl,
            imgUrl: response.data.imgUrl
          })
        }
      },
      err => {
        AppUtils.CONSOLE_LOG("****Cannot Get PR:")
        AppUtils.CONSOLE_LOG(err)
      }
    )
  }
  componentDidMount() {
    AppUtils.CONSOLE_LOG("HOMESCreen DidMount, CountOpen:" + this.props.appData.countOpen + ":" + Constants.statusBarHeight)
    //this.loadFromStorage()
    // Load Notification messages
    this.props.actUserGetNotifications(this.props.userData)
  }

  componentDidUpdate() {
    AppUtils.CONSOLE_LOG("HOMESCreen DIDUpdate:"+this.props.userData.modifiedInfo.changedItemCount)
    // Sync Some Data to Server if Edit Count >=3
    if (this.props.userData.isLogined) {
      // Try to Sync with Any New Data
      if (this.props.userData.modifiedInfo && this.props.userData.modifiedInfo.changedItemCount > 0) {
        // if (this.props.appData.countOpen < 10) {
        //   // SYnc every 3 time
        //   if (this.props.userData.modifiedInfo.changedItemCount >= 3) {
        //     // RUn method after 7s so that Newest Data is Re-Updated
        //     setTimeout(() => AppUtils.syncDataPartlyToServer(this.props), 7000)
        //     //AppUtils.syncDataPartlyToServer(this.props)
        //   }
        // } else {
          // sync every 1 time
          setTimeout(() => AppUtils.syncDataPartlyToServer(this.props), 4000)
          //AppUtils.syncDataPartlyToServer(this.props)
       // }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    AppUtils.CONSOLE_LOG("HOMESCreen WillReceiveProps")
  }
  componentWillUnmount() {
    AppUtils.CONSOLE_LOG("HOMESCreen Will UnMount")
    // Get Promoted URL Here
  }
  calculateAllVehicleTotalMoney() {
    let totalMoneyPrivate = 0;
    let totalMoneyPrivateThisMonth = 0;
    let totalMoneyPrivatePrevMonth = 0;
    let today = new Date();
    var CALCULATE_END_THIS_MONTH = AppUtils.normalizeFillDate(
      new Date(today.getFullYear(),today.getMonth()+1,0));
    var CALCULATE_START_THIS_MONTH = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_THIS_MONTH.getFullYear(), 
      CALCULATE_END_THIS_MONTH.getMonth(), 1));
    var CALCULATE_START_PREV_MONTH = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_THIS_MONTH.getFullYear(), 
      CALCULATE_END_THIS_MONTH.getMonth() - 1, 1));

    // TODO Improve Perf this ??
    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {
        let {arrTotalMoneySpend, totalMoneySpend} = this.props.userData.carReports[element.id].moneyReport;
        arrTotalMoneySpend.forEach(item => {
          let xDate = new Date(item.x);
          if (xDate >= CALCULATE_START_THIS_MONTH && xDate <= CALCULATE_END_THIS_MONTH) {
            totalMoneyPrivateThisMonth += item.y;
          }
          if (xDate >= CALCULATE_START_PREV_MONTH && xDate < CALCULATE_START_THIS_MONTH) {
            totalMoneyPrivatePrevMonth += item.y;
          }
        })
        totalMoneyPrivate += totalMoneySpend;
      }
    });
    return {totalMoneyPrivate, totalMoneyPrivateThisMonth, totalMoneyPrivatePrevMonth};
  }
  calculateAllVehicleTotalMoneyTeam() {
    let totalMoneyTeam = 0;
    let totalMoneyTeamThisMonth = 0;
    let totalMoneyTeamPrevMonth = 0;

    let today = new Date();
    var CALCULATE_END_THIS_MONTH = AppUtils.normalizeFillDate(
      new Date(today.getFullYear(),today.getMonth()+1,0));
    var CALCULATE_START_THIS_MONTH = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_THIS_MONTH.getFullYear(), 
      CALCULATE_END_THIS_MONTH.getMonth(), 1));
    var CALCULATE_START_PREV_MONTH = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_THIS_MONTH.getFullYear(), 
      CALCULATE_END_THIS_MONTH.getMonth() - 1, 1));
    this.props.teamData.teamCarList.forEach(element => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        let {arrTotalMoneySpend, totalMoneySpend} = this.props.teamData.teamCarReports[element.id].moneyReport;
        
        arrTotalMoneySpend.forEach(item => {
          let xDate = new Date(item.x);
          if (xDate >= CALCULATE_START_THIS_MONTH && xDate <= CALCULATE_END_THIS_MONTH) {
            totalMoneyTeamThisMonth += item.y;
          }
          if (xDate >= CALCULATE_START_PREV_MONTH && xDate < CALCULATE_START_THIS_MONTH) {
            totalMoneyTeamPrevMonth += item.y;
          }
        })

        totalMoneyTeam += totalMoneySpend;
      }
    });

    return {totalMoneyTeam, totalMoneyTeamThisMonth, totalMoneyTeamPrevMonth};
  }
  onClosePRModal() {
    AppUtils.CONSOLE_LOG("Calling onForceCloseModalByPressBack..........")
    this.setState({showPRModal: false})
  }
  onClickPRModal() {
    if(this.state.linkUrl && this.state.linkUrl.length > 0) {
      Linking.canOpenURL(this.state.linkUrl).then(supported => {
        if (supported) {
          Linking.openURL(this.state.linkUrl);
          this.setState({showPRModal: false})
        } else {
          AppUtils.CONSOLE_LOG("Don't know how to open URI: " + this.state.linkUrl);
        }
      });
    }
  }

  render() {
    AppUtils.CONSOLE_LOG("HOMESCreen Render")
    let isUserHasTeam = true;
    let addedFontSize = 0;
    if (!this.props.userData.teamInfo || !this.props.userData.teamInfo.id) {
      isUserHasTeam = false;
      addedFontSize = 0;
    }
    let {totalMoneyPrivate, totalMoneyPrivateThisMonth, totalMoneyPrivatePrevMonth} = this.calculateAllVehicleTotalMoney();
    if (isUserHasTeam) {
      var {totalMoneyTeam, totalMoneyTeamThisMonth, totalMoneyTeamPrevMonth} = this.calculateAllVehicleTotalMoneyTeam();
    }
    if (totalMoneyPrivateThisMonth > totalMoneyPrivatePrevMonth) {
      var iconInfoUsage= (
        <Icon type="Entypo" name="arrow-up" 
            style={{color: AppConstants.COLOR_GOOGLE, marginLeft: 0, fontSize: 15+addedFontSize, width: 15+addedFontSize}} />
      )
    } else if (totalMoneyPrivateThisMonth < totalMoneyPrivatePrevMonth) {
      var iconInfoUsage= (
        <Icon type="Entypo" name="arrow-down" 
            style={{color: AppConstants.COLOR_D3_DARK_GREEN, marginLeft: 0, fontSize: 15+addedFontSize, width: 15+addedFontSize}} />
      )
    }
    
    
    if (isUserHasTeam) {
      if (totalMoneyTeamThisMonth > totalMoneyTeamPrevMonth) {
        var iconInfoUsageTeam= (
          <Icon type="Entypo" name="arrow-up" 
              style={{color: AppConstants.COLOR_GOOGLE, marginLeft: 0, fontSize: 15, width: 15}} />
        )
      } else if (totalMoneyTeamThisMonth < totalMoneyTeamPrevMonth) {
        var iconInfoUsageTeam= (
          <Icon type="Entypo" name="arrow-down" 
              style={{color: AppConstants.COLOR_D3_DARK_GREEN, marginLeft: 0, fontSize: 15, width: 15}} />
        )
      }
    }

    return (
      <Container>
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex:1}}>
          </Left>
          <Body style={{flex: 5, alignItems: "center"}}>
            <Title><HeaderText>{AppLocales.t("HOME_HEADER")}</HeaderText></Title>
          </Body>
          <Right  style={{flex:1}}>
            <Button badge transparent onPress={() => this.props.navigation.navigate("Notification")}>
              <Icon name="notifications" style={{color: "white", fontSize: 24}} />
              {this.props.userData.countNotSeenNoti > 0 ?
              <Badge danger style={styles.notifyBadge}>
                <Text style={styles.notifyBadgeText}>{this.props.userData.countNotSeenNoti}</Text>
              </Badge> : null}
            </Button>
          </Right>
        </Header>
       
        <Content>
          
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            
            <View style={styles.gapRow}>

            </View>
            <View style={styles.statRow}>
              <Card style={isUserHasTeam ? styles.equalStartRow : styles.equalStartRowSingle}>
                  <CardItem header>
                      <View style={{alignItems: "center"}}>
                        <Body>
                          <Text style={{alignSelf: "center", fontSize: 12+addedFontSize, 
                            color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                          {AppLocales.t("HOME_TOTAL_PRIVATE_THISMONTH")}
                          </Text>
                        </Body>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                          <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36+addedFontSize*2}}>
                            {AppUtils.formatMoneyToK(totalMoneyPrivateThisMonth)}</Text>
                          {iconInfoUsage}
                        </View>
                        <Body>
                          <Text style={{alignSelf: "center", fontSize: 14+addedFontSize}}>
                          {AppLocales.t("GENERAL_PREV_MONTH")+": " + AppUtils.formatMoneyToK(totalMoneyPrivatePrevMonth)}
                        </Text>
                        </Body>

                        <Text style={{marginTop: 10, fontSize: 20+addedFontSize, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                            {AppUtils.formatMoneyToK(totalMoneyPrivate)}</Text>
                        <Body>
                          <Text style={{alignSelf: "center", fontSize: 13+addedFontSize, color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                          {AppLocales.t("HOME_TOTAL_PRIVATE")}
                          </Text>
                        </Body>
                      </View>
                  </CardItem>
              </Card>
              {isUserHasTeam ? (
              <Card style={styles.equalStartRow}>
                  <CardItem header>
                      <View style={{alignItems: "center"}}>
                      <Body>
                        <Text style={{alignSelf: "center", fontSize: 12, 
                        color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                        {AppLocales.t("HOME_TOTAL_TEAM_THISMONTH")}
                        </Text>
                      </Body>
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                          {AppUtils.formatMoneyToK(totalMoneyTeamThisMonth)}</Text>
                        {iconInfoUsageTeam}
                      </View>

                      <Body>
                        <Text style={{alignSelf: "center", fontSize: 14}}>
                          {AppLocales.t("GENERAL_PREV_MONTH")+": " + AppUtils.formatMoneyToK(totalMoneyTeamPrevMonth)}
                        </Text>
                      </Body>

                      <Text style={{marginTop: 10, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                        {AppUtils.formatMoneyToK(totalMoneyTeam)}</Text>
                      <Body>
                      <Text style={{alignSelf: "center", fontSize: 13, color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                          {AppLocales.t("HOME_TOTAL_TEAM")}
                          </Text>
                      </Body>
                  </View>
                  </CardItem>
              </Card>
              ) : null}
            </View>

            {this.props.appData.countOpen > 10 || 
              (this.props.userData.vehicleList && this.props.userData.vehicleList.length >0) ?
            <View>
            <ReminderReport/>
            <HomeMoneyUsageByTime isTotalReport={true} />
            <HomeMoneyUsageByTimeTeam isTotalReport={true} />
            {this.props.appData.countOpen < 12 ?
            <View style={{marginLeft: 5, marginRight: 5, marginBottom: 20, flexWrap:"wrap"}}>
              <Text style={{fontStyle: "italic", fontSize: 14, color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                'N' là viết tắt của Nghìn VND. 'Tr' là viết tắt của Triệu VND.</Text>
            </View>: null}
            </View>
            : null }

          </ScrollView>
        </Content>

        {this.props.appData.countOpen < 10 && (!this.props.userData.vehicleList || this.props.userData.vehicleList.length ==0) ?
        <View style={styles.blurViewTop}></View> : null }
        {this.props.appData.countOpen < 10 && (!this.props.userData.vehicleList || this.props.userData.vehicleList.length ==0) ?
        <View style={styles.guideViewAddNewCar}>
          <View style={{flexDirection: "row",alignItems: "center",justifyContent: "center",}}>
            <Text>{"    "}Để bắt đầu, nhấn </Text>
            <Icon type="AntDesign" name='pluscircle' style={{fontSize: 40, marginTop: 2, marginLeft: 3, marginRight: 3, 
                color: AppConstants.COLOR_HEADER_BG_LIGHT}}/>
            <Text> và chọn "Thêm Xe" </Text>
          </View>

          <Icon type="Entypo" name="arrow-down" 
              style={{color: AppConstants.COLOR_GREY_MIDDLE, fontSize: 25, width: 25}} />

        </View> : null }

        {this.state.showPRModal ?
          <View style={{position: "absolute", alignItems:"center", justifyContent:"center",
            left: 0, right: 0, top:0,height: Layout.window.height,
            backgroundColor: "rgba(80, 80, 80, 0.4)"}}>
            <View style={{marginTop: -100}}>
              <TouchableOpacity onPress={() => this.onClosePRModal()} >
              <Icon type="AntDesign" name="closecircle" 
                style={{fontSize: 30, color: AppConstants.COLOR_GREY_DARK, alignSelf:"flex-end", marginRight: 7}}/>
              </TouchableOpacity>

              <TouchableWithoutFeedback onPress={() => this.onClickPRModal()} >
                <Thumbnail square source={{uri: this.state.imgUrl }} 
                  style={{height: 200, width: 300, marginTop: 5}}/>
              </TouchableWithoutFeedback>
            </View>
          </View> : null}

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
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    minHeight: Layout.window.height - 100
  },
  contentContainer: {
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
  },
  gapRow: {
    backgroundColor: AppConstants.COLOR_HEADER_BG,
    height: 100
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 100,
    paddingTop: 10,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
  },
  statRowEnd: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 100,
    paddingBottom: 5,
    backgroundColor: AppConstants.COLOR_HEADER_BG
  },
  equalStartRow: {
      flex: 1,
      marginLeft: 3,
      marginRight: 3,
      marginTop: -100,
      paddingVertical: 7,
      // borderWidth: 0.5,
      // borderRadius: 0,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",

      borderRadius: 13,
      borderColor: "rgb(220, 220, 220)",
      borderWidth: 1,

      shadowColor: "#777777",
      shadowOpacity: 0.4,
      shadowRadius: 3,
      shadowOffset: {
          height: 3,
          width: 1
      },
  },
  equalStartRowSingle: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: -100,
    paddingVertical: 0,
    // borderWidth: 0.5,
    // borderRadius: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 14,
    borderColor: "rgb(220, 220, 220)",
    borderWidth: 1,

    shadowColor: "#777777",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
        height: 3,
        width: 1
    },
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

  notifyBadge: {
    position:"relative",
    padding: 0,
    left: -10,
    top: 0,
    // width: 20,
    //width: 20,
    height: Platform.OS=="ios" ? 19 : 17,
    flexDirection:"column",
    justifyContent: "center"
  },
  notifyBadgeText: {
    position:"relative",
    top: -3,
    fontSize: 11,
  },

  blurViewTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(80, 80, 80, 0.6)",
    height: Layout.window.height - 40
  },

  guideViewAddNewCar: {
    alignItems: "center",
    alignSelf: "center",
    position: 'absolute',
    justifyContent: "center",
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 10
  },
});

const mapStateToProps = (state) => ({
  userData: state.userData,
  teamData: state.teamData,
  appData: state.appData
});
const mapActionsToProps = {
  actVehicleDeleteVehicle, actVehicleAddVehicle,
  actTempCalculateCarReport, actUserGetNotifications,
  actUserSyncPartlyOK
};

export default connect(
  mapStateToProps,mapActionsToProps
)(HomeScreen);

