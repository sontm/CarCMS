import React, { Component } from 'react'
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity, 
    TouchableWithoutFeedback, ProgressViewIOS, Alert } from 'react-native';
import {Content, Button, Text, Icon, Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';

const data = [
    { x: new Date("2018-01-15"), y: 13000 },
    { x: new Date("2018-02-15"), y: 16500 },
    { x: new Date("2018-03-15"), y: 14250 },
    { x: new Date("2018-05-15"), y: 19000 }
  ];

// props.vehicle
    // brand: '',
    // model: '',
    // licensePlate: '',
    // checkedDate:

// props.vehicleList:[],
    //   fillGasList:[],
    //   fillOilList:[],
    //   authorizeCarList: []
class VehicleBasicReport extends Component {
    constructor(props) {
        super(props);

        this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this)
    }
    handleDeleteVehicle() {
        Alert.alert(
            'Do You Want to Delete?',
            this.props.vehicle.brand + " " + this.props.vehicle.model + ", " + this.props.vehicle.licensePlate,
            [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Delete', style: 'destructive' , 
                    onPress: () => this.props.handleDeleteVehicle(this.props.vehicle.id, this.props.vehicle.licensePlate)},
            ],
            {cancelable: true}
        )

    }
    componentDidUpdate() {
        console.log("VehicleReport DIDUpdate")
    }
    render() {
        console.log("VehicleReport Render")
        let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, lastDate, lastKm,
            arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas}
            = AppUtils.getStatForGasUsage(this.props.vehicleData.fillGasList, this.props.vehicle.id);
        let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
            = AppUtils.getInfoForOilUsage( this.props.vehicleData.fillOilList, this.props.vehicle.id, lastDate, lastKm, averageKmPerDay);
        let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
            = AppUtils.getInfoCarAuthorizeDate(this.props.vehicleData.authorizeCarList, this.props.vehicle.id)

        return (
            <Content>
            <TouchableOpacity 
                onPress={() => {
                    AppConstants.CURRENT_VEHICLE_ID = this.props.vehicle.id;
                    this.props.navigation.navigate("VehicleDetail", 
                          {vehicleId: this.props.vehicle.id})
                    }
                }
            >

                <View style={styles.container} elevation={5}>
                    <View style={styles.vehicleInfoRow}>
                        <Image
                            source={
                                require('../assets/images/toyota.png')
                            }
                            style={styles.vehicleLogo}
                        />

                        <View style={styles.vehicleInfoText}>
                        <Text style={styles.vehicleInfoTextBrand}>
                            {this.props.vehicle.brand + " " + this.props.vehicle.model}
                        </Text>
                        <Text style={styles.vehicleInfoTextPlate}>
                            {this.props.vehicle.licensePlate}
                        </Text>
                        </View>

                        <View style={styles.vehicleButtons}>
                            <Button danger transparent style={styles.vehicleButtonItem}
                                onPress={this.handleDeleteVehicle}>
                                <Icon type="MaterialIcons" name="delete" />
                            </Button>
                        </View>
                    </View>

                    <View style={styles.statRowRemind}>
                        <ProgressViewIOS 
                            style={styles.progressBarRemind}
                            progress={passedKmFromPreviousOil? 
                                passedKmFromPreviousOil/AppConstants.SETTING_KM_NEXT_OILFILL : 0}
                            progressViewStyle = 'default'
                            progressTintColor = "blue"
                            trackTintColor = "rgba(230, 230, 230, 1)"
                            />
                        <Text style={styles.textRemind}>
                            {passedKmFromPreviousOil}/{AppConstants.SETTING_KM_NEXT_OILFILL} Km (Next Oil)
                        </Text>
                    </View>
                    <View style={styles.statRowRemind}>
                        <ProgressViewIOS 
                            style={styles.progressBarRemind}
                            progress={diffDayFromLastAuthorize ?
                                diffDayFromLastAuthorize/AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR: 0}
                            progressViewStyle = 'default'
                            progressTintColor = {(diffDayFromLastAuthorize ?
                                diffDayFromLastAuthorize/AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR: 0) 
                                    > 0.9 ? "red" : "blue"}
                            trackTintColor = "rgba(230, 230, 230, 1)"
                            />
                        <Text style={styles.textRemind}>
                        {diffDayFromLastAuthorize}/{AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR} Day (Next Authorize)
                        </Text>
                    </View>

                    <View style={styles.statRow}>
                        <View style={styles.infoStatRow}>
                        
                            <Body>
                                <Text style={styles.infoCardValue}>
                                    {averageKmPerLiter ? averageKmPerLiter.toFixed(1) : ""}
                                </Text>
                                <Text style={styles.infoCardText}>Km/Litre</Text>
                            </Body>
                      
                        </View>

                        <View style={styles.infoStatRow}>
                            <Body>
                                <Text style={styles.infoCardValue}>
                                    {averageKmPerDay ? (averageKmPerDay*7).toFixed(0): ""}
                                </Text>
                                <Text style={styles.infoCardText}>Km/Week</Text>
                            </Body>
                        </View>

                        <View style={styles.infoStatRow}>
                            <Body>
                                <Text style={styles.infoCardValue}>
                                    {averageMoneyPerDay ? (averageMoneyPerDay*7).toFixed(0) : ""}
                                </Text>
                                <Text style={styles.infoCardText}>VND/Week</Text>
                            </Body>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
            </Content>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 6,
        marginBottom: 6,
        backgroundColor: "white",
        flexDirection: "column",
        borderRadius: 0,
        borderColor: "rgb(220, 220, 220)",
        borderWidth: 1,
        justifyContent: "flex-start",

        shadowColor: "#777777",
        shadowOpacity: 0.4,
        shadowRadius: 3,
        shadowOffset: {
            height: 3,
            width: 1
        }
    },


    vehicleInfoRow: {
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    vehicleLogo: {
        width: 56,
        height: 56,
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
        fontSize: 22
    },
    vehicleInfoTextPlate: {
        fontSize: 18,
        color: "blue"
    },
    vehicleButtons: {
        alignSelf: "flex-start",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        marginRight: -10
    },
    vehicleButtonItem: {
        margin: 0,
        padding: 0
    },

    statRowRemind: {
        flexDirection: "row",
        padding: 3,
        justifyContent: "flex-start"
    },
    progressBarRemind: {
        transform: [{ scaleX: 1.0 }, { scaleY: 2.5 }],
        width: "40%",
        alignSelf: "center"
    },
    textRemind: {
        paddingLeft: 10,
        fontSize: 14,
    },  

    statRow: {
        flexDirection: "row",
        paddingBottom: 3,
        paddingTop: 5,
        justifyContent: "center",
    },
    infoStatRow: {
        flex: 1,
        borderRightColor: "rgb(220,220,220)",
        borderRightWidth: 0.5,
    },
    infoCardValue: {
        fontSize: 20,
    },
    infoCardText: {
        fontSize: 14
    },
    
})

const mapStateToProps = (state) => ({
    vehicleData: state.vehicleData
});
const mapActionsToProps = {
    
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleBasicReport);
