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
  Modal,
  ActivityIndicator
} from 'react-native';

import {Container, Header, Title, Left, Icon, Right, Button, Body, 
  Content,Text, Card, CardItem, Segment, ListItem, Badge, Picker, Tabs, Tab, TabHeading, CheckBox , Toast} from 'native-base';
  import {checkAndShowInterestial} from '../components/AdsManager'
import VehicleBasicReport from '../components/VehicleBasicReport'
import ServiceMaintainTable from '../components/ServiceMaintainTable'
import AppConstants from '../constants/AppConstants'
import Backend from '../constants/Backend'
import AppLocales from '../constants/i18n'
import AppUtils from '../constants/AppUtils'
import NetInfo from "@react-native-community/netinfo";
import Layout from '../constants/Layout'
import { HeaderText } from '../components/StyledText';

import CheckMyJoinRequest from  '../components/CheckMyJoinRequest'

import {actTeamGetDataOK, actTeamGetJoinRequestOK} from '../redux/TeamReducer'
import {actUserStartSyncTeam,actUserStartSyncTeamDone, actUserForCloseModal} from '../redux/UserReducer'

import TeamMembers from './team/TeamMembers'
import TeamReport from './team/TeamReport'
import TeamReport2 from './team/TeamReport2'
import { NoDataText, WhiteText } from '../components/StyledText';

function getNameOfSortType(type) {
  if (type == "auth") return AppLocales.t("TEAM_VEHICLE_SORT_AUTH");
  if (type == "insurance") return AppLocales.t("TEAM_VEHICLE_SORT_INSURANCE");
  if (type == "roadfee") return AppLocales.t("TEAM_VEHICLE_SORT_ROADFEE");
  if (type == "service") return AppLocales.t("TEAM_VEHICLE_SORT_SERVICE");
  if (type == "km") return AppLocales.t("TEAM_VEHICLE_SORT_KM");
  if (type == "gasEffective") return AppLocales.t("TEAM_VEHICLE_SORT_GAS_EFF");
  if (type == "moneyTotal") return AppLocales.t("TEAM_VEHICLE_SORT_MONEYTOTAL");
  return "Default";
}

class TeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage:1,
      sortType: "auth",
      sortAscending: true
    }

    this.onSortChange = this.onSortChange.bind(this)
    this.fetchTeamData = this.fetchTeamData.bind(this)
    this.setActivePage = this.setActivePage.bind(this)

    this.onForceCloseModalByPressBack = this.onForceCloseModalByPressBack.bind(this)
    this.onShowModalDialog = this.onShowModalDialog.bind(this)
  }
  onForceCloseModalByPressBack() {
    console.log("Calling onForceCloseModalByPressBack..........")
    this.props.actUserForCloseModal()
  }
  onShowModalDialog() {
    setTimeout(() => {
      // Will try to close Dialog if Overtimeout 
      if (this.props.userData.modalState > 0) {
        this.props.actUserForCloseModal()
      }
    }, 20000);
  }
  fetchTeamData() {
    console.log("My Team IDDDDDD")
    console.log(this.props.userData.userProfile)
    console.log(this.props.userData.teamInfo)
    if (this.props.userData.userProfile.roleInTeam != "manager" && !this.props.userData.teamInfo.canMemberViewReport) {
      // no get data
    } else {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          this.props.actUserStartSyncTeam();

          Backend.getAllJoinTeamRequest(this.props.userData.token, 
            response => {
                console.log("GEt all JoinRequest OK")
                // console.log(response.data)
                //this.props.actUserLoginOK(response.data)
                //this.props.navigation.navigate("Settings")
                this.props.actTeamGetJoinRequestOK(response.data)

                Backend.getAllUserOfTeam({teamId: this.props.userData.userProfile.teamId}, this.props.userData.token, 
                  response2 => {
                      console.log("GEt all Member in Team OK")
                      // console.log(response.data)
                      //this.props.actUserLoginOK(response.data)
                      //this.props.navigation.navigate("Settings")
                      // this.setState({
                      //   members: response.data
                      // })
                      this.props.actTeamGetDataOK(response2.data, this.props.userData, this.props.teamData, this.props)
                  },
                  error => {
                      this.props.actUserStartSyncTeamDone();
                      console.log("GEt all Member in Team ERROR")
                      console.log(JSON.stringify(error))
                      this.setState({
                          message: "Get Team Data Error!"
                      })
                  }
                );
            },
            error => {
                this.props.actUserStartSyncTeamDone();
                console.log("GEt all JoinRequest ERROR")
                console.log(error.response)
            }
          );
        } else {
          Toast.show({
            text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
            //buttonText: "Okay",
            type: "danger"
          })
        }
      });
      
    }
  }
  setActivePage(val) {
    this.setState({activePage: val})
    checkAndShowInterestial();
  }
  onSortChange(value) {
    this.setState({
      sortType: value
    })
    checkAndShowInterestial();
  }

  componentDidMount() {
    console.log("TeamScreen DidMount")

    // TODO* whento call fetch team Data ?
    //this.fetchTeamData()
  }
  renderComponent = () => {
    console.log(Layout.window.width)
    if(this.state.activePage === 0) {
      console.log("this.state.activePage 0 Car Listssssssssss")
      let allVehicles = [];
      this.props.teamData.members.forEach(item=> {
        console.log("       item:id:" + item.id)
        if (this.props.userData.teamInfo.excludeMyCar && 
            item.id == this.props.userData.userProfile.id) {
              // Skip my cars
        } else {
          if (item.vehicleList && item.vehicleList.length) {
            allVehicles.push(...item.vehicleList)
          }
        }
      })
      
      let viewDisplay = [];
      viewDisplay.push(
        <View key={"lastSyncTeam"} style={{flexDirection:"row", justifyContent: "center", marginTop: 3, marginBottom: -3}}>
          <Text style={styles.textNormalSmallDate}>
          {AppLocales.t("SETTING_LBL_SYNC_FROM_LASTSYNC") + ": " + 
            AppUtils.formatDateTimeFullVN(this.props.teamData.lastSyncFromServerOn)}
          </Text>
        </View>
      )
      viewDisplay.push(
        <View style={styles.sortContainer} key="sorting">
          <Text style={{fontSize: 12, margin: 0, marginRight: -2}}>Sắp Xếp:</Text>
          <View style={{flexDirection:"row", width: 180}}>
          <Picker
            mode="dropdown"
            iosIcon={<Icon type="FontAwesome5" name="caret-down" style={{fontSize: 14, color: "grey"}}/>}
            selectedValue={this.state.sortType}
            onValueChange={this.onSortChange.bind(this)}
            textStyle={{ color: AppConstants.COLOR_PICKER_TEXT, fontSize: 15}}
          >
            <Picker.Item label={getNameOfSortType("auth")} value="auth" />
            <Picker.Item label={getNameOfSortType("insurance")} value="insurance" />
            <Picker.Item label={getNameOfSortType("roadfee")} value="roadfee" />
            <Picker.Item label={getNameOfSortType("service")} value="service" />
            <Picker.Item label={getNameOfSortType("km")} value="km" />
            <Picker.Item label={getNameOfSortType("gasEffective")} value="gasEffective" />
            <Picker.Item label={getNameOfSortType("moneyTotal")} value="moneyTotal" />
          </Picker>
          </View>

          <CheckBox checked={this.state.sortAscending==true} style={{marginLeft: -10}}
            onPress={() => this.setState({sortAscending: !this.state.sortAscending})} />
          <Text style={{fontSize: 12, margin: 0, marginLeft: 11}} onPress={() => this.setState({sortAscending: !this.state.sortAscending})}>Giảm Dần</Text>
          {/* <Segment small>
              <Button small first onPress={() => this.setState({sortAscending: true})}
                  style={this.state.sortAscending ? styles.activeSegment2 : styles.inActiveSegment2}>
                  <Text style={this.state.sortAscending ? styles.activeSegmentText2 : styles.inActiveSegmentText2}>Giảm</Text></Button>
              <Button small last onPress={() => this.setState({sortAscending: false})}
                  style={!this.state.sortAscending ? styles.activeSegment2 : styles.inActiveSegment2}>
                  <Text style={!this.state.sortAscending ? styles.activeSegmentText2 : styles.inActiveSegmentText2}>Tăng</Text></Button>
          </Segment> */}
        </View>
      )

      // Sorting List of Vehicles here
      allVehicles.sort((a, b) => {
        let aId = a.id;
        let bId = b.id;
        if (!this.props.teamData.teamCarReports[bId] || !this.props.teamData.teamCarReports[aId]) {
          return true;
        }
        if (!this.state.sortAscending) {
          let tmp = aId;
          aId = bId;
          bId = tmp;
        }

        if (this.state.sortType == "auth") {
          return this.props.teamData.teamCarReports[bId].authReport.diffDayFromLastAuthorize - 
            this.props.teamData.teamCarReports[aId].authReport.diffDayFromLastAuthorize
        } else  if (this.state.sortType == "insurance") {
          return this.props.teamData.teamCarReports[bId].authReport.diffDayFromLastAuthorizeInsurance - 
            this.props.teamData.teamCarReports[aId].authReport.diffDayFromLastAuthorizeInsurance
        } else if (this.state.sortType == "roadfee") {
          return this.props.teamData.teamCarReports[bId].authReport.diffDayFromLastAuthorizeRoadFee - 
            this.props.teamData.teamCarReports[aId].authReport.diffDayFromLastAuthorizeRoadFee
        } else if (this.state.sortType == "service") {
          if (this.props.teamData.teamCarReports[bId].maintainRemind) {
            return this.props.teamData.teamCarReports[bId].maintainRemind.passedKmFromPreviousMaintain - 
            this.props.teamData.teamCarReports[aId].maintainRemind.passedKmFromPreviousMaintain
          } else {
            return true;
          }
        } else if (this.state.sortType == "km") {
          return this.props.teamData.teamCarReports[bId].gasReport.avgKmMonthly - 
            this.props.teamData.teamCarReports[aId].gasReport.avgKmMonthly
        } else if (this.state.sortType == "gasEffective") {
          return this.props.teamData.teamCarReports[bId].gasReport.avgMoneyPerKmMonthly - 
            this.props.teamData.teamCarReports[aId].gasReport.avgMoneyPerKmMonthly
        } else if (this.state.sortType == "moneyTotal") {
          return this.props.teamData.teamCarReports[bId].moneyReport.totalMoneySpend - 
            this.props.teamData.teamCarReports[aId].moneyReport.totalMoneySpend
        }
        
      });

      viewDisplay.push(allVehicles.map(item => {
        return (
        <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={() => {}}
          navigation={this.props.navigation} requestDisplay={this.state.sortType} isTeamDisplay={true}
        />
      )}))
      console.log(" allVehicles" + allVehicles.length)
      if (allVehicles.length > 0) {
        return viewDisplay;
      } else {
        return (
          <NoDataText />
        )
      }
    } else if(this.state.activePage === 1) {
      return null;
    } else {
      console.log("this.state.activePage 3 of THANH VIENnnnnnnnnnnnnnnnnnn")
      return (
        <View>
          {this.props.teamData.lastSyncFromServerOn ? (
          <View key={"lastSyncTeam"} style={{flexDirection:"row", justifyContent: "center", marginTop: 3, marginBottom: 0}}>
            <Text style={styles.textNormalSmallDate}>
            {AppLocales.t("SETTING_LBL_SYNC_FROM_LASTSYNC") + ": " + 
              AppUtils.formatDateTimeFullVN(this.props.teamData.lastSyncFromServerOn)}
            </Text>
          </View>
          ) : null }

          <TeamMembers navigation={this.props.navigation} fetchTeamData={this.fetchTeamData}/>

        </View>
      )
    }
  }

  componentDidUpdate() {
    console.log("TeamScreen DidUpdate")
  }

  render() {
    
    let stateTeam = 0; // 0: NotJoinTeam, 1: RequestingJoin, 2: joined
    if (this.props.userData.teamInfo && this.props.userData.teamInfo.id) {
      stateTeam = 2;
    } else if (this.props.userData.myJoinRequest && this.props.userData.myJoinRequest.teamCode) {
      stateTeam = 1;
    }
    console.log("TeamScreen Render:" + stateTeam)
    console.log(this.props.userData.teamInfo)
    console.log(this.props.userData.myJoinRequest)
    return (
      <Container>
        
        {stateTeam == 2 ? (
        <Header hasTabs style={{justifyContent: "space-between", backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
        <Left style={{flex:1, marginRight: 0}}>
            <TouchableOpacity onPress={this.fetchTeamData} >
            <View style={{alignItems: "center"}}>
              <Icon name="cloud-download" style={{color: "white"}} />
              <WhiteText style={{fontSize: 10}}>{AppLocales.t("GENERAL_EDITDATA")}</WhiteText>
            </View>
            </TouchableOpacity>
        </Left>

        <Body style={{flex:5, justifyContent: "center", alignItems:"center",backgroundColor: AppConstants.COLOR_HEADER_BG}}>
          <Segment small style={{alignSelf:"center",backgroundColor: AppConstants.COLOR_HEADER_BG}}>
          <Button small first style={this.state.activePage === 1 ? styles.activeSegment : styles.inActiveSegment}
              onPress={() => this.setActivePage(1)}>
            <Text style={this.state.activePage === 1 ? styles.activeSegmentText : styles.inActiveSegmentText}>{AppLocales.t("TEAM_HEADER_REPORT")}</Text>
          </Button>
          <Button small style={this.state.activePage === 0 ? styles.activeSegment : styles.inActiveSegment}
              onPress={() => this.setActivePage(0)}>
            <Text style={this.state.activePage === 0 ? styles.activeSegmentText : styles.inActiveSegmentText}>{AppLocales.t("TEAM_HEADER_CAR")}</Text>
          </Button>
          <Button small last style={this.state.activePage === 2 ? styles.activeSegment : styles.inActiveSegment}
              onPress={() => this.setActivePage(2)}>
            <Text style={this.state.activePage === 2 ? styles.activeSegmentText : styles.inActiveSegmentText}>{AppLocales.t("TEAM_HEADER_MEMBER")}</Text>
            {this.props.teamData.joinRequests && this.props.teamData.joinRequests.length > 0 ? (
              <Badge danger style={styles.notifyBadge}>
                <Text style={styles.notifyBadgeText}>{this.props.teamData.joinRequests.length}</Text>
              </Badge>
            ) : (null)
            }
          </Button>
          </Segment>
        </Body>
        <Right style={{flex:1}}>
        </Right>
        </Header>
        ) : ((stateTeam == 1) ? (
          <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
            <Left style={{flex: 1}}>
            </Left>
            <Body  style={{flex: 5, alignItems: "center"}}>
            <Title><HeaderText>{AppLocales.t("GENERAL_TEAM")}</HeaderText></Title>
            </Body>
            <Right style={{flex: 1}}/>
          </Header>
        ) : 
           <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
             <Left style={{flex: 1}}>
             </Left>
             <Body  style={{flex: 5, alignItems: "center"}}>
               <Title><HeaderText>{AppLocales.t("GENERAL_TEAM")}</HeaderText></Title>
             </Body>
             <Right style={{flex: 1}}/>
           </Header>
        )}

        <Modal
          animationType="none"
          transparent={true}
          visible={(this.props.userData.modalState > 0) ? true : false}
          onRequestClose={() => this.onForceCloseModalByPressBack()}
          onShow={() => this.onShowModalDialog()}
          >
          <View style={{height: Layout.window.height, backgroundColor: "rgba(80, 80, 80, 0.3)"}}>
            <Card style={styles.modalDialog}>
              <CardItem>
                <Body style={{flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                  <ActivityIndicator size="large" color="green" />
                  <Text style={{fontSize: 17, color: AppConstants.COLOR_TEXT_DARKDER_INFO, marginTop: 10}}>
                    {AppLocales.t("INFO_SYNCING_TEAM_DATA")}
                    </Text>
                  
                </Body>
              </CardItem>
            </Card>
          </View>
        </Modal>

        {stateTeam == 2 && this.state.activePage === 1? (
        <Tabs style={{flex: 1}} locked={true}>
          <Tab heading={AppLocales.t("TEAM_REPORT_REPORT_TAB1")}
              tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
              activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <TeamReport navigation={this.props.navigation}/>
          </Tab>
          <Tab heading={AppLocales.t("TEAM_REPORT_REPORT_TAB2")}
              tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
              activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <TeamReport2 navigation={this.props.navigation}/>
          </Tab>
          <Tab heading={AppLocales.t("CARDETAIL_SERVICE_TABLE")}
              tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
              activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <Content>
                <ServiceMaintainTable selectFromList={true}/>
            </Content>
            
          </Tab>
        </Tabs>
        ) : (
        (stateTeam == 2) ? (
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              
              {this.renderComponent()}

            </ScrollView>
          </View>
        </Content>
        ) : (
          (stateTeam ==1) ? (
            <CheckMyJoinRequest key={"inTeam"} navigation={this.props.navigation}/>
          ) : (
            <View style={{alignItems: "center", padding: 10}}>
              <Text style={{fontSize: 16, color: AppConstants.COLOR_TEXT_DARKDER_INFO, fontStyle: "italic"}}>{
                AppLocales.t("GENERAL_STATUS") + ": " + 
                AppLocales.t("SETTING_LBL_NOTJOINT_TEAM")}
              </Text>
              <Text style={{fontSize: 13, color: AppConstants.COLOR_TEXT_DARKDER_INFO, fontStyle: "italic", flexWrap: "wrap", textAlign: "justify"}}>{
                "(Hãy Gia Nhập Nhóm giúp quản lý dữ liệu theo từng thành viên)"
              }</Text>

              <Button rounded onPress={() => this.props.navigation.navigate("CreateTeam", {isEdit: false})} 
                  style={{width: "80%", marginTop: 20, justifyContent: "center", alignSelf: "center", backgroundColor: AppConstants.COLOR_BUTTON_BG,}}>
                <Text style={{fontSize: 18}}>{AppLocales.t("SETTING_LBL_CREATE_TEAM")}</Text>
              </Button>

              <Text style={{fontSize: 13, color: AppConstants.COLOR_TEXT_DARKDER_INFO, fontStyle: "italic", marginTop: 10}}>{
                AppLocales.t("GENERAL_OR")}
              </Text>

              <Button rounded onPress={() => this.props.navigation.navigate("JoinTeam")} 
                  style={{width: "80%", marginTop: 10, justifyContent: "center", alignSelf: "center",backgroundColor: AppConstants.COLOR_BUTTON_BG,}}>
                <Text style={{fontSize: 18}}>{AppLocales.t("SETTING_LBL_JOIN_TEAM")}</Text>
              </Button>

            </View>
          )
        )
        )}

        

        
      </Container>
    );
  }
}

TeamScreen.navigationOptions = {
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

  listItemRow: {
    marginTop: 7
  },
  iconRight: {
    fontSize: 20,
    color: "grey"
  },
  notifyBadge: {
    position:"relative",
    left: -10,
    top: 0,
    // width: 20,
    height: 20,
    flexDirection:"column",
    justifyContent: "center"
  },
  notifyBadgeText: {
    position:"relative",
    top: -2,
    fontSize: 12,
  },

  filterInfoContainer: {
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
    backgroundColor: AppConstants.COLOR_HEADER_BG,
    color:AppConstants.COLOR_PICKER_TEXT,
    borderColor: "white"
  },
  activeSegmentText: {
      //color:"white",
      color:AppConstants.COLOR_PICKER_TEXT,
      fontSize: 12
  },
  inActiveSegmentText: {
      color: "white",
      //color: "black",
      fontSize: 12
  },



  activeSegment2: {
    backgroundColor: AppConstants.COLOR_BUTTON_BG,
    color:"white",
    padding: -5
  },
  inActiveSegment2: {
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    color:AppConstants.COLOR_PICKER_TEXT,
    padding: -5
  },
  activeSegmentText2: {
      color:"white",
      fontSize: 12
  },
  inActiveSegmentText2: {
      color:AppConstants.COLOR_PICKER_TEXT,
      fontSize: 12
  },

  textNormalSmallDate: {
    color: AppConstants.COLOR_TEXT_LIGHT_INFO,
    fontSize: 12
  },
  modalDialog: {
    marginTop: Layout.window.height / 2 - 100,
    marginLeft: Layout.window.width * 0.12,
    width: Layout.window.width * 0.76
  },
});

const mapStateToProps = (state) => ({
  teamData: state.teamData,
  userData: state.userData
});
const mapActionsToProps = {
  actTeamGetDataOK, actTeamGetJoinRequestOK,
  actUserStartSyncTeam,actUserStartSyncTeamDone, actUserForCloseModal
};

export default connect(
  mapStateToProps,mapActionsToProps
)(TeamScreen);

