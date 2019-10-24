import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from 'native-base';

import { MonoText } from '../components/StyledText';
import VehicleBasicReport from '../components/VehicleBasicReport'
import AppContants from '../constants/AppConstants'
import {actVehicleDeleteVehicle, actVehicleAddVehicle} from '../redux/UserReducer'

// vehicleList: {brand: "Kia", model: "Cerato", licensePlate: "18M1-78903", checkedDate: "01/14/2019", id: 3}
// fillGasList: {vehicleId: 2, fillDate: "10/14/2019, 11:30:14 PM", amount: 2, price: 100000, currentKm: 123344, id: 1}
// fillOilList: {vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1}
class MyVehicleScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this)
  }
  componentDidMount() {
    console.log("HOMESCreen DidMount")
  }
 
  clearAsyncStorage = async() => {
    AsyncStorage.clear();
  }
  handleDeleteVehicle(vehicleId, licensePlate) {
    this.props.actVehicleDeleteVehicle(vehicleId, licensePlate)
  }

  componentDidUpdate() {
    console.log("MyVehicleScreen DIDUpdate")
  }
  componentWillReceiveProps(nextProps) {
    console.log("MyVehicleScreen WillReceiveProps")
  }
  componentWillUnmount() {
    console.log("MyVehicleScreen Will UnMount")
  }
  render() {
    console.log("MyVehicleScreen Render")
    return (
      <Container>
        <Header>
          <Left>
          </Left>
          <Body>
            <Title>HomeScreen</Title>
          </Body>
          <Right />
        </Header>
        
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              {this.props.userData.vehicleList && this.props.userData.vehicleList.map(item => (
                <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={this.handleDeleteVehicle}
                  navigation={this.props.navigation} {...this.state}
                />
              ))}

            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

MyVehicleScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {

  },
});

const mapStateToProps = (state) => ({
  userData: state.userData
});
const mapActionsToProps = {
  actVehicleDeleteVehicle, actVehicleAddVehicle
};

export default connect(
  mapStateToProps,mapActionsToProps
)(MyVehicleScreen);

