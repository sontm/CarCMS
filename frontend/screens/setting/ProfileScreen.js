import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input, Thumbnail, Label} from 'native-base';

import { HeaderText } from '../../components/StyledText';
import AppConstants from '../../constants/AppConstants'
import AppLocales from '../../constants/i18n'
import { connect } from 'react-redux';

import Backend from '../../constants/Backend'

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            email: "",
            phone: "",
            pictureUrl: null,
            teamName: null,
            message: ""
        };
    }
    componentWillMount() {
        if (this.props.userData && this.props.userData.userProfile&& this.props.userData.userProfile.email) {
            this.setState({
                fullName: this.props.userData.userProfile.fullName,
                email: this.props.userData.userProfile.email,
                phone: this.props.userData.userProfile.phone,
                pictureUrl: this.props.userData.userProfile.pictureUrl,
                teamName: this.props.userData.teamInfo.name
            })
        }
    }

    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.userInfoContainer}>
                        {this.state.pictureUrl ? (
                            <Thumbnail source={{uri: uri}} style={styles.avatarContainer}/>
                        ): (
                            null
                        )}
                    </View>
                    
                    <View style={styles.rowContainer}>
                    <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_FULLNAME")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(fullName) => this.setState({fullName})}
                            value={""+this.state.fullName}
                        />
                    </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_EMAIL")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("USER_PHONE")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("GENERAL_TEAM")+": "}</Label>
                        {this.props.userData.userProfile&&this.props.userData.userProfile.roleInTeam == "manager" ? 
                        (
                            <Input
                                style={styles.rowForm}
                                onChangeText={(teamName) => this.setState({teamName})}
                                value={this.state.teamName}
                            />
                        ) : (this.props.userData.userProfile&&this.props.userData.userProfile.roleInTeam == "member") ?
                            (<Text style={styles.rowForm}>{(this.props.userData.teamInfo && this.props.userData.teamInfo.name) ? (
                            this.props.userData.teamInfo.name) : null}
                        </Text>) : null }
                        </Item>
                    </View>

                    {/* TODO for Edit Profile, also Team name here  */}
                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => {}}
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
            <Title><HeaderText>Profile</HeaderText></Title>
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
    height: 54,
    width: "90%",
    alignSelf:"center"
  },
  rowLabel: {
    flex: 1,
    textAlign: "right",
    paddingRight: 5,
    color: "rgb(120, 120, 120)",
    fontSize:15
  },
  rowForm: {
    flex: 2,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
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

};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ProfileScreen);
