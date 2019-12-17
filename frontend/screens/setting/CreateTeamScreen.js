import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, 
    Item, Picker, Button, Text, Input,Label, Toast, CheckBox } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actUserCreateTeamOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import NetInfo from "@react-native-community/netinfo";

class CreateTeamScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            id: 0,
            canMemberViewReport: true,
            excludeMyCar: false
        };

        this.handleCreate = this.handleCreate.bind(this)
        this.toogleMemberCanViewReport = this.toogleMemberCanViewReport.bind(this)
        this.toggleExcludeMyCar = this.toggleExcludeMyCar.bind(this)
        
        
    }

    componentWillMount() {
        if (this.props.navigation.state.params.isEdit) {
            // Edit mode
            if (this.props.userData.teamInfo && this.props.userData.teamInfo.code) {
                this.setState({
                    name: this.props.userData.teamInfo.name,
                    code: this.props.userData.teamInfo.code,
                    id: this.props.userData.teamInfo.id,
                    canMemberViewReport: this.props.userData.teamInfo.canMemberViewReport,
                    excludeMyCar: this.props.userData.teamInfo.excludeMyCar ? true : false
                })
            }
        } else {
            this.setState({
                code: apputils.makeRandomAlphaNumeric(12)
            })
        }
    }
    toogleMemberCanViewReport() {
        this.setState({
            canMemberViewReport: !this.state.canMemberViewReport
        })
    }
    toggleExcludeMyCar() {
        this.setState({
            excludeMyCar: !this.state.excludeMyCar
        })
    }
    handleCreate() {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                if (this.props.navigation.state.params.isEdit) {
                    // Edit TEam NAme
                    Backend.createTeam({
                        id: this.state.id,
                        name: this.state.name,
                        code: this.state.code,
                        canMemberViewReport: this.state.canMemberViewReport,
                        excludeMyCar: this.state.excludeMyCar
                        }, this.props.userData.token, 
                        response => {
                            console.log("Edit Team OK")
                            console.log(response.data)
                            this.props.actUserCreateTeamOK(response.data)
                            this.props.navigation.navigate("Settings")
                        },
                        error => {
                            console.log("Edit Team ERROR")
                            console.log((error))
                            // TODO: Toast
                            
                        }
                    );
                } else {
                    // Create new Team
                    Backend.createTeam({
                        name: this.state.name,
                        code: this.state.code,
                        canMemberViewReport: this.state.canMemberViewReport,
                        excludeMyCar: this.state.excludeMyCar
                        }, this.props.userData.token, 
                        response => {
                            console.log("REgister Team OK")
                            console.log(response.data)
                            this.props.actUserCreateTeamOK(response.data)
                            //this.props.navigation.navigate("Settings")
                            this.props.navigation.goBack()
                        },
                        error => {
                            console.log("Register Team ERROR")
                            console.log((error.response.data))
                            // TODO: Toast
                            Toast.show({
                                text: error.response.data.msg,
                                position: "top",
                                //buttonText: "Okay",
                                type: "danger"
                            })
                            this.props.navigation.goBack()
                        }
                    );
                }
            } else {
              Toast.show({
                text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
                //buttonText: "Okay",
                type: "danger"
              })
            }
        });
        
       
    }
    render() {
        console.log("******TEam info")
        console.log(this.state)
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label>{AppLocales.t("GENERAL_NAME")+" "+AppLocales.t("GENERAL_TEAM")}
                        </Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label>{AppLocales.t("GENERAL_TEAM_CODE_SHORT")+" ("+
                            AppLocales.t("GENERAL_RANDOM")+")"}
                        </Label>
                        <Input
                            disabled
                            style={{...styles.rowForm, backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG}}
                            value={this.state.code}
                        />
                        </Item>
                    </View>

                    <View style={{flexDirection: "row", justifyContent:"flex-start",
                        marginLeft: -10, marginTop: 15, marginBottom: 10}}>
                        <CheckBox checked={this.state.canMemberViewReport}
                            onPress={() => this.toogleMemberCanViewReport()}/>
                        <Text onPress={() => this.toogleMemberCanViewReport()} style={{marginLeft: 12, fontSize: 13}}>
                            {AppLocales.t("SETTING_LBL_CREATE_TEAM_MEM_CANVIEWREPORT")}
                        </Text>
                    </View>

                    <View style={{flexDirection: "row", justifyContent:"flex-start",
                        marginLeft: -10, marginTop: 15, marginBottom: 10}}>
                        <CheckBox checked={this.state.excludeMyCar}
                            onPress={() => this.toggleExcludeMyCar()}/>
                        <Text onPress={() => this.toggleExcludeMyCar()} style={{marginLeft: 12, fontSize: 13}}>
                            {AppLocales.t("SETTING_LBL_CREATE_TEAM_EXCLUDE_MYCAR")}
                        </Text>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        rounded primary
                        onPress={() => this.handleCreate()}
                    >
                        <Text>
                        {this.props.navigation.state.params.isEdit ? (
                            AppLocales.t("SETTING_LBL_EDIT_TEAM")
                        ): (
                            AppLocales.t("SETTING_LBL_CREATE_TEAM")
                        )}
                        </Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

CreateTeamScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>
                {navigation.state.params.isEdit ? (
                    AppLocales.t("SETTING_LBL_EDIT_TEAM")
                ): (
                    AppLocales.t("SETTING_LBL_CREATE_TEAM")
                )}
            </HeaderText></Title>
          </Body>
          <Right />
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: AppConstants.DEFAULT_FORM_PADDING_HORIZON,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    width: AppConstants.DEFAULT_FORM_WIDTH,
    marginTop: 12,
  },
  rowContainerDisable: {
    marginTop: 7,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center", // vertial align
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    marginTop: 12,
  },
  rowLabel: {
    flex: 1,
    textAlign: "right",
    paddingRight: 5
  },
  rowForm: {
    flex: 2
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
    actUserCreateTeamOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(CreateTeamScreen);
