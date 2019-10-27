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

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, ListItem, H2, H3, H1 } from 'native-base';

import AppContants from '../../constants/AppConstants'
import Backend from '../../constants/Backend'

import {actTeamGetJoinRequestOK} from '../../redux/TeamReducer'

// navigation is passed from Parent
class JoinRequestScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleJoin = this.handleJoin.bind(this)
  }

  handleJoin(item, type) {
      //req.body: teamId, teamCode, requestUserId, id (join id), action (approved or rejected)
    Backend.approveOrRejectJoinRequest(
        {
            teamId: this.props.userData.teamInfo.id,
            teamCode: item.teamCode, 
            requestUserId: item.userId,
            id: item.id,
            action: type,
        },
        this.props.userData.token, 
        response => {
            console.log("Approve or Reject OK:" + type)
            console.log(response.data)
            //this.props.actUserLoginOK(response.data)
            //this.props.navigation.navigate("Settings")
            // this.setState({
            //     joins: response.data
            // })
            this.props.actTeamGetJoinRequestOK(response.data)
        },
        error => {
            console.log("Approve or Reject ERROR:" + type)
            console.log(JSON.stringify(error))
            this.setState({
                message: "Login Error!"
            })
        }
    );
  }
  componentDidMount() {
    console.log("JoinRequestScreen componentDidMount:")

  }

  // Data is Array of
//      "email": "tester1",
//     "fullName": "I M Tester1",
//     "id": "5db05ebad1b21048ee333fd1",
//     "phone": "",
//     "status": "requested",
//     "teamCode": "W4QKeBSl",
//     "userId": "5daf30722a799e12423b976a",
  render() {
    console.log("JoinRequestScreen Render:"+(this.props.userData && this.props.userData.teamInfo) ? 
        this.props.userData.teamInfo.code: "")
    return (
        <View style={styles.container}>
          <View style={styles.textRow}>
            <H2>Yêu Cầu Gia Nhập</H2>
          </View>
          {this.props.teamData.joinRequests.map(item => (
              <ListItem icon key={item.id} style={styles.listItemRow} key={item.type+"-"+item.id}>
                  <Left>
                  </Left>
                  <Body>
                      <Text>{item.fullName}</Text>
                      <Text>{item.email}</Text>
                  </Body>
                  <Right>
                      <TouchableOpacity 
                          onPress={() => this.handleJoin(item, "approved")}>
                          <Icon type="MaterialCommunityIcons" name="hand-okay" style={styles.listItemEditIcon}/></TouchableOpacity>
                      <TouchableOpacity 
                          onPress={() => this.handleJoin(item, "rejected")}>
                          <Icon type="AntDesign" name="closecircle" style={styles.listItemDeleteIcon}/></TouchableOpacity>
                      <TouchableOpacity 
                          onPress={() => this.handleJoin(item, "blocked")}>
                          <Icon type="MaterialIcons" name="block" style={styles.listItemBlockIcon}/></TouchableOpacity>
                  </Right>
              </ListItem>
          ))}

          <View style={styles.textRow}>
            <H2>Danh Sách Thành Viên</H2>
          </View>
          {this.props.teamData.members.map(item => (
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
          ))}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {

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

  listItemRow: {
    marginTop: 7,
    backgroundColor:"white"
  },
  listItemDeleteIcon: {
    color: "rgb(250, 100, 100)",
    fontSize: 24
  },
  listItemEditIcon: {
    color: "blue",
    fontSize: 34
  },
  listItemBlockIcon: {
    color: "rgb(250, 100, 100)",
    fontSize: 30
  }
});

const mapStateToProps = (state) => ({
  userData: state.userData,
  teamData: state.teamData,
});
const mapActionsToProps = {
  actTeamGetJoinRequestOK
};

export default connect(
  mapStateToProps,mapActionsToProps
)(JoinRequestScreen);
