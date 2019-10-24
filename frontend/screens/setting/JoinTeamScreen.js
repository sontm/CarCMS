import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

import AppContants from '../../constants/AppConstants'

import { connect } from 'react-redux';
import {actUserCreateTeamOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';

class JoinTeamScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "ufiATY0u",
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        Backend.joinTeam({
            teamCode: this.state.code
            }, this.props.userData.token, 
            response => {
                console.log("Join Team OK")
                console.log(response.data)
                //this.props.actUserCreateTeamOK(response.data)
                this.props.navigation.navigate("Settings")
            },
            error => {
                console.log("Join Team ERROR")
                console.log((error))
                this.setState({
                    message: "Register Error!"
                })
            }
        );
       
    }
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Code:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Auto Created"
                            onChangeText={(code) => this.setState({code})}
                            value={this.state.code}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.handleSubmit()}
                    ><Text>OK</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

JoinTeamScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Join Team</Title>
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
    height: 50,
    borderWidth: 1,
    borderColor:"grey"
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
)(JoinTeamScreen);
