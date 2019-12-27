import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, 
    Icon, Item, Picker, Button, Text, Input, Thumbnail, Label, CheckBox, Toast} from 'native-base';

import { HeaderText } from '../../components/StyledText';
import AppConstants from '../../constants/AppConstants'
import AppLocales from '../../constants/i18n'
import { connect } from 'react-redux';

import Backend from '../../constants/Backend'
import {actUserUpdateProfileOK} from '../../redux/UserReducer';
import NetInfo from "@react-native-community/netinfo";

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            email: "",
            phone: "",
            oldPwd: "",
            newPwd1: "",
            newPwd2: "",
            pictureUrl: null,
            teamName: null,
            message: "",
            isChangePwd: false
        };

        this.togglePwdChange = this.togglePwdChange.bind(this)
    }

    componentWillMount() {
        if (this.props.userData && this.props.userData.userProfile&& this.props.userData.userProfile.email) {
            this.setState({
                fullName: this.props.userData.userProfile.fullName,
                email: this.props.userData.userProfile.email,
                phone: this.props.userData.userProfile.phone,
                pictureUrl: this.props.userData.userProfile.pictureUrl,
                teamName: this.props.userData.teamInfo?this.props.userData.teamInfo.name:""
            })
        }
    }
    togglePwdChange() {
        this.setState({
            isChangePwd: !this.state.isChangePwd
        })
    }
    updateProfile() {
        if (this.state.isChangePwd && this.state.oldPwd.length <= 0) {
            // error
            Toast.show({
                text: AppLocales.t("TOAST_NEED_OLDPWD"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        } else if (this.state.isChangePwd && this.state.newPwd1.length > 0 && this.state.newPwd1 != this.state.newPwd2) {
            // error
            Toast.show({
                text: AppLocales.t("TOAST_NEWPWD_NOTMATCHED"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        } else {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    let newData = {
                        fullName: this.state.fullName,
                        phone: this.state.phone,
                    }
                    if (this.state.isChangePwd) {
                        newData.oldPwd = this.state.oldPwd;
                        newData.newPwd = this.state.newPwd1;
                    }
        
                    Backend.updateUserProfile(newData
                        , this.props.userData.token,
                        response => {
                            console.log(response.data)
                            this.props.actUserUpdateProfileOK(response.data)
                            this.props.navigation.goBack();
                        }, error => {
                            console.log(error)
                            console.log("Update Profile Error!")
                        });
                } else {
                  Toast.show({
                    text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
                    //buttonText: "Okay",
                    position: "top",
                    type: "danger"
                  })
                }
            });
            
            
        }
    }
    render() {
        console.log("this.props.userData.userProfile")
        console.log(this.props.userData.userProfile)
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    {/* <View style={styles.userInfoContainer}>
                        {this.state.pictureUrl ? (
                            <Thumbnail source={{uri: uri}} style={styles.avatarContainer}/>
                        ): (
                            null
                        )}
                    </View>
                     */}
                    <View style={styles.rowContainer}>
                    <Item stackedLabel>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_FULLNAME")}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(fullName) => this.setState({fullName})}
                            value={""+this.state.fullName}
                        />
                    </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_EMAIL")}</Label>
                        <Input
                            disabled
                            style={{...styles.rowForm, backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG}}
                            //onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_PHONE")}</Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                        />
                        </Item>
                    </View>

                    {this.props.userData.userProfile.type == "facebook" ? 
                    <View style={{flexDirection: "row", justifyContent:"flex-start",
                        marginLeft: -10, marginTop: 15, marginBottom: 10}}>
                        <Icon type="Ionicons" name="logo-facebook" style={{fontSize: 22, color: AppConstants.COLOR_FACEBOOK, marginRight: 10}} />
                        <Text style={{...styles.textNormal, color: AppConstants.COLOR_FACEBOOK}}>{"Tài Khoản liên kết Facebook"}</Text>
                    </View>: null}

                    {this.props.userData.userProfile.type == "google" ? 
                    <View style={{flexDirection: "row", justifyContent:"flex-start",
                        marginLeft: -10, marginTop: 15, marginBottom: 10}}>
                        <Icon type="AntDesign" name="google" style={{fontSize: 22, color: AppConstants.COLOR_GOOGLE, marginRight: 10}} />
                        <Text style={{...styles.textNormal, color: AppConstants.COLOR_GOOGLE,}}>{"Tài Khoản liên kết Google"}</Text>
                    </View> : null}

                    {(this.props.userData.userProfile.type != "facebook" && this.props.userData.userProfile.type != "google") ? (
                    <View style={{flexDirection: "row", justifyContent:"flex-start",
                        marginLeft: -10, marginTop: 15, marginBottom: 10}}>
                        <CheckBox checked={this.state.isChangePwd}
                            onPress={() => this.togglePwdChange()}/>
                        <Text onPress={() => this.togglePwdChange()} style={{marginLeft: 12}}>{AppLocales.t("USER_CHANGEPWD")}</Text>
                    </View> ): null}

                    {(this.props.userData.userProfile.type != "facebook" && 
                        this.props.userData.userProfile.type != "google" && this.state.isChangePwd) ? (
                    <View>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_OLDPWD")}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(oldPwd) => this.setState({oldPwd})}
                            value={this.state.oldPwd}
                        />
                        </Item>
                    </View>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_NEWPWD1")}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(newPwd1) => this.setState({newPwd1})}
                            value={this.state.newPwd1}
                        />
                        </Item>
                    </View>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_NEWPWD2")}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(newPwd2) => this.setState({newPwd2})}
                            value={this.state.newPwd2}
                        />
                        </Item>
                    </View>
                    </View>
                    ) : null}

                    

                    {/* TODO for Edit Profile, also Team name here  */}
                    <View style={styles.rowButton}>
                    <Button
                        rounded primary
                        onPress={() => this.updateProfile()}
                    ><Text>{AppLocales.t("GENERAL_EDITDATA")}</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

ProfileScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_PROFILE")}</HeaderText></Title>
          </Body>
          <Right style={{flex: 0}}/>
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 2,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  userInfoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  avatarContainer: {
    height: 60,
    width: 60,
    fontSize: 60,
    color: AppConstants.COLOR_PICKER_TEXT
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    justifyContent: "center",
    //height: 60,
    //width: "90%",
    alignSelf:"center"
  },
  rowContainerDisabled: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    justifyContent: "center",
    //height: 60,
    //width: "90%",
    alignSelf:"center",
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG
  },
  rowLabel: {
    //flex: 1,
    //textAlign: "right",
    //paddingRight: 5,
    color: "rgb(120, 120, 120)",
    fontSize:15
  },
  rowForm: {
    //flex: 2,
    //borderBottomColor: "rgb(230, 230, 230)",
    //borderBottomWidth: 0.5
  },
  rowButton: {
    marginTop: 20,
    width: 150,
    alignItems: "center",
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actUserUpdateProfileOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ProfileScreen);
