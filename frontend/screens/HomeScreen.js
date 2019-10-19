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
import {actVehicleDeleteVehicle, actVehicleAddFillGas, actVehicleAddVehicle, 
  actVehicleAddFillOil, actVehicleAddCarAuthorize} from '../redux/VehicleReducer'

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
    const vehicleList = await AsyncStorage.getItem(AppContants.STORAGE_VEHICLE_LIST)
    const fillGasList = await AsyncStorage.getItem(AppContants.STORAGE_FILL_GAS_LIST)
    const fillOilList = await AsyncStorage.getItem(AppContants.STORAGE_FILL_OIL_LIST)
    const authorizeCarList = await AsyncStorage.getItem(AppContants.STORAGE_AUTHORIZE_CAR_LIST)
    // JSON.parse(vehicleList).forEach(item => {
    //   this.props.actVehicleAddVehicle(item)
    // })
    // JSON.parse(fillGasList).forEach(item => {
    //   this.props.actVehicleAddFillGas(item)
    // })
    // JSON.parse(fillOilList).forEach(item => {
    //   this.props.actVehicleAddFillOil(item)
    // })
    // JSON.parse(authorizeCarList).forEach(item => {
    //   this.props.actVehicleAddCarAuthorize(item)
    // })
    // this.setState({
    //   vehicleList: JSON.parse(vehicleList),
    //   fillGasList: JSON.parse(fillGasList),
    //   fillOilList: JSON.parse(fillOilList),
    //   authorizeCarList: JSON.parse(authorizeCarList),
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
              {this.props.vehicleData.vehicleList && this.props.vehicleData.vehicleList.map(item => (
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

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {

  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

const mapStateToProps = (state) => ({
  vehicleData: state.vehicleData
});
const mapActionsToProps = {
  actVehicleDeleteVehicle, actVehicleAddFillGas, actVehicleAddVehicle, 
  actVehicleAddFillOil, actVehicleAddCarAuthorize
};

export default connect(
  mapStateToProps,mapActionsToProps
)(HomeScreen);

