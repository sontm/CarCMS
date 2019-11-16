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
  AsyncStorage,
  SafeAreaView
} from 'react-native';

import {Container, Header, Title, Left, Icon, Right, Button, Body, 
  Content,Text, Card, CardItem, Segment, ListItem, Badge, Picker, Tabs, Tab, TabHeading, CheckBox } from 'native-base';
  import {checkAndShowInterestial} from '../components/AdsManager'
import VehicleBasicReport from '../components/VehicleBasicReport'
import AppConstants from '../constants/AppConstants'
import Backend from '../constants/Backend'
import AppLocales from '../constants/i18n'

import {actTeamGetDataOK, actTeamGetJoinRequestOK} from '../redux/TeamReducer'

import TeamMembers from './team/TeamMembers'
import TeamReport from './team/TeamReport'
import TeamReport2 from './team/TeamReport2'

function getNameOfSortType(type) {
  if (type == "auth") return AppLocales.t("TEAM_VEHICLE_SORT_AUTH");
  if (type == "oil") return AppLocales.t("TEAM_VEHICLE_SORT_OIL");
  if (type == "km") return AppLocales.t("TEAM_VEHICLE_SORT_KM");
  if (type == "gasEffective") return AppLocales.t("TEAM_VEHICLE_SORT_GAS_EFF");
  if (type == "moneyTotal") return AppLocales.t("TEAM_VEHICLE_SORT_MONEYTOTAL");
  return "Default";
}

class TeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage:0,
      sortType: "auth",
      sortAscending: true
    }

    this.onSortChange = this.onSortChange.bind(this)
    this.fetchTeamData = this.fetchTeamData.bind(this)
    this.setActivePage = this.setActivePage.bind(this)
  }
  fetchTeamData() {
    console.log("My Team IDDDDDD")
    console.log(this.props.userData.userProfile.teamId)
    Backend.getAllUserOfTeam({teamId: this.props.userData.userProfile.teamId}, this.props.userData.token, 
      response => {
          console.log("GEt all Member in Team OK")
          // console.log(response.data)
          //this.props.actUserLoginOK(response.data)
          //this.props.navigation.navigate("Settings")
          // this.setState({
          //   members: response.data
          // })
          this.props.actTeamGetDataOK(response.data)
      },
      error => {
          console.log("GEt all Member in Team ERROR")
          console.log(JSON.stringify(error))
          this.setState({
              message: "Get Team Data Error!"
          })
      }
    );

    Backend.getAllJoinTeamRequest(this.props.userData.token, 
      response => {
          console.log("GEt all JoinRequest OK")
          // console.log(response.data)
          //this.props.actUserLoginOK(response.data)
          //this.props.navigation.navigate("Settings")
          this.props.actTeamGetJoinRequestOK(response.data)
      },
      error => {
          console.log("GEt all JoinRequest ERROR")
          console.log(JSON.stringify(error))
          this.setState({
              message: "Login Error!"
          })
      }
    );
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
    if(this.state.activePage === 0) {
      let allVehicles = [];
      this.props.teamData.members.forEach(item=> {
        if (item.vehicleList && item.vehicleList.length) {
          allVehicles.push(...item.vehicleList)
        }
      })
      let viewDisplay = [];
      viewDisplay.push(
        <View style={styles.sortContainer} key="sorting">
          <Text style={{fontSize: 12, margin: 0, marginRight: -2}}>Sắp Xếp:</Text>
          <Picker
            mode="dropdown"
            iosIcon={<Icon type="FontAwesome5" name="caret-down" style={{fontSize: 14, color: "grey"}}/>}
            selectedValue={this.state.sortType}
            onValueChange={this.onSortChange.bind(this)}
            textStyle={{ color: AppConstants.COLOR_PICKER_TEXT, fontSize: 15}}
          >
            <Picker.Item label={getNameOfSortType("auth")} value="auth" />
            <Picker.Item label={getNameOfSortType("oil")} value="oil" />
            <Picker.Item label={getNameOfSortType("km")} value="km" />
            <Picker.Item label={getNameOfSortType("gasEffective")} value="gasEffective" />
            <Picker.Item label={getNameOfSortType("moneyTotal")} value="moneyTotal" />
          </Picker>

          <Text style={{fontSize: 12, margin: 0, marginRight: -2}}>Giảm Dần</Text>
          <CheckBox checked={this.state.sortAscending==true} onPress={() => this.setState({sortAscending: !this.state.sortAscending})} />
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
        } else if (this.state.sortType == "oil") {
          return this.props.teamData.teamCarReports[bId].oilReport.passedKmFromPreviousOil - 
            this.props.teamData.teamCarReports[aId].oilReport.passedKmFromPreviousOil
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
      return viewDisplay;
    } else if(this.state.activePage === 1) {
      return null;
    } else {
      return <TeamMembers navigation={this.props.navigation}/>;
    }
  }

  componentDidUpdate() {
    console.log("TeamScreen DidUpdate")
  }

  render() {
    console.log("TeamScreen Render")
    return (
      <Container>
        <Header hasTabs noLeft style={{justifyContent: "space-between", backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Body style={{flex:5, justifyContent: "center", alignItems:"center",backgroundColor: AppConstants.COLOR_HEADER_BG}}>
          <Segment style={{alignSelf:"center",backgroundColor: AppConstants.COLOR_HEADER_BG}}>
          <Button first style={this.state.activePage === 0 ? styles.activeSegment : styles.inActiveSegment}
              onPress={() => this.setActivePage(0)}>
            <Text style={this.state.activePage === 0 ? styles.activeSegmentText : styles.inActiveSegmentText}>{AppLocales.t("TEAM_HEADER_CAR")}</Text>
          </Button>
          <Button style={this.state.activePage === 1 ? styles.activeSegment : styles.inActiveSegment}
              onPress={() => this.setActivePage(1)}>
            <Text style={this.state.activePage === 1 ? styles.activeSegmentText : styles.inActiveSegmentText}>{AppLocales.t("TEAM_HEADER_REPORT")}</Text>
          </Button>
          <Button last style={this.state.activePage === 2 ? styles.activeSegment : styles.inActiveSegment}
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
            <Button transparent onPress={this.fetchTeamData}>
              <Icon type="MaterialIcons" name="refresh" style={{color: "white"}} />
            </Button>
          </Right>
        </Header>
        {this.state.activePage === 1? (
        <Tabs style={{flex: 1}}>
          <Tab heading={ <TabHeading><Icon type="MaterialIcons" name="attach-money" /><Text>{AppLocales.t("TEAM_REPORT_REPORT_TAB1")}</Text></TabHeading>}>
            <TeamReport navigation={this.props.navigation}/>
          </Tab>
          <Tab heading={ <TabHeading><Icon type="MaterialCommunityIcons" name="fuel" /><Text>{AppLocales.t("TEAM_REPORT_REPORT_TAB2")}</Text></TabHeading>}>
            <TeamReport2 navigation={this.props.navigation}/>
          </Tab>
        </Tabs>
        ) : (
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              
              {this.renderComponent()}

            </ScrollView>
          </View>
        </Content>
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
    backgroundColor: '#fff',
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
    fontSize: 11,
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
});

const mapStateToProps = (state) => ({
  teamData: state.teamData,
  userData: state.userData
});
const mapActionsToProps = {
  actTeamGetDataOK, actTeamGetJoinRequestOK
};

export default connect(
  mapStateToProps,mapActionsToProps
)(TeamScreen);

