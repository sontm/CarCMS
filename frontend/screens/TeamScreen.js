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
} from 'react-native';

import {Container, Header, Title, Left, Icon, Right, Button, Body, 
  Content,Text, Card, CardItem, Segment, ListItem, Badge, Picker } from 'native-base';

import VehicleBasicReport from '../components/VehicleBasicReport'
import AppContants from '../constants/AppConstants'
import Backend from '../constants/Backend'
import {actTeamGetDataOK, actTeamGetJoinRequestOK} from '../redux/TeamReducer'

import TeamMembers from './team/TeamMembers'


function getNameOfSortType(type) {
  if (type == "auth") return "Lịch Đăng Kiểm";
  if (type == "oil") return "Lịch Thay Dầu";
  if (type == "kmLarge") return "Đi Nhiều";
  if (type == "kmSmall") return "Đi Ít";
  if (type == "gasBest") return "Hiệu Suất Xăng Tốt";
  if (type == "gasWorst") return "Hiệu Suất Xăng Kém";
  if (type == "moneyMonthlyLarge") return "Số Tiền Hàng Tháng Lớn";
  if (type == "moneyMonthlySmall") return "Số Tiền Hàng Tháng Nhỏ";
  return "Default";
}

class TeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage:0,
      sortType: "auth",
      changedSort: false
    }

    this.onSortChange = this.onSortChange.bind(this)
    this.onClearChange = this.onClearChange.bind(this)

    this.fetchTeamData = this.fetchTeamData.bind(this)
  }
  fetchTeamData() {
    Backend.getAllUserOfTeam({teamId: this.props.userData.userProfile.teamId}, this.props.userData.token, 
      response => {
          console.log("GEt all Member in Team OK")
          console.log(response.data)
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
          console.log(response.data)
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
      sortType: value,
      changedSort: true
    })
  }
  onClearChange() {
    this.setState({
      changedSort: false,
      sortType: "auth"
    })
  }
  componentDidMount() {
    console.log("TeamScreen DidMount")
    this.fetchTeamData()
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
      if (this.state.changedSort) {
        viewDisplay.push(
          <View style={styles.filterInfoContainer} key="sort">
            <Card style={{ borderRadius: 16, width: "80%", flexDirection:"row", justifyContent:"center", height: 30,alignItems:"center" }}>
              <Button transparent onPress={this.onClearChange}>
                  <Icon type="MaterialIcons" name="clear" />
              </Button>
              <Text>Sắp Xếp: {" " + getNameOfSortType(this.state.sortType)}</Text>
            </Card>
          </View>
        )
      }
      
      viewDisplay.push(allVehicles.map(item => {
        console.log(item)
        return (
        <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={() => {}}
          navigation={this.props.navigation}
        />
      )}))
      return viewDisplay;
    } else if(this.state.activePage === 1) {
      return null
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
        <Header style={{justifyContent: "space-between"}}>
          <Left style={{flex:1}}>
            <Button transparent onPress={this.fetchTeamData}>
              <Icon type="MaterialIcons" name="refresh" />
            </Button>
          </Left>
          <Body style={{flex:5, justifyContent: "center", alignItems:"center"}}>
          <Segment style={{alignSelf:"center"}}>
          <Button first active={this.state.activePage === 0}
              onPress={() => this.setState({activePage: 0})}>
            <Text>Xe</Text>
          </Button>
          <Button active={this.state.activePage === 1}
              onPress={() => this.setState({activePage: 1})}>
            <Text>Báo Cáo</Text>
          </Button>
          <Button last active={this.state.activePage === 2}
              onPress={() => this.setState({activePage: 2})}>
            <Text>Thành Viên</Text>
            {this.props.teamData.joinRequests.length > 0 ? (
              <Badge danger style={styles.notifyBadge}>
                <Text style={styles.notifyBadgeText}>{this.props.teamData.joinRequests.length}</Text>
              </Badge>
            ) : (null)
            }
          </Button>
        </Segment>
          </Body>
          <Right style={{flex:2}}>
            {this.state.activePage == 0 ? 
            (<Picker
                mode="dropdown"
                placeholder={<Icon type="MaterialCommunityIcons" name="sort" style={{fontSize: 24, color: "blue"}}/>}
                //iosIcon={<Icon type="FontAwesome5" name="caret-down" style={{fontSize: 16, color: "grey"}}/>}
                //selectedValue="year2"
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
            ) : null}
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
  }
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

