import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker,
     Button, Text, Input, Label, Toast } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import AppConstants from '../../constants/AppConstants'
import {HeaderText} from '../../components/StyledText'
import { connect } from 'react-redux';
import {actUserRegisterOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import AppLocales from '../../constants/i18n'
import NetInfo from "@react-native-community/netinfo";

class RegisterUserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "Tester",
            email: "tester",
            phone: "Phone123",
            password: "123456",
            isShowPwd: false
        };

        this.handleSignup = this.handleSignup.bind(this)
    }

    handleSignup() {
        // Validate 
        if (!this.state.fullName || !this.state.email || !this.state.password) {
            Toast.show({
                text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                //buttonText: "Okay",
                type: "danger"
            })
        } else {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    Backend.registerUser({
                        email: this.state.email,
                        password: this.state.password,
                        fullName: this.state.fullName,
                        phone: this.state.phone,
                        }, 
                        response => {
                            console.log("REgister OK")
                            console.log(response.data)
                            this.props.actUserRegisterOK()
                            this.props.navigation.navigate("Settings")
                        },
                        error => {
                            console.log("Register ERROR")
                            console.log(error)
                            this.setState({
                                message: "Register Error!"
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
       
    }
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                            <Label>Email</Label>
                            {!this.state.email ?
                            <Label style={{color: "red"}}>*</Label>
                            : null}
                        </View>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            keyboardType="email-address"
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                            <Label>{AppLocales.t("GENERAL_PWD")}</Label>
                            {!this.state.password ?
                            <Label style={{color: "red"}}>*</Label>
                            : null}
                        </View>
                        <Item style={{...styles.rowForm, borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            {/* <Label>{AppLocales.t("GENERAL_PWD")}</Label> */}
                            <Input
                                secureTextEntry={this.state.isShowPwd ? false : true}
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password}
                            />
                            <TouchableOpacity 
                            onPress={() => this.setState({isShowPwd: !this.state.isShowPwd})}>
                            <Icon name={this.state.isShowPwd ? "eye-off" : "eye"} />
                            </TouchableOpacity>
                        </Item>
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                            <Label>{AppLocales.t("GENERAL_FULLNAME")}</Label>
                            {!this.state.fullName ?
                            <Label style={{color: "red"}}>*</Label>
                            : null}
                        </View>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(fullName) => this.setState({fullName})}
                            value={this.state.fullName}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                            <Label>{AppLocales.t("GENERAL_PHONE")}</Label>
                        </View>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                            keyboardType="phone-pad"
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.handleSignup()}
                    ><Text>{AppLocales.t("SETTING_LBL_SIGNUP")}</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

RegisterUserScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{flex: 5}}>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_SIGNUP")}</HeaderText></Title>
          </Body>
          <Right style={{flex: 0}}/>
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    justifyContent: "center",
    width: AppConstants.DEFAULT_FORM_WIDTH,
    marginTop: 10,
    alignSelf:"center"
    // borderWidth: 1,
    // borderColor:"grey"
  },
  rowForm: {
    flex: 2,
    borderBottomColor: "rgb(210, 210, 210)",
    borderBottomWidth: 0.5,
    width: AppConstants.DEFAULT_FORM_WIDTH,
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actUserRegisterOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(RegisterUserScreen);
