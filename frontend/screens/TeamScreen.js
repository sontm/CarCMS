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
  Content,Text, Card, CardItem, Segment, ListItem, Badge, Picker } from 'native-base';

import VehicleBasicReport from '../components/VehicleBasicReport'
import AppContants from '../constants/AppConstants'
import AppConstants from '../constants/AppConstants'
import Backend from '../constants/Backend'
import AppLocales from '../constants/i18n'

import {actTeamGetDataOK, actTeamGetJoinRequestOK} from '../redux/TeamReducer'

import TeamMembers from './team/TeamMembers'
import TeamReport from './team/TeamReport'

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

class TeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage:0,
      sortType: "auth"
    }

    this.onSortChange = this.onSortChange.bind(this)
    this.fetchTeamData = this.fetchTeamData.bind(this)
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
  onSortChange(value) {
    this.setState({
      sortType: value
    })
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
          <Picker
            mode="dropdown"
            placeholder={<Icon type="MaterialCommunityIcons" name="sort" style={{fontSize: 24, color: "blue"}}/>}
            iosIcon={<Icon type="FontAwesome5" name="caret-down" style={{fontSize: 16, color: "grey"}}/>}
            selectedValue={this.state.sortType}
            onValueChange={this.onSortChange.bind(this)}
            textStyle={{ color: AppContants.COLOR_PICKER_TEXT}}
          >
            <Picker.Item label={getNameOfSortType("auth")} value="auth" />
            <Picker.Item label={getNameOfSortType("oil")} value="oil" />
            <Picker.Item label={getNameOfSortType("kmLarge")} value="kmLarge" />
            <Picker.Item label={getNameOfSortType("kmSmall")} value="kmSmall" />
            <Picker.Item label={getNameOfSortType("gasBest")} value="gasBest" />
            <Picker.Item label={getNameOfSortType("gasWorst")} value="gasWorst" />
            <Picker.Item label={getNameOfSortType("moneyMonthlyLarge")} value="moneyMonthlyLarge" />
            <Picker.Item label={getNameOfSortType("moneyMonthlySmall")} value="moneyMonthlySmall" />
          </Picker>
        </View>
      )
      viewDisplay.push(allVehicles.map(item => {
        return (
        <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={() => {}}
          navigation={this.props.navigation}
        />
      )}))
      return viewDisplay;
    } else if(this.state.activePage === 1) {
      return <TeamReport navigation={this.props.navigation}/>;
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
        <Header noLeft style={{justifyContent: "space-between", backgroundColor: AppContants.COLOR_HEADER_BG}}>
          <Body style={{flex:5, justifyContent: "center", alignItems:"center",backgroundColor: AppContants.COLOR_HEADER_BG}}>
          <Segment style={{alignSelf:"center",backgroundColor: AppContants.COLOR_HEADER_BG}}>
          <Button first style={this.state.activePage === 0 ? styles.activeSegment : styles.inActiveSegment}
              onPress={() => this.setState({activePage: 0})}>
            <Text style={this.state.activePage === 0 ? styles.activeSegmentText : styles.inActiveSegmentText}>{AppLocales.t("TEAM_HEADER_CAR")}</Text>
          </Button>
          <Button style={this.state.activePage === 1 ? styles.activeSegment : styles.inActiveSegment}
              onPress={() => this.setState({activePage: 1})}>
            <Text style={this.state.activePage === 1 ? styles.activeSegmentText : styles.inActiveSegmentText}>{AppLocales.t("TEAM_HEADER_REPORT")}</Text>
          </Button>
          <Button last style={this.state.activePage === 2 ? styles.activeSegment : styles.inActiveSegment}
              onPress={() => this.setState({activePage: 2})}>
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
        
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              
              {this.renderComponent()}

            </ScrollView>
          </View>
        </Content>
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

