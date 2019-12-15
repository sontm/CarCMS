import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {Container, Header, Title, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, ScrollableTab, ListItem } from 'native-base';
import Layout from '../constants/Layout'
import {HeaderText} from '../components/StyledText'
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';

import {actVehicleDeleteFillItem} from '../redux/UserReducer'

import AppLocales from '../constants/i18n'

// vehicleList: {brand: "Kia", model: "Cerato", licensePlate: "18M1-78903", checkedDate: "01/14/2019", id: 3}
// fillGasList: {vehicleId: 2, fillDate: "10/14/2019, 11:30:14 PM", amount: 2, price: 100000, currentKm: 123344, id: 1}
// fillOilList: {vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1}
class VehicleDetailHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        vehicle: {},
    };

    this.renderHistoryList = this.renderHistoryList.bind(this)

    this.handleDeleteItem = this.handleDeleteItem.bind(this)
    this.handleEditItem = this.handleEditItem.bind(this)
  }
  componentDidMount() {
    //console.log("DetailReport DidMount:" + this.props.navigation.state.params.vehicleId)
    //AppConstants.CURRENT_VEHICLE_ID = this.props.navigation.state.params.vehicleId;
  }

  componentWillReceiveProps(nextProps) {
    console.log("DetailReport WillReceiveProps")
  }
  handleEditItem(id, type) {
    if (this.props.navigation.state.params.isMyVehicle) {
        AppConstants.CURRENT_EDIT_FILL_ID = id;
        if (type == AppConstants.FILL_ITEM_GAS) {
            this.props.navigation.navigate("FillGas");
        } else if (type == AppConstants.FILL_ITEM_OIL) {
            this.props.navigation.navigate("FillOil");
        } else if (type == AppConstants.FILL_ITEM_AUTH) {
            this.props.navigation.navigate("CarAuthorize");
        } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
            this.props.navigation.navigate("PayExpense");
        } else if (type == AppConstants.FILL_ITEM_SERVICE) {
            this.props.navigation.navigate("PayService");
        }
    }
    
  }
  handleDeleteItem(itemId, type) {
    Alert.alert(
        'Do You Want to Delete ?' + itemId + "," + type,
        "",
        [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Delete', style: 'destructive' , onPress: () => {
                console.log('Delete Pressed')
                this.props.actVehicleDeleteFillItem(itemId, type, this.props.userData)
            }},
        ],
        {cancelable: true}
    )
  }


    renderHistoryList() {
        console.log("renderHistoryList, VehicleID:" + AppConstants.CURRENT_VEHICLE_ID)
        if (this.props.navigation && this.props.navigation.state.params && this.props.navigation.state.params.vehicle) {
            var thisVehicle = this.props.navigation.state.params.vehicle;
        } else {
            var thisVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
        }
        let displayDatas = [...thisVehicle.authorizeCarList, ...thisVehicle.fillGasList,
            ...thisVehicle.expenseList, ...thisVehicle.serviceList];
        // Sort this data as Time order
        let yearList = [];
        displayDatas.sort(function(a, b) {
            let aDate = new Date(a.fillDate);
            let bDate = new Date(b.fillDate);

            return bDate - aDate;
        })
        displayDatas.forEach(item => {
            let aDate = new Date(item.fillDate);
            if (yearList.indexOf(""+aDate.getFullYear()) < 0) {
                yearList.push(""+aDate.getFullYear())
            }
        })
        
        let dataByYear= {};
        displayDatas.forEach(item => {
            let aDate = new Date(item.fillDate);
            if (!dataByYear[""+aDate.getFullYear()]) {
                // New Key
                dataByYear[""+aDate.getFullYear()] = [item]
            } else {
                dataByYear[""+aDate.getFullYear()].push(item)
            }
        })
        console.log(dataByYear)
        let historyView = [];
        for (var prop in dataByYear) {
            if (Object.prototype.hasOwnProperty.call(dataByYear, prop)) {
                historyView.push(<Tab heading={prop} key={prop} 
                    tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                    activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
                <Content>
                {dataByYear[""+prop].map(item => {
                    return (
                        <ListItem icon key={item.id} style={styles.listItemRow} key={item.type+"-"+item.id}>
                            <Left style={{marginLeft: -10}}>
                                {item.type == AppConstants.FILL_ITEM_GAS ? (
                                    <Button style={{ backgroundColor: AppConstants.COLOR_FILL_FUEL }}>
                                        <Icon active type="MaterialCommunityIcons" name="fuel" style={{fontSize: 15}}/>
                                    </Button>
                                ) :
                                (item.type == AppConstants.FILL_ITEM_OIL) ? (
                                    <Button style={{ backgroundColor: "#007AFF" }}>
                                        <Icon active type="MaterialCommunityIcons" name="oil" style={{fontSize: 15}} />
                                    </Button>
                                ) :
                                (item.type == AppConstants.FILL_ITEM_AUTH) ? (
                                    <Button style={{ backgroundColor: "#3cc97b" }}>
                                        <Icon active type="Octicons" name="verified" style={{fontSize: 15}} />
                                    </Button>
                                ) : (item.type == AppConstants.FILL_ITEM_EXPENSE) ? (
                                    <Button style={{ backgroundColor: "gold" }}>
                                        <Icon active type="MaterialIcons" name="attach-money" style={{fontSize: 15}}/>
                                    </Button>
                                ) : (item.type == AppConstants.FILL_ITEM_SERVICE) ? (
                                    <Button style={{ backgroundColor: "#df43fa" }}>
                                        <Icon active type="Octicons" name="tools" style={{fontSize: 15}}/>
                                    </Button>
                                ) :null
                                }
                            </Left>
                            
                            <Body>
                            <TouchableOpacity onPress={() => this.handleEditItem(item.id, item.type)} key={item.id}>
                                <Text style={styles.listMainText}>{AppUtils.getNameOfFillItemType(item.type, item.isConstantFix, item)}
                                {". " + AppUtils.formatDateMonthDayYearVN(item.fillDate)}</Text>
                                <Text style={styles.listSubText}>{item.price + " đ. " + 
                                    ((item.serviceModule) ? AppUtils.objNameToStringSequence(item.serviceModule) 
                                        : (item.currentKm ? (item.currentKm + "Km, ")
                                        : ((item.subType && item.subType.length>0) ? item.subType : ""
                                        )))}</Text>
                            </TouchableOpacity>
                            </Body>
                            <Right style={{marginRight: -10}}>
                                {this.props.navigation.state.params.isMyVehicle ? (
                                <TouchableOpacity 
                                        onPress={() => this.handleEditItem(item.id, item.type)}>
                                    <View style={{alignItems: "center"}}>
                                    <Icon type="Feather" name="edit-3" style={styles.listItemEditIcon}/>
                                    <Text style={{fontSize: 10, alignItems: "center"}}>{AppLocales.t("GENERAL_EDIT_SHORT")}</Text>
                                    </View>
                                </TouchableOpacity>
                                ) : null }
                                {this.props.navigation.state.params.isMyVehicle ? (
                                <TouchableOpacity 
                                        onPress={() => this.handleDeleteItem(item.id, item.type)}>
                                    <View style={{alignItems: "center"}}>
                                    <Icon type="MaterialIcons" name="delete" style={styles.listItemDeleteIcon}/>
                                    <Text style={{fontSize: 10, alignItems: "center"}}>{AppLocales.t("GENERAL_DELETE_SHORT")}</Text>
                                    </View>
                                </TouchableOpacity>
                                ) : null }
                            </Right>
                        </ListItem>
                        )
                    }
                )}
                </Content>
                </Tab>
                )
            }
        }

        return (
            <Tabs renderTabBar={()=> <ScrollableTab tabsContainerStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}/>}>
                {historyView}
            </Tabs>
        )
    }

  render() {
    console.log("DetailReport Render:" + AppConstants.CURRENT_VEHICLE_ID)

    if (this.props.navigation && this.props.navigation.state.params && this.props.navigation.state.params.vehicle) {
        var currentVehicle = this.props.navigation.state.params.vehicle;
    } else {
        var currentVehicle = this.props.userData.vehicleList.find(
        item => item.id == AppConstants.CURRENT_VEHICLE_ID);
    }
    return (
        <Container>
        <Header hasTabs style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{flex: 6}}>
            <Title><HeaderText>{AppLocales.t("GENERAL_HISTORY")+ " " +
                currentVehicle.brand + " " + currentVehicle.model + " "+ currentVehicle.licensePlate}</HeaderText></Title>
          </Body>
          <Right style={{flex: 0}}>
          </Right>
        </Header>
        {this.renderHistoryList()}
        
        </Container>
    )
    }
}

VehicleDetailHistory.navigationOptions = ({navigation}) => ({
    header: null
});

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      marginTop: 10,
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: 20
    },


    vehicleInfoRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 20
    },
    vehicleLogo: {
        width: 78,
        height: 78,
        resizeMode: 'contain',
        marginTop: 2,
        marginLeft: 5,
        marginRight: 10
    },
    vehicleInfoText: {
        flexDirection:"column",
        justifyContent: "space-around"
    },
    vehicleInfoTextBrand: {
        fontSize: 25
    },
    vehicleInfoTextPlate: {
        fontSize: 20,
        color: "blue"
    },

    listItemRow: {
        marginTop: 7
    },
    listMainText: {
        fontSize: 15,
        color: "rgb(60, 60,60)"
    },
    listSubText: {
        fontSize: 13,
        color: "rgb(120, 120,120)",
        fontStyle: "italic"
    },
    listItemDeleteIcon: {
        color: "rgb(250, 100, 100)",
        fontSize: 20
    },
    listItemEditIcon: {
        color: "rgb(70,70,70)",
        fontSize: 18
    },
})

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actVehicleDeleteFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleDetailHistory);
