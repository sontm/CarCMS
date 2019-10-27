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
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleList:[],
      fillGasList:[],
      fillOilList:[],
      authorizeCarList:[],
    };

    this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this)
  }
  componentDidMount() {
    console.log("HOMESCreen DidMount")
    this.loadFromStorage()
  }
  loadFromStorage = async () => {
    // const vehicleList = await AsyncStorage.getItem(AppContants.STORAGE_VEHICLE_LIST)
    // const fillGasList = await AsyncStorage.getItem(AppContants.STORAGE_FILL_GAS_LIST)
    // const fillOilList = await AsyncStorage.getItem(AppContants.STORAGE_FILL_OIL_LIST)
    // const authorizeCarList = await AsyncStorage.getItem(AppContants.STORAGE_AUTHORIZE_CAR_LIST)
    // JSON.parse(vehicleList).forEach(item => {
    //   this.props.actVehicleAddVehicle(item)
    // })
    // JSON.parse(fillGasList).forEach(item => {
    //   this.props.actVehicleAddFillItem(item)
    // })
    // JSON.parse(fillOilList).forEach(item => {
    //   this.props.actVehicleAddFillItem(item)
    // })
    // JSON.parse(authorizeCarList).forEach(item => {
    //   this.props.actVehicleAddFillItem(item)
    // })

    //this.clearAsyncStorage()
  }
  clearAsyncStorage = async() => {
    AsyncStorage.clear();
  }
  handleDeleteVehicle(vehicleId, licensePlate) {
    this.props.actVehicleDeleteVehicle(vehicleId, licensePlate)
  }

  componentDidUpdate() {
    console.log("HOMESCreen DIDUpdate")
  }
  componentWillReceiveProps(nextProps) {
    console.log("HOMESCreen WillReceiveProps")
  }
  componentWillUnmount() {
    console.log("HOMESCreen Will UnMount")
  }
  render() {
    console.log("HOMESCreen Render")
    return (
      <Container>
        <Header style={{backgroundColor: AppContants.COLOR_PICKER_TEXT}}>
          <Left>
          </Left>
          <Body>
            <Title>Tổng Quan</Title>
          </Body>
          <Right />
        </Header>
        
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              
              <Text> General Reports Here</Text>

            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

HomeScreen.navigationOptions = {
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
)(HomeScreen);

