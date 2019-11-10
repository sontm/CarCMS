import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity, Alert } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, Thumbnail } from 'native-base';
import Layout from '../constants/Layout'

import {HeaderText, WhiteText} from '../components/StyledText'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';

import { connect } from 'react-redux';
import Backend from '../constants/Backend';

import {actVehicleAddVehicle, actVehicleAddFillItem, actVehicleSyncAllFromServer} from '../redux/UserReducer';
import {actUserLogout, actUserLoginOK} from '../redux/UserReducer'
import * as Google from 'expo-google-app-auth'
import * as Facebook from 'expo-facebook';

import AppLocales from '../constants/i18n'

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
        // behavior: "web",
        androidClientId: "654590019389-5p2kn1c423p3mav7a07gsg8e7an12rc1.apps.googleusercontent.com",
        iosClientId: "654590019389-t78472q9u9ao4gcr2josc3r3gnki85if.apps.googleusercontent.com",
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
    console.log(this.props.userData.userProfile)
    const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
    return (
        <Container>
        <Content>
        <View style={styles.container}>
            {(true || !this.props.userData.isLogined) ? (
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("Profile")}>
            <View style={styles.userInfoContainer}>
              {this.props.userData.userProfile.pictureUrl ? (
                <Thumbnail source={{uri: uri}} style={styles.avatarContainer}/>
              ): (
                <Icon type="FontAwesome" name="user-circle-o" style={styles.avatarContainer}/>
              )}
              <View style={{flexDirection: "row"}}>
                <Text>{"  "}</Text>
                <Text><H3 style={{color: AppConstants.COLOR_PICKER_TEXT}}>{this.props.userData.userProfile.fullName}</H3></Text>
                <Text>{"  "}</Text>
                <Icon name="arrow-forward" style={styles.iconRight}/>
              </View>
              <Text>{this.props.userData.userProfile.email}</Text>
              <Text>{this.props.userData.teamInfo.name ? (
                AppLocales.t("GENERAL_TEAM")+": " + this.props.userData.teamInfo.name +
                " ("+ AppLocales.t("GENERAL_TEAM_CODE_SHORT")+": " + this.props.userData.teamInfo.code + ")") : null}</Text>
            </View>
            </TouchableOpacity>
            ) : null}

            {(true || !this.props.userData.isLogined) ? (
            <View style={styles.rowContainer}>
                <Button small block danger onPress={() => this.handleLogout()} style={{width: "40%"}}>
                  <Text>{AppLocales.t("SETTING_LBL_LOGOUT")}</Text>
                </Button>
            </View>
            ) : null}


            <View style={styles.proContainer}>
              <View style={styles.textRowPro}>
                  <WhiteText style={styles.textSection}>
                      {AppLocales.t("SETTING_H1_PRO_FEATURE")}
                  </WhiteText>
                  <Button small block danger onPress={() => {}} style={{marginRight: 10}}>
                    <Text>{AppLocales.t("SETTING_LBL_PRO_UPGRADE")}</Text>
                  </Button>
              </View>
              <TouchableOpacity 
                  onPress={() => {}}>
                <View style={styles.rowContainerNoBorder}>
                  <View style={styles.rowIcon}>
                    <Icon type="MaterialCommunityIcons" name="crown" style={styles.iconLeftWhite} /></View>
                  <View style={styles.rowText}><WhiteText style={styles.textNormal}>{AppLocales.t("SETTING_LBL_PRO")}</WhiteText></View>
                  <View style={styles.rowRightIcon}>
                    <Icon name="arrow-forward" style={styles.iconRightWhite}/></View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                  onPress={() => this.props.navigation.navigate("CreateTeam")}>
                <View style={styles.rowContainerNoBorder}>
                  <View style={styles.rowIcon}>
                    <Icon type="MaterialIcons" name="group-add" style={styles.iconLeftWhite} /></View>
                  <View style={styles.rowText}><WhiteText style={styles.textNormal}>{AppLocales.t("SETTING_LBL_CREATE_TEAM")}</WhiteText></View>
                  <View style={styles.rowRightIcon}>
                    <Icon name="arrow-forward" style={styles.iconRightWhite}/></View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                {AppLocales.t("SETTING_H1_ACCOUNT")}
                </Text>
            </View>

            <TouchableOpacity 
                onPress={() => this.doLoginGoogle()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="AntDesign" name="google" style={{...styles.iconLeft, color: "#DB4437"}} /></View>
                <View style={styles.rowText}>
                  <Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_LOGIN_GOOGLE")}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.doLoginFacebook()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Ionicons" name="logo-facebook" style={{...styles.iconLeft, color:"#3b5998"}} /></View>
                <View style={styles.rowText}>
                  <Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_LOGIN_FB")}
                  </Text></View>
              </View>
            </TouchableOpacity>

            {(true || !this.props.userData.isLogined) ? (
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("Login")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="AntDesign" name="login" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_LOGIN")}</Text></View>
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
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_REGISTER")}</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            ) : null}

            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("JoinTeam")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialIcons" name="person-add" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_JOIN_TEAM")}</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.syncDataFromServer()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon name="cloud-download" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_SYNC_FROM")}</Text></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.syncDataToServer()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon name="cloud-upload" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_SYNC_TO")} {AppConstants.SERVER_API}</Text></View>
              </View>
            </TouchableOpacity>


            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                {AppLocales.t("SETTING_H1_SETTING")}
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("VehicleSetting")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialIcons" name="access-alarm" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_REMIND")}</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>


            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                {AppLocales.t("SETTING_H1_SUPPORT")}
                </Text>
            </View>

            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Entypo" name="help-with-circle" style={{...styles.iconLeft}} /></View>
                <View style={styles.rowText}>
                  <Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_GUIDE")}</Text>
                </View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialIcons" name="rate-review" style={{...styles.iconLeft}} /></View>
                <View style={styles.rowText}>
                  <Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_REVIEW")}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Entypo" name="info-with-circle" style={{...styles.iconLeft}} /></View>
                <View style={styles.rowText}>
                  <Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_APP_INFO")}</Text>
                </View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Foundation" name="mail" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_CONTACT")}</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            
        </View>
        </Content>
        </Container>
    )
    }
}

SettingsScreen.navigationOptions = ({navigation}) => ({
    header: null
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: 3,
    marginRight: 3,
    paddingBottom: 60,
  },

  userInfoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  avatarContainer: {
    height: 60,
    width: 60,
    fontSize: 60,
    color: AppConstants.COLOR_HEADER_BG
  },

  proContainer: {
    backgroundColor: "#1f77b4",
    paddingBottom: 7,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: -5,
    marginRight: -5
  },

  textRowPro: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: "space-between",
    flexWrap: "wrap",
    flexGrow: 100,
    marginTop: 5,
  },
  textRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: "space-between",
    flexWrap: "wrap",
    flexGrow: 100,
    marginTop: 5,
    marginLeft: -5,
    marginRight: -5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG
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
  rowContainerNoBorder: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", // vertial align
    margin: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  rowIcon: {
    flex: 1,
    textAlign: "left",
  },
  iconLeft: {
    fontSize: 24,
    color: "rgb(80,80,80)"
  },
  iconLeftWhite: {
    fontSize: 24,
    color: "white"
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
  iconRightWhite: {
    fontSize: 20,
    color: "white"
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
    userData: state.userData
});
const mapActionsToProps = {
  actVehicleAddVehicle, actVehicleAddFillItem, actVehicleSyncAllFromServer,
  actUserLogout, actUserLoginOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(SettingsScreen);
