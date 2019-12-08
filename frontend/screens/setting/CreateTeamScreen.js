import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, 
    Item, Picker, Button, Text, Input,Label } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actUserCreateTeamOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';

class CreateTeamScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            id: 0
        };

        this.handleCreate = this.handleCreate.bind(this)
    }

    componentWillMount() {
        if (this.props.navigation.state.params.isEdit) {
            // Edit mode
            if (this.props.userData.teamInfo && this.props.userData.teamInfo.name) {
                this.setState({
                    name: this.props.userData.teamInfo.name,
                    code: this.props.userData.teamInfo.code,
                    id: this.props.userData.teamInfo.id,
                })
            }
        } else {
            this.setState({
                code: apputils.makeRandomAlphaNumeric(8)
            })
        }
    }
    handleCreate() {
        if (this.props.navigation.state.params.isEdit) {
            Backend.createTeam({
                id: this.state.id,
                name: this.state.name,
                code: this.state.code
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
                    this.setState({
                        message: "Edit Error!"
                    })
                }
            );
        } else {
            Backend.createTeam({
                name: this.state.name,
                code: this.state.code
                }, this.props.userData.token, 
                response => {
                    console.log("REgister Team OK")
                    console.log(response.data)
                    this.props.actUserCreateTeamOK(response.data)
                    this.props.navigation.navigate("Settings")
                },
                error => {
                    console.log("Register Team ERROR")
                    console.log((error))
                    // TODO: Toast
                    this.setState({
                        message: "Register Error!"
                    })
                }
            );
        }
       
    }
    render() {
        console.log("******TEam info")
        console.log(this.state)
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item floatingLabel>
                        <Label>{AppLocales.t("GENERAL_NAME")+" "+AppLocales.t("GENERAL_TEAM")}
                        </Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainerDisable}>
                        <Item floatingLabel>
                        <Label>{AppLocales.t("GENERAL_TEAM_CODE_SHORT")+" ("+
                            AppLocales.t("GENERAL_RANDOM")+")"}
                        </Label>
                        <Input
                            disabled
                            style={styles.rowForm}
                            value={this.state.code}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.handleCreate()}
                    >
                        <Text>
                        {this.props.navigation.state.params.isEdit ? (
                            AppLocales.t("GENERAL_EDITDATA")
                        ): (
                            AppLocales.t("GENERAL_ADD")
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
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
  },
  rowContainerDisable: {
    marginTop: 7,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center", // vertial align
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG
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
