import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, ListItem, H2, H3, H1 } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import Backend from '../../constants/Backend'
import AppLocales from '../../constants/i18n'

import {actTeamGetJoinRequestOK} from '../../redux/TeamReducer'
import { NoDataText } from '../../components/StyledText';

// navigation is passed from Parent
class JoinRequestScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleJoin = this.handleJoin.bind(this)
    this.handleDeleteMember = this.handleDeleteMember.bind(this)
    
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
            if (type == "approved") {
              this.props.fetchTeamData();
            } else {
              this.props.actTeamGetJoinRequestOK(response.data)
            }
            
        },
        error => {
            console.log("Approve or Reject ERROR:" + type)
            console.log(JSON.stringify(error))
        }
    );
  }
  handleDeleteMember(item) {
    Alert.alert(
      AppLocales.t("GENERAL_CONFIRM"),
      AppLocales.t("MSG_REMOVE_MEMBER"),
      [
          {
            text: AppLocales.t("GENERAL_NO"),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: AppLocales.t("GENERAL_YES"), style: 'destructive' , onPress: () => {
              console.log('Delete Pressed')
              Backend.removeMemFromTeam(
                {
                    teamId: item.teamId,
                    userId: item.id
                },
                this.props.userData.token, 
                response => {
                    console.log("removeMemFromTeam OK:")
                    console.log(response.data)
                    
                  this.props.fetchTeamData();
                },
                error => {
                    console.log("removeMemFromTeam ERROR:")
                    console.log(JSON.stringify(error))
                }
              )
          }},
      ],
      {cancelable: true}
    )
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
    console.log("JoinRequestScreen Render:")
    return (
        <View style={styles.container}>
          <View style={styles.textRow}>
            <H3>{AppLocales.t("TEAM_MEM_JOIN_REQUEST")}</H3>
          </View>
          {this.props.teamData.joinRequests.length > 0 ? this.props.teamData.joinRequests.map(item => (
              <ListItem icon key={item.id} style={styles.listItemRow} key={item.type+"-"+item.id}>
                  <Left style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                  </Left>
                  <Body style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                    <Text style={{fontSize: 16, fontWeight: "bold", marginTop: 5}}>{item.fullName}</Text>
                    <Text style={{fontSize: 13, color: AppConstants.COLOR_PICKER_TEXT, marginTop: 3}}>{item.email}</Text>
                  </Body>
                  <Right style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", alignSelf: "center"}}>
                      <TouchableOpacity 
                            onPress={() => this.handleJoin(item, "approved")}>
                          <View style={{alignItems: "center"}}>
                            <Icon type="AntDesign" name="checkcircle" style={styles.listItemEditIcon}/>
                            <Text style={{fontSize: 12, alignSelf:"center"}}>{AppLocales.t("TEAM_MEM_REQUEST_OK")}</Text>
                          </View>
                      </TouchableOpacity>

                      <TouchableOpacity 
                            onPress={() => this.handleJoin(item, "rejected")}>
                          <View style={{alignItems: "center", marginLeft: 10}}>
                            <Icon type="AntDesign" name="closecircle" style={styles.listItemDeleteIcon}/>
                            <Text style={{fontSize: 12, alignSelf:"center"}}>{AppLocales.t("TEAM_MEM_REQUEST_REJECT")}</Text>
                          </View>
                        </TouchableOpacity>
                      <TouchableOpacity 
                            onPress={() => this.handleJoin(item, "blocked")}>
                        <View style={{alignItems: "center", marginLeft: 10}}>
                          <Icon type="MaterialIcons" name="block" style={styles.listItemBlockIcon}/>
                          <Text style={{fontSize: 12, alignSelf:"center"}}>{AppLocales.t("TEAM_MEM_REQUEST_BLOCK")}</Text>
                        </View>
                      </TouchableOpacity>
                  </Right>
              </ListItem>
          )) : (
            <NoDataText />
          )}

          <View style={styles.textRow}>
            <H3>{AppLocales.t("TEAM_MEM_LIST")}</H3>
          </View>
          {this.props.teamData.members.length > 0 ? this.props.teamData.members.map(item => (
            <ListItem icon key={item.id} style={styles.listItemRow} key={item.type+"-"+item.id}>
                <Left style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", width: 0}}>
                </Left>
                <Body style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", marginLeft: -7}}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("MemberVehicles", {member: item})} key={item.id}>
                    <Text style={{fontSize: 16, fontWeight: "bold", marginTop: 5}}>{item.fullName}</Text>
                    <Text style={{fontSize: 13, color: AppConstants.COLOR_PICKER_TEXT, marginTop: 3}}>{item.email}</Text>
                    <Text style={{fontSize: 13, fontStyle: "italic", marginTop: 3, marginBottom: 5}}>
                      {AppLocales.t("TEAM_MEM_TOTALCAR") + ": " + item.vehicleList.length}
                    </Text>
                    </TouchableOpacity>
                </Body>
                <Right style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", alignSelf: "center"}}>
                  <TouchableOpacity 
                        onPress={() => this.handleDeleteMember(item)}>
                    <View style={{alignItems: "center", marginLeft: 10}}>
                      <Icon type="MaterialIcons" name="delete" style={styles.listItemBlockIcon2}/>
                      <Text style={{fontSize: 12, alignSelf:"center"}}>{AppLocales.t("GENERAL_DELETE_SHORT")}</Text>
                    </View>
                  </TouchableOpacity>
                  <Icon name="arrow-forward" style={{alignSelf: "center"}}/>
                </Right>
            </ListItem>
          )): (
            <NoDataText />
          )}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    paddingBottom: 150
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
    height: 70,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 5,
    backgroundColor:"white",
    borderRadius: 3,
    borderColor: "rgb(220, 220, 220)",
    borderWidth: 0.7,
    shadowColor: "#777777",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
        height: 2,
        width: 1
    }
  },
  listItemDeleteIcon: {
    color: AppConstants.COLOR_GOOGLE,
    fontSize: 28
  },
  listItemEditIcon: {
    color: "green",
    fontSize: 28
  },
  listItemBlockIcon: {
    color: AppConstants.COLOR_GOOGLE,
    fontSize: 30
  },
  listItemBlockIcon2: {
    color: AppConstants.COLOR_GOOGLE,
    fontSize: 24
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
