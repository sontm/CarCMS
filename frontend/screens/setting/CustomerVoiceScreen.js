import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Textarea,
     Button, Text, Input, Label, Toast } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import AppConstants from '../../constants/AppConstants'
import {HeaderText} from '../../components/StyledText'
import { connect } from 'react-redux';
import {actUserRegisterOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import AppLocales from '../../constants/i18n'
import NetInfo from "@react-native-community/netinfo";
import apputils from '../../constants/AppUtils';

class CustomerVoiceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            email: "",
            content: "",
            codeRandom: "",
            codeTyped: ""
        };

        this.handleSignup = this.handleSignup.bind(this)
    }

    componentWillMount(){
        this.setState({
            codeRandom: ""+apputils.makeRandomNumeric(6)
        })
    }

    handleSignup() {
        // Validate 
        if (!this.state.title || !this.state.email || !this.state.content) {
            Toast.show({
                text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                //buttonText: "Okay",
                position:"top",
                type: "danger"
            })
        } else if (this.state.codeRandom != this.state.codeTyped) {
            Toast.show({
                text: AppLocales.t("TOAST_CONFIRM_CODE_NG"),
                //buttonText: "Okay",
                position:"top",
                type: "danger"
            })
        } else {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    Backend.sendCustomerVoice({
                        email: this.state.email,
                        title: this.state.title,
                        content: this.state.content,
                        }, 
                        response => {
                            console.log("Send Customer Voice OK")
                            console.log(response.data)
                            Toast.show({
                                text: AppLocales.t("TOAST_SEND_CUSTOMERVOICE_OK"),
                                //buttonText: "Okay",
                                position:"top",
                                type: "success"
                            })

                            this.props.navigation.goBack()
                        },
                        error => {
                            console.log("Send Customer Voice ERROR")
                            console.log(error)
                        }
                    );
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
                            <Label>{AppLocales.t("SETTING_LBL_CUSTOMERVOICE_TITLE")}</Label>
                            {!this.state.title ?
                            <Label style={{color: "red"}}>*</Label>
                            : null}
                        </View>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(title) => this.setState({title})}
                            value={this.state.title}
                        />
                        </Item>
                    </View>


                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <View style={{flexDirection:"row", alignSelf:"flex-start", width: AppConstants.DEFAULT_FORM_WIDTH}}>
                        <Label>{AppLocales.t("SETTING_LBL_CUSTOMERVOICE_CODE")+"'" + this.state.codeRandom + "'"}</Label>
                            {!this.state.codeTyped ?
                            <Label style={{color: "red"}}>*</Label>
                            : null}

                        </View>
                        <Input
                            onChangeText={(codeTyped) => this.setState({codeTyped: codeTyped})}
                            value={this.state.codeTyped}
                        />
                        </Item>
                    </View>


                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <View style={{flexDirection:"row", alignSelf:"flex-start", width: AppConstants.DEFAULT_FORM_WIDTH}}>
                            <Label>{AppLocales.t("SETTING_LBL_CUSTOMERVOICE_CONTENT")}</Label>
                            {!this.state.content ?
                            <Label style={{color: "red"}}>*</Label>
                            : null}
                        </View>
                        <Textarea
                            style={styles.rowForm}
                            onChangeText={(content) => this.setState({content})}
                            value={this.state.content}
                            rowSpan={4} bordered
                        />
                        </Item>
                    </View>


                    <View style={styles.rowButton}>
                    <Button
                        rounded style={{backgroundColor:AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.handleSignup()}
                    ><Text>{AppLocales.t("SETTING_LBL_CUSTOMERVOICE")}</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

CustomerVoiceScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{flex: 5}}>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_CUSTOMERVOICE")}</HeaderText></Title>
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
    flexDirection: "column",
    paddingBottom: 80,
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
)(CustomerVoiceScreen);