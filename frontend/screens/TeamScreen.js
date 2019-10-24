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
  Content,Text, Card, CardItem, Segment, ListItem, Badge } from 'native-base';

import VehicleBasicReport from '../components/VehicleBasicReport'
import AppContants from '../constants/AppConstants'
import Backend from '../constants/Backend'
import {actTeamGetDataOK} from '../redux/TeamReducer'

class TeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage:0
    }

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
      return allVehicles.map(item => {
        console.log(item)
        return (
        <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={() => {}}
          navigation={this.props.navigation}
        />
      )})
    } else if(this.state.activePage === 1) {
      return null
    } else {
      return this.props.teamData.members.map(item => (
        <ListItem icon key={item.id} style={styles.listItemRow} key={item.type+"-"+item.id}>
            <Left>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("MemberVehicles", {member: item})} key={item.id}>
                <Text>{item.fullName}</Text>
                <Text>{item.email}</Text>
                </TouchableOpacity>
            </Body>
            <Right>
              <Icon name="arrow-forward" style={styles.iconRight}/>
            </Right>
        </ListItem>

      ))
    }
  }
  componentDidUpdate() {
    console.log("TeamScreen DidUpdate")
  }
  render() {
    console.log("TeamScreen Render")
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.fetchTeamData}>
              <Icon type="MaterialIcons" name="refresh" />
            </Button>
          </Left>
          <Body>
            <Title>Team Screen</Title>
          </Body>
          <Right>
            <Button badge transparent onPress={() => this.props.navigation.navigate("JoinRequest")}>
              <Icon name="notifications" />
              <Badge danger style={styles.notifyBadge}>
                <Text style={styles.notifyBadgeText}>9</Text>
              </Badge>
            </Button>
          </Right>
        </Header>
        
        <Segment>
          <Button first active={this.state.activePage === 0}
              onPress={() => this.setState({activePage: 0})}>
            <Text>All Cars</Text>
          </Button>
          <Button active={this.state.activePage === 1}
              onPress={() => this.setState({activePage: 1})}>
            <Text>Reports</Text>
          </Button>
          <Button last active={this.state.activePage === 2}
              onPress={() => this.setState({activePage: 2})}>
            <Text>Members</Text>
          </Button>
        </Segment>

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
  }
});

const mapStateToProps = (state) => ({
  teamData: state.teamData,
  userData: state.userData
});
const mapActionsToProps = {
  actTeamGetDataOK
};

export default connect(
  mapStateToProps,mapActionsToProps
)(TeamScreen);

