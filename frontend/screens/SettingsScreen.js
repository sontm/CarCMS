import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity, Alert } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';

import { connect } from 'react-redux';
import Backend from '../constants/Backend';

import {actVehicleAddVehicle, actVehicleAddFillItem, actVehicleSyncAllFromServer} from '../redux/UserReducer';
import {actUserLogout, actUserLoginOK} from '../redux/UserReducer'
import * as Google from 'expo-google-app-auth'
import * as Facebook from 'expo-facebook';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.syncDataToServer = this.syncDataToServer.bind(this)
    this.syncDataFromServer = this.syncDataFromServer.bind(this)
    this.handleLogout = this.handleLogout.bind(this)

    this.doLoginGoogle = this.doLoginGoogle.bind(this)
  }
  syncDataFromServer() {
    AppUtils.syncDataFromServer(this.props)
  }

  syncDataToServer() {
    AppUtils.syncDataToServer(this.props)
  }
  handleLogout() {
    Alert.alert(
      'Do You Want to Sign out?',
      null,
      [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Sign-out', style: 'destructive' , 
              onPress: () => this.props.actUserLogout()},
      ],
      {cancelable: true}
  )
  }
  //Reponse Object:
  // "accessToken": "CNyi5FoAg0AGniBwVr__RiKV9_i8Qdqy8Y3hxydYcW-M63g",
  // "idToken": "eyJhnFGldJGEQ",
  // "refreshToken": "wmyg3g",
  // "type": "success",
  // "user": Object {
  //   "email": "xxx",
  //   "familyName": "xxh",
  //   "givenName": "xx",
  //   "id": "1xxxx",
  //   "name": "xxxh",
  //   "photoUrl": "xxxw",
  // },
  async doLoginGoogle() {
    try {
      const result = await Google.logInAsync({
        androidClientId: "654590019389-5p2kn1c423p3mav7a07gsg8e7an12rc1.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        console.log("Login Google OK")
        console.log(result)

        Backend.loginGoogle({
          idToken: result.idToken
        },
        response => {
          console.log("Backend Return OK")
          console.log(response.data)
          this.props.actUserLoginOK(response.data)
        },
        error => {
          console.log(JSON.stringify(error))
        })
        // })
      } else {
        console.log("cancelled Google Login")
      }
    } catch (e) {
      console.log("ERROR Google Login")
      console.log(e)
    }
  }

  async doLoginFacebook() {
    try {
      // const {
      //   type,
      //   token, // token to access
      //   expires,
      //   permissions,
      //   declinedPermissions,
      // } 
      const result = await Facebook.logInWithReadPermissionsAsync('704967129987939', {
        permissions: ['public_profile', 'email'],
      });
      if (result.type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${result.token}&fields=id,name,birthday,email,address,gender,picture.type(normal)`);
        const profile = await response.json() 
        
       // "email": "XX",
        // "id": "YYY",
        // "name": "XXX",
        // "picture": Object {
        //   "data": Object {
        //     "height": 200,
        //     "is_silhouette": false,
        //     "url": "XXX",
        //     "width": 200,
        //   },
        // },
        console.log(result)
        console.log('Logged in!', `Hi ${profile.name}!`);
        console.log(profile)
        
        // Send the User Information and Access Token to Server for validate
        Backend.loginFacebook({
          accessToken: result.token,
          userProfile: profile
        },
        response => {
          console.log("Backend Return OK")
          console.log(response.data)
          this.props.actUserLoginOK(response.data)
        },
        error => {
          console.log(JSON.stringify(error))
        })
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  }

  render() {
    return (
        <Container>
        <Content>
        <View style={styles.container}>
            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                    Pro Version Features
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialCommunityIcons" name="crown" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Pro Version</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("CreateTeam")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Octicons" name="sync" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Create Team</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("JoinTeam")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Octicons" name="sync" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Join Team</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.syncDataFromServer()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Octicons" name="sync" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Synchronize From Server</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.syncDataToServer()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Octicons" name="sync" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Upload To Server {AppConstants.SERVER_API}</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>


            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                    Setting
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("VehicleSetting")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialIcons" name="settings" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Vehicle Setting</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialIcons" name="access-alarm" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Remind Setting</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>


            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                    Tai Khoan
                </Text>
            </View>

            <TouchableOpacity 
                onPress={() => this.doLoginGoogle()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialCommunityIcons" name="google" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Login with Google</Text></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.doLoginFacebook()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Ionicons" name="logo-facebook" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Login with Facebook</Text></View>
              </View>
            </TouchableOpacity>

            {(true || !this.props.userData.isLogined) ? (
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("Login")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="AntDesign" name="login" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Login</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            ) : null}

            {(true || !this.props.userData.isLogined) ? (
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("RegisterUser")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="AntDesign" name="adduser" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>RegisterUser</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            ) : null}

            {(true || !this.props.userData.isLogined) ? (
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("Profile")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="FontAwesome" name="user-circle" style={styles.iconLeft} /></View>
                <View style={styles.rowText}>
                  <Text style={styles.textNormal}>
                    Profile
                    {" : "+ (this.props.userData.isLogined ? this.props.userData.userProfile.fullName: "")}
                  </Text>
                </View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            ) : null}

            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Foundation" name="mail" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Contact</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>

            {(true || !this.props.userData.isLogined) ? (
            <View style={styles.rowContainer}>
                <Button block danger onPress={() => this.handleLogout()} style={{width: "50%"}}>
                  <Text>Log Out</Text>
                </Button>
            </View>
            ) : null}
            
        </View>
        </Content>
        </Container>
    )
    }
}

SettingsScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
          </Left>
          <Body>
            <Title>More Settings</Title>
          </Body>
          <Right>
             <Button transparent onPress={() => {}}>
              <Icon name="search" />
            </Button>
          </Right>
        </Header>
    )
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: 3,
    marginRight: 3
  },

  textRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingLeft: 5,
    justifyContent: "flex-start",
    flexWrap: "wrap",
    flexGrow: 100,
    marginTop: 5
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", // vertial align
    margin: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowIcon: {
    flex: 1,
    textAlign: "left",
  },
  iconLeft: {
    fontSize: 24,
    color: "rgb(80,80,80)"
  },
  rowText: {
    marginLeft: 5,
    flex: 9,
  },
  rowRightIcon: {
    flex: 1,
    flexDirection:"row",
    justifyContent: "flex-end",
  },
  iconRight: {
    fontSize: 20,
    color: "grey"
  },

  textNormal: {
    color: "rgb(80, 80, 80)"
  },
  textSection: {
    fontSize: 24,
    color: "rgb(100, 100, 100)"
  }
})

const mapStateToProps = (state) => ({
    userData: state.userData,
    userData: state.userData
});
const mapActionsToProps = {
  actVehicleAddVehicle, actVehicleAddFillItem, actVehicleSyncAllFromServer,
  actUserLogout, actUserLoginOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(SettingsScreen);
