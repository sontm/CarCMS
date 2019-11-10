import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, Picker, Form, DatePicker, Toast } from 'native-base';
import Layout from '../constants/Layout'
import { connect } from 'react-redux';
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
// import { LineChart, Grid } from 'react-native-svg-charts'

import AppLocales from '../constants/i18n'

import {
    LineChart
  } from "react-native-chart-kit";

const MYDATA = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]

function durationTypeToVietnamese(durationType) {
    if (durationType == "month") {
        return "Tháng";
    } else if (durationType == "quarter") {
        return "Quý";
    } else if (durationType == "year") {
        return "Năm";
    }
}
class GasUsageTopReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        duration: 12,
        durationType: "month", // quarter, year
        activeDisplay: 0, // 0: Km, 1:Money, 2: Money/KM
        tillDate: new Date(),
    };

    this.displayByFilter = false;
  }

  onValueChangeDuration(value) {
    this.setState({
        duration: value
    });
    this.displayByFilter = true;
  }

  onValueChangeDurationType(value) {
    this.setState({
        durationType: value
    });
    this.displayByFilter = true;
  }
  // TODO for change Date
  onSetDateOption(newDate) {
    console.log(newDate)
    this.setState({
        tillDate: newDate
    });
    this.displayByFilter = true;
  }
  calculateEachVehicleGasUsageTeam(numberOfMonth) {
    let arrGasKmEachCars = [];
    let arrGasMoneyEachCars = [];
    let arrGasMoneyPerKmEachCars = [];
    this.props.teamData.teamCarList.forEach((element, carIdx) => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        var {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
          arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
          avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
          = this.props.teamData.teamCarReports[element.id].gasReport;

        //let xValue = carIdx + 1;
        let xValue = element.licensePlate;
        let thisKm = {x: xValue, y: 0};
        if (arrTotalKmMonthly && arrTotalKmMonthly.length) {
            arrTotalKmMonthly.forEach(item => {
                thisKm.y += item.y;
            })
            if (thisKm.y > 0) {
                arrGasKmEachCars.push(thisKm);
            }
        }
        let thisMoney = {x: xValue, y: 0};
        if (arrTotalMoneyMonthly && arrTotalMoneyMonthly.length) {
            arrTotalMoneyMonthly.forEach(item => {
                thisMoney.y += item.y;
            })
            if (thisMoney.y > 0) {
                arrGasMoneyEachCars.push(thisMoney);
            }
        }
        let thisMoneyPerKm = {x: xValue, y: 0};
        if (arrTotalMoneyPerKmMonthly && arrTotalMoneyPerKmMonthly.length) {
            let countAvg = 0;
            arrTotalMoneyPerKmMonthly.forEach(item => {
                thisMoneyPerKm.y += item.y;
                countAvg++;
            })
            thisMoneyPerKm.y = thisMoneyPerKm.y/countAvg;
            if (thisMoneyPerKm.y > 0) {
                arrGasMoneyPerKmEachCars.push(thisMoneyPerKm);
            }
        }
      }
    })
    return {arrGasKmEachCars, arrGasMoneyEachCars, arrGasMoneyPerKmEachCars};
  }

  render() {
    console.log("GasUsageTopReport Render:" + AppConstants.CURRENT_VEHICLE_ID)
    //isTotalReport mean this is used in Home screen or Team screen
    if (this.props.isTotalReport) { //props
        if (this.displayByFilter) {
            var {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
                arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
                avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
                = AppUtils.getStatForGasUsage(this.props.currentVehicle.fillGasList, 
                    this.state.duration, this.state.durationType, this.state.tillDate);
            if (this.state.activeDisplay == 1) {
                var dataToDisplay = arrTotalMoneyMonthly;
            } else if (this.state.activeDisplay == 2) {
                var dataToDisplay = arrTotalMoneyPerKmMonthly;
            } else {
                var dataToDisplay = arrTotalKmMonthly;
            }
        } else {
            if (this.props.isTotalReport) {
                if (this.props.isTeamDisplay) {
                    var {arrGasKmEachCars, arrGasMoneyEachCars, arrGasMoneyPerKmEachCars}
                        = this.calculateEachVehicleGasUsageTeam(12);
                }
                if (this.state.activeDisplay == 1) {
                    var dataTopToDisplay = arrGasMoneyEachCars;
                } else if (this.state.activeDisplay == 2) {
                    var dataTopToDisplay = arrGasMoneyPerKmEachCars;
                } else {
                    var dataTopToDisplay = arrGasKmEachCars;
                }
        }

        return (
            <View style={styles.container}>
                <View style={styles.textRow}>
                    <Text><H3>
                        {this.state.activeDisplay == 1 ? 
                            AppLocales.t("TEAM_REPORT_TOP_CAR_GASUSAGE_MONEY") :
                        (this.state.activeDisplay == 2 ?  
                            AppLocales.t("TEAM_REPORT_TOP_CAR_GASUSAGE_MONEYKM") :
                            AppLocales.t("TEAM_REPORT_TOP_CAR_GASUSAGE_KM"))}
                    </H3></Text>
                    <Segment small>
                        <Button small first onPress={() => this.setState({activeDisplay: 0})}
                            style={this.state.activeDisplay === 0 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 0 ? styles.activeSegmentText : styles.inActiveSegmentText}>Km</Text></Button>
                        <Button small  onPress={() => this.setState({activeDisplay: 1})}
                            style={this.state.activeDisplay === 1 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 1 ? styles.activeSegmentText : styles.inActiveSegmentText}>đ</Text></Button>
                        <Button small last  onPress={() => this.setState({activeDisplay: 2})}
                            style={this.state.activeDisplay === 2 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 2 ? styles.activeSegmentText : styles.inActiveSegmentText}>đ/Km</Text></Button>
                    </Segment>
                </View>
                <View style={styles.textRowOption}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.duration}
                        onValueChange={this.onValueChangeDuration.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        style={{width: 75}}
                        >
                        <Picker.Item label="6" value={6} />
                        <Picker.Item label="9" value={9} />
                        <Picker.Item label="12" value={12} />
                        <Picker.Item label="18" value={18} />
                        <Picker.Item label="24" value={24} />
                        <Picker.Item label={AppLocales.t("GENERAL_ALL")} value={AppLocales.t("GENERAL_ALL")} />
                    </Picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.durationType}
                        onValueChange={this.onValueChangeDurationType.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        style={{width: 75}}
                        >
                        <Picker.Item label="Tháng" value="month" />
                        <Picker.Item label="Quý" value="quarter" />
                        <Picker.Item label="Năm" value="year" />
                    </Picker>
                    <Text style={{fontSize: 13, marginLeft: 10}}>Gần Nhất Đến</Text>
                    <DatePicker
                        defaultDate={new Date()}
                        minimumDate={new Date(2010, 1, 1)}
                        maximumDate={new Date(2100, 12, 31)}
                        locale={"vi"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        placeHolderText={"Hôm Nay"}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        placeHolderTextStyle={{ color: "#1f77b4" }}
                        onDateChange={this.onSetDateOption.bind(this)}
                        disabled={false}
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                    />
                </View>
                    
                <View style={styles.gasUsageContainer}>
                    <VictoryChart
                        width={Layout.window.width}
                        height={300}
                        padding={{top:10,bottom:30,left:50,right:20}}
                    >
                    <VictoryStack
                        width={Layout.window.width}
                        domainPadding={{y: [0, 10], x: [20, 10]}}
                        colorScale={AppConstants.COLOR_SCALE_10}
                    >
                        <VictoryBar
                            data={dataTopToDisplay}
                        />
                    </VictoryStack>
                    <VictoryAxis
                        crossAxis
                        standalone={false}
                        //tickFormat={(t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`}
                        tickLabelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                        // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                        style={{
                            // grid: {stroke: "rgb(240,240,240)"},
                            ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 12,padding: 5, angle: 30}
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        standalone={false}
                        //tickFormat={(t) => `${AppUtils.formatMoneyToK(t)}`}
                        // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                        style={{
                            ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 12, padding: 0}
                        }}
                    />

                    </VictoryChart>
                </View>
            </View>
        )}
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flexDirection: "column",
      borderWidth: 0.5,
      borderColor: "grey",
      justifyContent: "space-between",
      marginBottom: 20,
      borderRadius: 7,
    },

    activeSegment: {
        backgroundColor: AppConstants.COLOR_BUTTON_BG,
        color:"white",
    },
    inActiveSegment: {
        backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
        color:AppConstants.COLOR_PICKER_TEXT,
    },
    activeSegmentText: {
        color:"white",
        fontSize: 12
    },
    inActiveSegmentText: {
        color:AppConstants.COLOR_PICKER_TEXT,
        fontSize: 12
    },

    textRow: {
        flexDirection: "row",
        paddingTop: 10,
        paddingLeft: 5,
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        flexGrow: 100
    },
    textRowOption: {
        flexDirection: "row",
        paddingTop: 5,
        paddingLeft: 5,
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        flexGrow: 100
    },
    statRow: {
        flexDirection: "row",
        padding: 3,
        justifyContent: "center",
        flexWrap: "wrap",
        flexGrow: 100,
        // backgroundColor: "white"
    },
    equalStartRow: {
        flex: 1,
    },
    statRowLabel: {
        flex: 1,
        textAlign: "right",
        paddingRight: 5
    },
    statRowValue: {
        flex: 2
    },

    gasUsageContainer: {
        width: "96%",
        height: 320,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },

})

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(GasUsageTopReport);