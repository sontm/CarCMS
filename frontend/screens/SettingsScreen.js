import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';

import { connect } from 'react-redux';
import Backend from '../constants/Backend';

import {actVehicleAddVehicle, actVehicleAddFillItem} from '../redux/VehicleReducer';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.syncDataToServer = this.syncDataToServer.bind(this)
    this.syncDataFromServer = this.syncDataFromServer.bind(this)
  }
  syncDataToServer() {
    Backend.postFillItemList(this.props.vehicleData.vehicleList, "vehicle",
      response => {console.log("Sync Post Vehicle OK")},
      error => {console.log(error)}
    );

    Backend.postFillItemList(this.props.vehicleData.fillGasList, "gas",
      response => {console.log("Sync Post Gas OK")},
      error => {console.log(error)}
    );
    Backend.postFillItemList(this.props.vehicleData.fillOilList, "oil",
      response => {console.log("Sync Post Oil OK")},
      error => {console.log(error)}
    );
    Backend.postFillItemList(this.props.vehicleData.authorizeCarList, "authcheck",
      response => {console.log("Sync Post AuthCheck OK")},
      error => {console.log(error)}
    );
    Backend.postFillItemList(this.props.vehicleData.expenseList, "expense",
      response => {console.log("Sync Post Expense OK")},
      error => {console.log(error)}
    );
    Backend.postFillItemList(this.props.vehicleData.serviceList, "service",
      response => {console.log("Sync Post Service OK")},
      error => {console.log(error)}
    );
  }
  syncDataFromServer() {
    Backend.getAllItemList("vehicle",
      response => {
        console.log("Sync Vehicle From Server OK");
        this.props.actVehicleAddVehicle(response.data, true)
      },
      error => {console.log(error)}
    );

    Backend.getAllItemList("gas",
      response => {
        console.log("Sync Gas From Server OK");
        this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_GAS, true)
      },
      error => {console.log(error)}
    );
    Backend.getAllItemList("oil",
      response => {
        console.log("Sync Oil From Server OK");
        this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_OIL, true)
      },
      error => {console.log(error)}
    );
    Backend.getAllItemList("authcheck",
      response => {
        console.log("Sync authcheck From Server OK");
        this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_AUTH, true)
      },
      error => {console.log(error)}
    );
    Backend.getAllItemList("expense",
      response => {
        console.log("Sync expense From Server OK");
        this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_EXPENSE, true)
      },
      error => {console.log(error)}
    );
    Backend.getAllItemList("service",
      response => {
        console.log("Sync service From Server OK");
        this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_SERVICE, true)
      },
      error => {console.log(error)}
    );
  }

  render() {
    return (
        <Container>
        <Content>
        <View style={styles.container}>
            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                    Pro Version Features
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialCommunityIcons" name="crown" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Pro Version</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.syncDataFromServer()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Octicons" name="sync" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Synchronize From Server</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => this.syncDataToServer()}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Octicons" name="sync" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Upload To Server</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>


            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                    Setting
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("VehicleSetting")}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialIcons" name="settings" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Vehicle Setting</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="MaterialIcons" name="access-alarm" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Remind Setting</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>


            <View style={styles.textRow}>
                <Text style={styles.textSection}>
                    Tai Khoan
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="FontAwesome" name="user-circle" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Profile</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => {}}>
              <View style={styles.rowContainer}>
                <View style={styles.rowIcon}>
                  <Icon type="Foundation" name="mail" style={styles.iconLeft} /></View>
                <View style={styles.rowText}><Text style={styles.textNormal}>Contact</Text></View>
                <View style={styles.rowRightIcon}>
                  <Icon name="arrow-forward" style={styles.iconRight}/></View>
              </View>
            </TouchableOpacity>
        </View>
        </Content>
        </Container>
    )
    }
}

SettingsScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
          </Left>
          <Body>
            <Title>More Settings</Title>
          </Body>
          <Right>
             <Button transparent onPress={() => {}}>
              <Icon name="search" />
            </Button>
          </Right>
        </Header>
    )
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    marginLeft: 3,
    marginRight: 3
  },

  textRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingLeft: 5,
    justifyContent: "flex-start",
    flexWrap: "wrap",
    flexGrow: 100,
    marginTop: 5
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    margin: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowIcon: {
    flex: 1,
    textAlign: "left",
  },
  iconLeft: {
    fontSize: 24,
    color: "rgb(80,80,80)"
  },
  rowText: {
    marginLeft: 5,
    flex: 9,
  },
  rowRightIcon: {
    flex: 1,
    flexDirection:"row",
    justifyContent: "flex-end",
  },
  iconRight: {
    fontSize: 20,
    color: "grey"
  },

  textNormal: {
    color: "rgb(80, 80, 80)"
  },
  textSection: {
    fontSize: 24,
    color: "rgb(100, 100, 100)"
  }
})

const mapStateToProps = (state) => ({
    vehicleData: state.vehicleData
});
const mapActionsToProps = {
  actVehicleAddVehicle, actVehicleAddFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(SettingsScreen);
