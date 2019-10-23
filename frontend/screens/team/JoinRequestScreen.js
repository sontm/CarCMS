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

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, ListItem } from 'native-base';

import AppContants from '../../constants/AppConstants'
import Backend from '../../constants/Backend'

class JoinRequestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        joins: []
    }

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
            this.setState({
                joins: response.data
            })
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

    Backend.getAllJoinTeamRequest(this.props.userData.token, 
        response => {
            console.log("GEt all JoinRequest OK")
            console.log(response.data)
            //this.props.actUserLoginOK(response.data)
            //this.props.navigation.navigate("Settings")
            this.setState({
                joins: response.data
            })
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

  // Data is Array of
//      "email": "tester1",
//     "fullName": "I M Tester1",
//     "id": "5db05ebad1b21048ee333fd1",
//     "phone": "",
//     "status": "requested",
//     "teamCode": "W4QKeBSl",
//     "userId": "5daf30722a799e12423b976a",
  render() {
    console.log("JoinRequestScreen Render")
    return (
      <Container>        
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>

            {this.state.joins.map(item => (
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
                    </Right>
                </ListItem>
            ))}
            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

JoinRequestScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.push("Team")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Join Request</Title>
          </Body>
          <Right />
        </Header>
    )
});

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
  listItemDeleteIcon: {
    color: "rgb(250, 100, 100)",
    fontSize: 24
  },
  listItemEditIcon: {
    color: "blue",
    fontSize: 34
  },
});

const mapStateToProps = (state) => ({
  userData: state.userData
});
const mapActionsToProps = {

};

export default connect(
  mapStateToProps,mapActionsToProps
)(JoinRequestScreen);
