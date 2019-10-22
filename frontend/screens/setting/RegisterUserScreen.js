import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import AppContants from '../../constants/AppConstants'

import { connect } from 'react-redux';
import {actUserRegisterOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'

class RegisterUserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            email: "t",
            phone: "",
            password: ""
        };

        this.handleSignup = this.handleSignup.bind(this)
    }

    handleSignup() {
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
       
    }
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Email(*):
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Email"
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            FullName:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="FullName"
                            onChangeText={(fullName) => this.setState({fullName})}
                            value={this.state.fullName}
                        />
                        </Item>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Phone:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Phone"
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Password(*):
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Password"
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.handleSignup()}
                    ><Text>OK</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

RegisterUserScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Register User</Title>
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
    actUserRegisterOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(RegisterUserScreen);
