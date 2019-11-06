import React, { Component } from 'react'
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity, 
    TouchableWithoutFeedback, ProgressViewIOS, ProgressBarAndroid, Alert, Platform } from 'react-native';
import {Content, Button, Text, Icon, Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, CheckBox } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
import AppLocales from '../constants/i18n'
import { connect } from 'react-redux';
import {actTempCalculateCarReport} from '../redux/TempDataReducer'

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
        this.handleEditVehicle = this.handleEditVehicle.bind(this)
    }
    handleEditVehicle() {
        console.log("Edit Vehicle:" + this.props.vehicle.id)
        AppConstants.CURRENT_VEHICLE_ID = this.props.vehicle.id;
        this.props.navigation.navigate("NewVehicle");
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
    componentWillMount() {
        //console.log("VehicleReport WillMount")
    }
    componentDidUpdate() {
        //console.log("VehicleReport DIDUpdate")
    }
    render() {
        // console.log("VehicleReport Render")
        if (this.props.vehicle) {
            var currentVehicle = this.props.vehicle;
        } else {
            var currentVehicle = this.props.userData.vehicleList.find(item => item.id == this.props.vehicle.id);
        }
        if (currentVehicle) {
            this.props.actTempCalculateCarReport(currentVehicle, null, this.props.tempData)
        }
        
        // let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, 
        //     lastDate, lastKm,
        //     arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas}
        //     = AppUtils.getStatForGasUsage(currentVehicle.fillGasList);
        // let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
        //     = AppUtils.getInfoForOilUsage( currentVehicle.fillOilList, lastDate, lastKm, averageKmPerDay);
        // let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
        //     = AppUtils.getInfoCarAuthorizeDate(currentVehicle.authorizeCarList)

        return (
            <Content>
            <TouchableOpacity 
                onPress={() => {
                    AppConstants.CURRENT_VEHICLE_ID = this.props.vehicle.id;
                    this.props.navigation.navigate("VehicleDetail", 
                          {vehicleId: this.props.vehicle.id, vehicle: currentVehicle})
                    }
                }
            >

                <View style={styles.container} elevation={5}>
                    <View style={styles.vehicleInfoRow}>
                        <View style={{flexDirection: "row"}}>
                            <Image
                                source={
                                    require('../assets/images/toyota.png')
                                }
                                style={styles.vehicleLogo}
                            />

                            <View style={styles.vehicleInfoText}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={styles.vehicleInfoTextBrand}>
                                        {this.props.vehicle.brand + " " + this.props.vehicle.model}
                                    </Text>
                                    {this.props.vehicle.isDefault ? <CheckBox checked={true}/> : null}
                                </View>
                                <Text style={styles.vehicleInfoTextPlate}>
                                        {this.props.vehicle.licensePlate}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.rightVehicleButtonViewContainer}>
                            <TouchableOpacity 
                                    onPress={() => this.handleEditVehicle()}>
                                <View style={styles.rightVehicleButtonView}>
                                    <Icon type="Feather" name="edit-3" style={styles.rightVehicleButtonIcon}/>
                                    <Text style={styles.rightVehicleButtonText}>Sửa</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                    onPress={() => this.handleDeleteVehicle()}>
                                <View style={styles.rightVehicleButtonView}>
                                    <Icon type="MaterialIcons" name="delete" style={styles.rightVehicleButtonIconDelete}/>
                                    <Text style={styles.rightVehicleButtonText}>Xoá</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {this.props.tempData.carReports[currentVehicle.id] ? (
                    <View>
                    <View style={styles.statRowRemind}>
                        {Platform.OS === 'ios' ? (
                        <ProgressViewIOS 
                            style={styles.progressBarRemind}
                            progress={this.props.tempData.carReports[currentVehicle.id].oilReport.passedKmFromPreviousOil? 
                                this.props.tempData.carReports[currentVehicle.id].oilReport.passedKmFromPreviousOil/AppConstants.SETTING_KM_NEXT_OILFILL : 0}
                            progressViewStyle = 'default'
                            progressTintColor = "blue"
                            trackTintColor = "rgba(230, 230, 230, 1)"
                            />
                        ) : (
                        <ProgressBarAndroid
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={this.props.tempData.carReports[currentVehicle.id].oilReport.passedKmFromPreviousOil? 
                                this.props.tempData.carReports[currentVehicle.id].oilReport.passedKmFromPreviousOil/AppConstants.SETTING_KM_NEXT_OILFILL : 0}
                            />
                        )}
                        <Text style={styles.textRemind}>
                            {this.props.tempData.carReports[currentVehicle.id].oilReport.passedKmFromPreviousOil}/{AppConstants.SETTING_KM_NEXT_OILFILL} Km
                            ({AppLocales.t("GENERAL_OIL")})
                        </Text>
                    </View>
                    <View style={styles.statRowRemind}>
                        {Platform.OS === 'ios' ? (
                        <ProgressViewIOS 
                            style={styles.progressBarRemind}
                            progress={this.props.tempData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize ?
                                this.props.tempData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize/AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR: 0}
                            progressViewStyle = 'default'
                            progressTintColor = {(this.props.tempData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize ?
                                this.props.tempData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize/AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR: 0) 
                                    > 0.9 ? "red" : "blue"}
                            trackTintColor = "rgba(230, 230, 230, 1)"
                            />
                        ) : (
                        <ProgressBarAndroid
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={this.props.tempData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize ?
                                this.props.tempData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize/AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR: 0}
                            />
                        )}
                        <Text style={styles.textRemind}>
                        {this.props.tempData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize}/{AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR} {AppLocales.t("GENERAL_DAY")} ({AppLocales.t("GENERAL_AUTHROIZE")})
                        </Text>
                    </View>

                    <View style={styles.statRow}>
                        <View style={styles.infoStatRow}>
                        
                            <Body>
                                <Text style={styles.infoCardValue}>
                                    {this.props.tempData.carReports[currentVehicle.id].gasReport.avgKmMonthly ? 
                                        this.props.tempData.carReports[currentVehicle.id].gasReport.avgKmMonthly.toFixed(1) : ""}
                                </Text>
                                <Text style={styles.infoCardText}>Km</Text>
                            </Body>
                      
                        </View>

                        <View style={styles.infoStatRow}>
                            <Body>
                                <Text style={styles.infoCardValue}>
                                    {this.props.tempData.carReports[currentVehicle.id].gasReport.avgMoneyPerKmMonthly ? 
                                    (this.props.tempData.carReports[currentVehicle.id].gasReport.avgMoneyPerKmMonthly).toFixed(0): ""}
                                </Text>
                                <Text style={styles.infoCardText}>đ/Km</Text>
                            </Body>
                        </View>

                        <View style={styles.infoStatRow}>
                            <Body>
                                <Text style={styles.infoCardValue}>
                                    {this.props.tempData.carReports[currentVehicle.id].moneyReport.totalExpenseSpend ? 
                                    (this.props.tempData.carReports[currentVehicle.id].moneyReport.totalExpenseSpend).toFixed(0) : ""}
                                </Text>
                                <Text style={styles.infoCardText}>đ</Text>
                            </Body>
                        </View>
                    </View>
                    </View>
                    ): null }

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

    rightVehicleButtonViewContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        marginRight: 0,
    },
    rightVehicleButtonView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        marginTop: 5
    },
    rightVehicleButtonIcon: {
        fontSize: 20,
        color: "rgb(70,70,70)"
    },
    rightVehicleButtonIconDelete: {
        fontSize: 21,
        color: "rgb(250, 100, 100)"
    },
    rightVehicleButtonText: {
        textAlign: "center",
        fontSize: 12,
        color: "rgb(100,100,100)"
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
    userData: state.userData,
    tempData: state.tempData
});
const mapActionsToProps = {
    actTempCalculateCarReport
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleBasicReport);
