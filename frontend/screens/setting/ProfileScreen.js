import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import AppContants from '../../constants/AppConstants'

import { connect } from 'react-redux';

import Backend from '../../constants/Backend'

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            email: "",
            phone: "",
            message: ""
        };
    }
    componentWillMount() {
        if (this.props.userData && this.props.userData.userProfile&& this.props.userData.userProfile.email) {
            this.setState({
                fullName: this.props.userData.userProfile.fullName,
                email: this.props.userData.userProfile.email,
                phone: this.props.userData.userProfile.phone,
            })
        }
    }

    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
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
                            Email:
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
                    
                    {/* <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.handleLogin()}
                    ><Text>OK</Text></Button>
                    </View> */}

                </View>
            </Content>
            </Container>
        );
    }
}

ProfileScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppContants.COLOR_HEADER_BG}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
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

};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ProfileScreen);
