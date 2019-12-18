import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, 
    Button, Text, Input, Label, Card, CardItem } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actUserCreateTeamOK} from '../../redux/UserReducer'
import {actTeamGetDataOK, actTeamGetJoinRequestOK} from '../../redux/TeamReducer'

import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import NetInfo from "@react-native-community/netinfo";

class JoinTeamScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "ZU2YE8yE",
            teamsByMe: []
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentWillMount() {
        // Get all team created by this User
        Backend.getTeamsCreatedByMe(this.props.userData.token,
            response => {
                console.log(response.data)
                this.setState({
                    teamsByMe: response.data
                })
            }, error => {
                console.log("getTeamsCreatedByMe ERROR")
            })
    }
    onReJoinTeamOfMe(item) {
        if (item && item.code) {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    Backend.rejoinTeam({code: item.code}, this.props.userData.token,
                        response => {
                            console.log("===============onReJoinTeamOfMe Data")
                            console.log(response.data)
                            // Rejoin team can ReUse Create Team
                            this.props.actUserCreateTeamOK(response.data)
                            // Sync Team Data heare also
                            Backend.getAllUserOfTeam({teamId: this.props.userData.userProfile.teamId}, this.props.userData.token, 
                            response2 => {
                                console.log("GEt all Member in Team OK")
    
                                this.props.actTeamGetDataOK(response2.data, this.props.userData, this.props.teamData)
                            },
                            error => {
                                console.log("GEt all Member in Team ERROR")
                                console.log(JSON.stringify(error))
                                this.setState({
                                    message: "Get Team Data Error!"
                                })
                            }
                            );
                    
                            Backend.getAllJoinTeamRequest(this.props.userData.token, 
                            response3 => {
                                console.log("GEt all JoinRequest OK")
                                this.props.actTeamGetJoinRequestOK(response3.data)
                            },
                            error => {
                                console.log("GEt all JoinRequest ERROR")
                                console.log(JSON.stringify(error))
                                this.setState({
                                    message: "Login Error!"
                                })
                            })

                            this.props.navigation.goBack()
                        }, err => {
                            console.log("rejoinTeam ERROR")
                    })
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
    handleSubmit() {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                Backend.joinTeam({
                    teamCode: this.state.code
                    }, this.props.userData.token, 
                    response => {
                        console.log("Join Team OK")
                        console.log(response.data)
                        //this.props.actUserCreateTeamOK(response.data)
                        //this.props.navigation.navigate("Settings")
                        
                        


                        this.props.navigation.goBack()
                    },
                    error => {
                        console.log("Join Team ERROR")
                        console.log((error))
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
    render() {
        console.log("---------------------this.props.userData.teamInfo")
        console.log(this.props.userData.teamInfo)
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label>
                            {AppLocales.t("SETTING_LBL_JOIN_TEAM_CODE")}
                        </Label>
                        <Input
                            onChangeText={(code) => this.setState({code})}
                            value={this.state.code}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.handleSubmit()}
                        ><Text>{AppLocales.t("SETTING_LBL_JOIN_TEAM")}</Text></Button>
                    </View>

                    {this.state.teamsByMe.length > 0 ? (
                    <Text style={{marginTop: 20, marginBottom: 7, fontSize: 18}}>
                        {AppLocales.t("SETTING_LBL_JOIN_CREATEDTEAM")+":"}
                    </Text>
                    ) : null}

                    {this.state.teamsByMe.map(item => (
                    <TouchableOpacity onPress={() => this.onReJoinTeamOfMe(item)} key={item.code}>
                    <Card key={"card"+item.code}>
                        <CardItem>
                        <Body>
                            <Text style={{fontWeight: "bold", fontSize: 16}}>
                            {item.name}
                            </Text>
                            <Text style={{fontStyle: "italic", fontSize: 13}}>
                            {item.code}
                            </Text>
                            <Text style={{fontSize: 13}}>
                            {item.canMemberViewReport ? 
                            (AppLocales.t("SETTING_LBL_MEM_CAN_VIEWREPORT")) :
                            (AppLocales.t("SETTING_LBL_MEM_CANNOT_VIEWREPORT"))}
                            </Text>
                        </Body>
                        </CardItem>
                    </Card>
                    </TouchableOpacity>
                    ))}


                </View>
            </Content>
            </Container>
        );
    }
}

JoinTeamScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.SETTING_LBL_JOIN_TEAM}</HeaderText></Title>
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
    //height: 50,
    //borderWidth: 1,
    //borderColor:"grey"
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
    marginTop: 10,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData
});
const mapActionsToProps = {
    actUserCreateTeamOK, actTeamGetDataOK, actTeamGetJoinRequestOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(JoinTeamScreen);
