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

import VehicleBasicReport from '../components/VehicleBasicReport'
import AppContants from '../constants/AppConstants'
import Backend from '../constants/Backend'

class TeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      members: []
    }
  }

  componentDidMount() {
    console.log("TeamScreen DidMount")
    Backend.getAllUserOfTeam({teamId: this.props.userData.teamInfo.id}, this.props.userData.token, 
      response => {
          console.log("GEt all Member in Team OK")
          console.log(response.data)
          //this.props.actUserLoginOK(response.data)
          //this.props.navigation.navigate("Settings")
          this.setState({
            members: response.data
          })
      },
      error => {
          console.log("GEt all Member in Team ERROR")
          console.log(JSON.stringify(error))
          this.setState({
              message: "Login Error!"
          })
      }
    );
  }
  render() {
    console.log("TeamScreen Render")
    return (
      <Container>
        <Header>
          <Left>
          </Left>
          <Body>
            <Title>Team Screen</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("JoinRequest")}>
              <Icon name="notifications" />
            </Button>
          </Right>
        </Header>
        
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>

              {this.state.members.map(item => (
                <ListItem icon key={item.id} style={styles.listItemRow} key={item.type+"-"+item.id}>
                    <Left>
                    </Left>
                    <Body>
                        <Text>{item.fullName}</Text>
                        <Text>{item.email}</Text>
                    </Body>
                    <Right>
                      <Icon name="arrow-forward" style={styles.iconRight}/>
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
  }
});

const mapStateToProps = (state) => ({
  userData: state.userData
});
const mapActionsToProps = {

};

export default connect(
  mapStateToProps,mapActionsToProps
)(TeamScreen);

