import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

import AppContants from '../../constants/AppConstants'

import { connect } from 'react-redux';
import {actUserCreateTeamOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';

class CreateTeamScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
        };

        this.handleCreate = this.handleCreate.bind(this)
    }

    componentWillMount() {
        this.setState({
            code: apputils.makeRandomAlphaNumeric(8)
        })
    }
    handleCreate() {
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
                            Name:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Name"
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Code:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Auto Created"
                            value={this.state.code}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.handleCreate()}
                    ><Text>OK</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

CreateTeamScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppContants.COLOR_HEADER_BG}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Create Team</Title>
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
)(CreateTeamScreen);
