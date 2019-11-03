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

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Picker, Fab } from 'native-base';

import { MonoText } from '../components/StyledText';
import VehicleBasicReport from '../components/VehicleBasicReport'
import AppContants from '../constants/AppConstants'
import {actVehicleDeleteVehicle, actVehicleAddVehicle} from '../redux/UserReducer'
import Layout from '../constants/Layout'
import AppLocales from '../constants/i18n'

function getNameOfSortType(type) {
  if (type == "auth") return "Lịch Đăng Kiểm";
  if (type == "oil") return "Lịch Thay Dầu";
  if (type == "kmLarge") return "Đi Nhiều";
  if (type == "kmSmall") return "Đi Ít";
  if (type == "gasBest") return "Hiệu Suất Xăng Tốt";
  if (type == "gasWorst") return "Hiệu Suất Xăng Kém";
  if (type == "moneyMonthlyLarge") return "Số Tiền Hàng Tháng Lớn";
  if (type == "moneyMonthlySmall") return "Số Tiền Hàng Tháng Nhỏ";
  return "Default";
}

// vehicleList: {brand: "Kia", model: "Cerato", licensePlate: "18M1-78903", checkedDate: "01/14/2019", id: 3}
// fillGasList: {vehicleId: 2, fillDate: "10/14/2019, 11:30:14 PM", amount: 2, price: 100000, currentKm: 123344, id: 1}
// fillOilList: {vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1}
class MyVehicleScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortType: "auth",
      changedSort: false
    };

    this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this)
    this.onSortChange = this.onSortChange.bind(this)
    this.onClearChange = this.onClearChange.bind(this)
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
  onSortChange(value) {
    this.setState({
      sortType: value,
      changedSort: true
    })
  }
  onClearChange() {
    this.setState({
      changedSort: false,
      sortType: "auth"
    })
  }
  
  render() {
    console.log("MyVehicleScreen Render")
    return (
      <Container>
        <Header>
          <View style={styles.filterHeaderInfo}>
            <View style={styles.filterHeaderInfoLeftButton}>
              {this.state.changedSort? (
              <Button transparent onPress={this.onClearChange}>
                <Icon type="MaterialIcons" name="clear" />
              </Button>
              ) : null}
            </View>

            {this.state.changedSort? (
              <Title style={styles.filterHeaderInfoText}>Sắp Xếp:{" "+getNameOfSortType(this.state.sortType)}</Title>
            ): (
              <Title style={styles.filterHeaderInfoTextDefault}>{AppLocales.t("MYCAR_HEADER")}</Title>
            )}
          </View>
          <Right style={{flex: 1}}> 
            <Picker
                mode="dropdown"
                placeholder={<Icon type="MaterialCommunityIcons" name="sort" style={{fontSize: 24, color: "blue"}}/>}
                //iosIcon={<Icon type="FontAwesome5" name="caret-down" style={{fontSize: 16, color: "grey"}}/>}
                //selectedValue="year2"
                onValueChange={this.onSortChange.bind(this)}
                textStyle={{ color: AppContants.COLOR_PICKER_TEXT}}
                >
                <Picker.Item label={getNameOfSortType("auth")} value="auth" />
                <Picker.Item label={getNameOfSortType("oil")} value="oil" />
                <Picker.Item label={getNameOfSortType("kmLarge")} value="kmLarge" />
                <Picker.Item label={getNameOfSortType("kmSmall")} value="kmSmall" />
                <Picker.Item label={getNameOfSortType("gasBest")} value="gasBest" />
                <Picker.Item label={getNameOfSortType("gasWorst")} value="gasWorst" />
                <Picker.Item label={getNameOfSortType("moneyMonthlyLarge")} value="moneyMonthlyLarge" />
                <Picker.Item label={getNameOfSortType("moneyMonthlySmall")} value="moneyMonthlySmall" />
            </Picker>
          </Right>
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
  filterHeaderInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 4,
  },
  filterHeaderInfoLeftButton: {
    flex: 1,
    paddingLeft: 0,
    marginLeft: 0
  },
  filterHeaderInfoText: {
    flex: 3,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  filterHeaderInfoTextDefault: {
    flex: 3,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold"
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
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

