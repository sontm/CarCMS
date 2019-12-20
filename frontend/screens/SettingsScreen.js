import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import React from 'react';
import { ActivityIndicator, Spinner, Clipboard, Modal} from 'react-native';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity, Alert } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, Thumbnail, Toast, Item, Label, Input } from 'native-base';
import Layout from '../constants/Layout'

import {HeaderText, WhiteText} from '../components/StyledText'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';

import { connect } from 'react-redux';
import Backend from '../constants/Backend';

import {actVehicleAddVehicle, actVehicleAddFillItem, actVehicleSyncAllFromServer, 
  actVehicleSyncToServerOK, actUserStartSyncPrivate,actUserStartSyncPrivateDone,actUserStartSyncTeam,actUserStartSyncTeamDone} from '../redux/UserReducer';
import {actUserLogout, actUserLoginOK, actUserLeaveTeamOK, actUserForCloseModal} from '../redux/UserReducer'
import {actTeamGetDataOK, actTeamGetJoinRequestOK, actTeamUserWillLogout, actTeamLeaveTeamOK} from '../redux/TeamReducer'
import * as Google from 'expo-google-app-auth'
import * as Facebook from 'expo-facebook';
import NetInfo from "@react-native-community/netinfo";

import AppLocales from '../constants/i18n'
import { italic } from 'ansi-colors';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "tester1",
      password: "123456",
      isShowPwd: false
    };

    this.syncDataToServer = this.syncDataToServer.bind(this)
    this.syncDataFromServer = this.syncDataFromServer.bind(this)
    this.handleLogout = this.handleLogout.bind(this)

    this.doLoginGoogle = this.doLoginGoogle.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    
    this.onShowModalDialog = this.onShowModalDialog.bind(this)
    this.onForceCloseModalByPressBack = this.onForceCloseModalByPressBack.bind(this)
  }
  onForceCloseModalByPressBack() {
    console.log("Calling onForceCloseModalByPressBack..........")
    this.props.actUserForCloseModal()
  }
  onShowModalDialog() {
    setTimeout(() => {
      // Will try to close Dialog if Overtimeout 
      if (this.props.userData.modalState > 0) {
        this.props.actUserForCloseModal()
      }
    }, 20000);
  }
  syncDataFromServer() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        AppUtils.syncDataFromServer(this.props)
      } else {
        Toast.show({
          text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
          //buttonText: "Okay",
          type: "danger"
        })
      }
    });
    
  }

  syncDataToServer() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        AppUtils.syncDataToServer(this.props)
      } else {
        Toast.show({
          text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
          //buttonText: "Okay",
          type: "danger"
        })
      }
    });
    
  }
  handleLogout() {
    Alert.alert(
      AppLocales.t("MSG_LOGOUT"),
      null,
      [
          {
            text: 'Huỷ',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', style: 'destructive' , 
              onPress: () => {this.props.actUserLogout(); this.props.actTeamUserWillLogout()}},
      ],
      {cancelable: true}
  )
  }
  onClickLeaveTeam() {
    Alert.alert(
      AppLocales.t("MSG_LEAVE_TEAM"),
      "",
      [
          {
            text: 'Huỷ',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', style: 'destructive' , onPress: () => {
              console.log('Delete Pressed')
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  Backend.leaveTeam(this.props.userData.token,
                    response => {
                      this.props.actUserLeaveTeamOK()
                      this.props.actTeamLeaveTeamOK()
                    }, error => {
                      console.log("User LEave team Error")
                      console.log(error.response)
                    })
                } else {
                  Toast.show({
                    text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
                    //buttonText: "Okay",
                    type: "danger"
                  })
                }
              });
          }},
      ],
      {cancelable: true})
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
      console.log("doLoginGoogle...")
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        Toast.show({
          text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
          //buttonText: "Okay",
          type: "danger"
        })
        return;
      }
      
      const result = await Google.logInAsync({
        // behavior: "web",
        androidClientId: "654590019389-5p2kn1c423p3mav7a07gsg8e7an12rc1.apps.googleusercontent.com",
        iosClientId: "654590019389-t78472q9u9ao4gcr2josc3r3gnki85if.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      })
      console.log(result)
      if (result.type === "success") {
        console.log("Login Google OK")
        

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
  handleLogin() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        Backend.login({email: this.state.email, password: this.state.password}, 
          response => {
              console.log("Login OK")
              console.log(response.data)
              this.props.actUserLoginOK(response.data)
              this.props.navigation.navigate("Settings")
          },
          error => {
              console.log("Login ERROR")
              console.log(error)
              this.setState({
                  message: "Login Error!"
              })
          }
        );
      } else {
        Toast.show({
          text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
          //buttonText: "Okay",
          type: "danger"
        })
      }
    });
    
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
      console.log("Start doLoginFacebook")
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        Toast.show({
          text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
          //buttonText: "Okay",
          type: "danger"
        })
        return;
      }

      const result = await Facebook.logInWithReadPermissionsAsync('704967129987939', {
        permissions: ['public_profile', 'email'],
      });
      if (result.type === 'success') {
        // Get the user's name using Facebook's Graph API
        console.log(result)
        //let strUrl = "https://graph.facebook.com/me?access_token=" + result.token + "&fields=id,name,birthday,email,address,gender,picture.type(normal)";
        let strUrl = "https://graph.facebook.com/me?access_token=" + result.token + "&fields=id,name,email,picture.type(normal)";
        console.log(strUrl)
        //const response = await fetch("https://graph.facebook.com/me?access_token=${result.token}&fields=id,name,birthday,email,address,gender,picture.type(normal)`);
        //const response = await fetch(strUrl);
        //const profile = await response.json() 
        axios.get(strUrl)
        .then(response => {
          console.log("GraphFB Returned")
          console.log(response.data)
          const profile = response.data
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
          console.log(profile)
          console.log('Logged in!', `Hi ${profile.name}!`);
          
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
        })
        .catch(error => {
          console.log(error);
        });
        
       
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.userData.isLogined && newProps.userData.isLogined) {
      console.log("**********&&&&&&&&&^^^^^^^^^^%%%%%%%%User Have Just Logind^^^^6")
      // This time, User have Just logined, will Sync
      AppUtils.syncDataFromServer(newProps)
    }
  }

  render() {
    // NetInfo.fetch().then(state => {
    //   console.log("Connection type", state.type); // wifi...
    //   console.log("Is connected?", state.isConnected); // true..
    // });
    console.log("===============this.props.userData.modalState")
    console.log(this.props.userData.modalState)
    const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
    return (
        <Container>
        <Content>
        <Modal
          animationType="none"
          transparent={true}
          visible={(this.props.userData.modalState > 0) ? true : false}
          onRequestClose={() => this.onForceCloseModalByPressBack()}
          onShow={() => this.onShowModalDialog()}
          >
          <View style={{height: Layout.window.height, backgroundColor: "rgba(80, 80, 80, 0.3)"}}>
            <Card style={styles.modalDialog}>
              <CardItem>
                <Body style={{flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                  <ActivityIndicator size="large" color="green" />
                  <Text style={{fontSize: 17, color: AppConstants.COLOR_TEXT_DARKDER_INFO, marginTop: 10}}>
                    {this.props.userData.modalState > 1 ? 
                      AppLocales.t("INFO_SYNCING_PRIVATE_DATA") : AppLocales.t("INFO_SYNCING_TEAM_DATA")}
                    </Text>
                  
                </Body>
              </CardItem>
            </Card>
          </View>
        </Modal>
        <View style={styles.container}>
            {(this.props.userData.isLogined) ? (
            <View>
            <View style={styles.userInfoContainer}>
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("Profile")}>
              <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <View style={{width: "100%",flexDirection: "column",justifyContent: "center",alignItems: "center",}}>
                  {this.props.userData.userProfile.pictureUrl ? (
                    <Thumbnail source={{uri: this.props.userData.userProfile.pictureUrl }} style={styles.avatarContainerImage}/>
                  ): (
                    <Icon type="FontAwesome" name="user-circle-o" style={styles.avatarContainer}/>
                  )}
                  <View style={{flexDirection: "row", marginTop: 5}}>
                    <Text><H3 style={{color: "white"}}>{this.props.userData.userProfile.fullName}</H3></Text>
                  </View>
                  <Text  style={{color: "white", fontStyle: "italic"}}>{this.props.userData.userProfile.email}</Text>
                </View>
                <View style={{position:"absolute", left: Layout.window.width*0.9}}>
                  <Icon name="arrow-forward" style={{...styles.iconRight, color: "rgb(220,220,220)"}}/>
                </View>
              </View>
            </TouchableOpacity>

              {(this.props.userData.teamInfo && this.props.userData.teamInfo.code) ? (
                <View>
                <View  style={{marginTop: 10, flexDirection:"row", alignItems:"center"}}>
                  <Text style={{color: "rgb(220,220,220)"}}>
                    {AppLocales.t("GENERAL_TEAM")+": "}
                  </Text>
                  <Text style={{fontWeight: "bold", color: "white"}}>
                    {this.props.userData.teamInfo.name }
                  </Text>
                </View>
                <View  style={{marginTop: 10, flexDirection:"row", alignItems:"center"}}>
                  <Text style={{color: "rgb(220,220,220)"}}>
                    {AppLocales.t("GENERAL_ROLE")+": "}
                  </Text>
                  <Text style={{fontStyle: "italic", color: "white"}}>
                    {this.props.userData.userProfile.roleInTeam == "manager" ?  
                      AppLocales.t("GENERAL_ROLE_MANAGER") : AppLocales.t("GENERAL_ROLE_MEMBER")}
                  </Text>
                </View>
                <View  style={{marginTop: 5, flexDirection:"row", alignItems:"center"}}>
                  <Text style={{color: "rgb(220,220,220)"}}>
                    {AppLocales.t("GENERAL_TEAM_CODE_SHORT")+" "+AppLocales.t("GENERAL_TEAM")+": "}
                  </Text>
                  <Text style={{color: "white"}}>
                    {this.props.userData.teamInfo.code}
                  </Text>
                  <TouchableOpacity 
                      onPress={() => {
                        Toast.show({
                          text: AppLocales.t("TOAST_SUCCESS_COPIED"),
                          //buttonText: "Okay",
                          type: "success"
                        })
                        Clipboard.setString(this.props.userData.teamInfo.code)
                      }}>
                    <Icon type="FontAwesome5" name="copy" 
                      style={{fontSize: 20, color: "white", marginLeft: 10}}/>
                  </TouchableOpacity>
                </View>
                </View>) : 
                <Text style={{fontSize: 13, fontStyle: "italic",marginTop: 5, color: "white"}}>{AppLocales.t("SETTING_LBL_NOTJOINT_TEAM")}
                  </Text>
              }
            {(this.props.userData.isLogined) ? (
            <View style={styles.rowContainerNoMargin}>
                <Button small block danger onPress={() => this.handleLogout()} style={{width: 150}}>
                  <Text>{AppLocales.t("SETTING_LBL_LOGOUT")}</Text>
                </Button>
            </View>
            ) : null}
            </View>
            
            </View>
            ) : (
            <View style={{marginTop: 30, marginBottom: 30}}>
              <View style={{alignSelf: "center"}}>
                <H3>{AppLocales.t("SETTING_LBL_LOGIN")}</H3>
              </View>
              <View style={styles.rowForm}>
                  <Item>
                    <Input
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        placeholder={"Email"}
                        keyboardType="email-address"
                    />
                  </Item>
              </View>
              <View style={styles.rowForm}>
                  <Item>
                    {/* <Label>{AppLocales.t("GENERAL_PWD")}</Label> */}
                    <Input
                        secureTextEntry={this.state.isShowPwd ? false : true}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        placeholder={AppLocales.t("GENERAL_PWD")}
                    />
                    <TouchableOpacity 
                      onPress={() => this.setState({isShowPwd: !this.state.isShowPwd})}>
                      <Icon name={this.state.isShowPwd ? "eye-off" : "eye"} />
                    </TouchableOpacity>
                  </Item>
              </View>

              <View style={{...styles.rowContainerNoBorder, marginTop: 8, paddingTop: 2, paddingBottom: 2, flexDirection: "column"}}>
                <Button rounded onPress={() => this.handleLogin()} 
                    style={{backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG, width: 270, justifyContent:"center"}}>
                  <Icon type="AntDesign" name="login" style={{color: "rgb(80,80,80)", fontSize: 16, marginRight: -4}} />
                  <Text style={{...styles.textNormal, fontSize: 14}}>{AppLocales.t("SETTING_LBL_LOGIN_BTN")}</Text>
                </Button>
                <Text style={{fontSize: 13, fontStyle: "italic", marginTop: 2}}>{AppLocales.t("SETTING_LBL_LOGIN_DESC")}</Text>
              </View>
              <View style={{...styles.rowContainerNoBorder, marginTop: -6, paddingTop: 0, paddingBottom: 0}}>
                <Button transparent onPress={() => this.props.navigation.navigate("RegisterUser")} >
                  <Icon type="AntDesign" name="adduser" style={{color: AppConstants.COLOR_PICKER_TEXT, fontSize: 17, marginRight: 0}} />
                  <Text style={{color: AppConstants.COLOR_PICKER_TEXT, fontSize: 17, marginLeft: -4}}>{AppLocales.t("SETTING_LBL_REGISTER")}</Text>
                </Button>
              </View>

              <View style={{...styles.rowContainerNoBorder, marginTop: -5, paddingTop: 0, paddingBottom: 5}}>
                <Text>{AppLocales.t("GENERAL_OR")}</Text>
              </View>

              <View style={{...styles.rowContainerNoBorder, marginTop: 5, paddingTop: 2, paddingBottom: 2}}>
                <Button rounded onPress={() => this.doLoginGoogle()} 
                    style={{backgroundColor: AppConstants.COLOR_GOOGLE, color: "white", width: 270, justifyContent:"center"}}>
                  <Icon type="AntDesign" name="google" style={{fontSize: 20, color: "white", marginRight: 0}} />
                  <Text style={{...styles.textNormal, color: "white"}}>{AppLocales.t("SETTING_LBL_LOGIN_GOOGLE")+"    "}</Text>
                </Button>
              </View>
              <View style={{...styles.rowContainerNoBorder, margin: 4, paddingTop: 2, paddingBottom: 2}}>
                <Button rounded onPress={() => this.doLoginFacebook()} 
                    style={{backgroundColor: AppConstants.COLOR_FACEBOOK, color: "white", width: 270, justifyContent:"center"}}>
                  <Icon type="Ionicons" name="logo-facebook" style={{fontSize: 20, color: "white", marginRight: 0}} />
                  <Text style={{...styles.textNormal, color: "white"}}>{AppLocales.t("SETTING_LBL_LOGIN_FB")}</Text>
                </Button>
              </View>
            </View>
            )}
            
            {/* <View style={styles.proContainer}>
              <View style={styles.textRowPro}>
                  <WhiteText style={styles.textSection}>
                      {AppLocales.t("SETTING_H1_PRO_FEATURE")}
                  </WhiteText>
                  <Button small block success onPress={() => {}} style={{marginRight: 10}}>
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
            </View> */}

            {this.props.userData.isLogined ?
            <View>
            <View style={{...styles.textRow, marginTop: 0}}>
                <Text style={styles.textSection}>
                {AppLocales.t("SETTING_H1_ACCOUNT")}
                </Text>
            </View>
            {(this.props.userData.isLogined && (!this.props.userData.teamInfo || !this.props.userData.teamInfo.code)) ? (
            <TouchableOpacity 
                  onPress={() => this.props.navigation.navigate("CreateTeam", {isEdit: false})}>
                <View style={styles.rowContainerNoBorder}>
                  <View style={styles.rowIcon}>
                    <Icon type="MaterialIcons" name="group-add" style={styles.iconLeft} /></View>
                  <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_CREATE_TEAM")}</Text></View>
                  <View style={styles.rowRightIcon}>
                    <Icon name="arrow-forward" style={styles.iconRight}/></View>
                </View>
            </TouchableOpacity>
            ) : null }

            {(this.props.userData.isLogined && (!this.props.userData.teamInfo || !this.props.userData.teamInfo.code)) ? (
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
            ) : null }

            {(this.props.userData.isLogined && this.props.userData.teamInfo && 
                this.props.userData.teamInfo.code && this.props.userData.userProfile.roleInTeam=="manager") ? (
            <TouchableOpacity 
                  onPress={() => this.props.navigation.navigate("CreateTeam", {isEdit: true})}>
                <View style={styles.rowContainerNoBorder}>
                  <View style={styles.rowIcon}>
                    <Icon type="MaterialCommunityIcons" name="square-edit-outline" style={styles.iconLeft} /></View>
                  <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_EDIT_TEAM")}</Text></View>
                  <View style={styles.rowRightIcon}>
                    <Icon name="arrow-forward" style={styles.iconRight}/></View>
                </View>
            </TouchableOpacity>
            ) : null }
            {(this.props.userData.isLogined && this.props.userData.teamInfo && this.props.userData.teamInfo.code) ? (
            <TouchableOpacity 
                  onPress={() => this.onClickLeaveTeam()}>
                <View style={styles.rowContainerNoBorder}>
                  <View style={styles.rowIcon}>
                    <Icon type="AntDesign" name="logout" style={styles.iconLeft} /></View>
                  <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_LEAVE_TEAM")}</Text></View>
                </View>
            </TouchableOpacity>
            ) : null }


            <View style={styles.cloudSyncRow}>
              <TouchableOpacity 
                  onPress={() => this.syncDataToServer()}>
                <Card style={styles.equalStartRow}>
                  <CardItem>
                    <Body style={{flexDirection:"column", justifyContent:"flex-start", alignItems:"center"}}>
                      <Icon name="cloud-upload" style={styles.iconCloudUp} />
                      <Text style={styles.textNormalSmall}>{AppLocales.t("SETTING_LBL_SYNC_TO")}</Text>
                      <Text style={styles.textNormalSmall}>{AppConstants.SERVER_API}</Text>
                      <Text style={styles.textNormalSmallDate}>
                        {AppLocales.t("SETTING_LBL_SYNC_FROM_LASTSYNC") + ":\n" + AppUtils.formatDateTimeFullVN(this.props.userData.lastSyncToServerOn)}
                      </Text>
                      {/* <Text style={styles.textNormalSmall}>{AppLocales.t("SETTING_LBL_SYNC_TO_NOTE")}</Text> */}
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity 
                  onPress={() => this.syncDataFromServer()}>
                <Card style={styles.equalStartRow}>
                  <CardItem>
                    <Body style={{flexDirection:"column", justifyContent:"flex-start", alignItems:"center"}}>
                      <Icon name="cloud-download" style={styles.iconCloudDown} />
                      <Text style={styles.textNormalSmall}>{AppLocales.t("SETTING_LBL_SYNC_FROM")}</Text>
                      <Text style={styles.textNormalSmallDate}>
                        {AppLocales.t("SETTING_LBL_SYNC_FROM_LASTSYNC") + ":\n" + AppUtils.formatDateTimeFullVN(this.props.userData.lastSyncFromServerOn)}
                      </Text>
                      {/* <Text style={styles.textNormalSmallRed}>{"("+AppLocales.t("SETTING_LBL_SYNC_FROM_NOTE")+")"}</Text> */}
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </View>
            </View> : null}


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
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("ServiceMaintainSetting")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialCommunityIcons" name="timeline-text" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_MAINTAIN")}</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("ServiceModulesSetting")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon name="construct" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>{AppLocales.t("SETTING_LBL_MAINTAIN_MODULES")}</Text></View>
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

            {AppConstants.IS_DEBUG_MODE ? (
            <View>
            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                Debug
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("DebugScreen")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowText}>
                  <Text style={styles.textNormal}>Debug Screen</Text>
                </View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            </View>
            ) : null }
            
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
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 60,
  },

  userInfoContainer: {
    backgroundColor: AppConstants.COLOR_HEADER_BG,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    minHeight: 125,
    paddingTop: 30,
  },
  avatarContainerImage: {
    height: 60,
    width: 60,
    //fontSize: 60,
    //color: AppConstants.COLOR_PICKER_TEXT,
    //color: "white"
  },
  avatarContainer: {
    height: 60,
    width: 60,
    fontSize: 60,
    //color: AppConstants.COLOR_PICKER_TEXT,
    color: "white"
  },

  proContainer: {
    backgroundColor: "#1f77b4",
    paddingBottom: 7,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: -5,
    marginRight: -5,
    minHeight: 125,
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
  rowContainerNoMargin: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", // vertial align
    paddingBottom: 2,
    marginTop: 10
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

  rowForm: {
    width: 270,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    height: 70
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

  textNormalSmall: {
    color: "rgb(80, 80, 80)",
    fontSize: 13
  },
  textNormalSmallDate: {
    color: AppConstants.COLOR_TEXT_LIGHT_INFO,
    fontSize: 11
  },
  textNormalSmallRed: {
    color: "red",
    fontSize: 12
  },
  textNormal: {
    color: "rgb(80, 80, 80)"
  },
  textSection: {
    fontSize: 24,
    color: "rgb(100, 100, 100)"
  },

  cloudSyncRow: {
    marginTop: 7,
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "white"
  },
  equalStartRow: {
      width: Layout.window.width*0.45,
      // height: 120
  },
  iconCloudDown: {
    fontSize: 40,
    color: AppConstants.COLOR_GOOGLE
  },
  iconCloudUp: {
    fontSize: 40,
    color: AppConstants.COLOR_D3_DARK_GREEN
  },

  modalDialog: {
    marginTop: Layout.window.height / 2 - 100,
    marginLeft: Layout.window.width * 0.05,
    width: Layout.window.width * 0.9
  },
})

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData
});
const mapActionsToProps = {
  actVehicleAddVehicle, actVehicleAddFillItem, actVehicleSyncAllFromServer,
  actUserLogout, actUserLoginOK,actVehicleSyncToServerOK,
  actTeamGetDataOK, actTeamGetJoinRequestOK, actTeamUserWillLogout,
  actUserLeaveTeamOK, actTeamLeaveTeamOK,
  actUserStartSyncPrivate,actUserStartSyncPrivateDone,actUserStartSyncTeam,actUserStartSyncTeamDone,
  actUserForCloseModal
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(SettingsScreen);
