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
class GasUsageReport extends React.Component {
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
  onDataPointClick(value, dataset, getcolor, dataToDisplay) {
      Toast.show({
        text: "" + AppUtils.formatDateMonthYearVN(dataToDisplay[value.index].x) + ": " + 
            dataToDisplay[value.index].y.toFixed(0),
        //buttonText: "Okay",
        type: "danger"
      })
  }

  calculateAllVehicleGasUsage(numberOfMonth) {
    let arrGasKmAllCars = [];
    let arrGasMoneyAllCars = [];
    let arrGasMoneyPerKmAllCars = [];
    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {
        var {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
          arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
          avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
          = this.props.userData.carReports[element.id].gasReport;

        // let dataChartKitLine = AppUtils.convertVictoryDataToChartkitData(arrTotalKmMonthly,
        //   (t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`)
        
        // arrGasAllCars.push(dataChartKitLine)
        arrGasKmAllCars.push(arrTotalKmMonthly)
        arrGasMoneyAllCars.push(arrTotalMoneyMonthly)
        arrGasMoneyPerKmAllCars.push(arrTotalMoneyPerKmMonthly)
      }
    })
    return {arrGasKmAllCars, arrGasMoneyAllCars, arrGasMoneyPerKmAllCars};
  }

  calculateAllVehicleGasUsageTeam(numberOfMonth) {
    let arrGasKmAllCars = [];
    let arrGasMoneyAllCars = [];
    let arrGasMoneyPerKmAllCars = [];
    this.props.teamData.teamCarList.forEach(element => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        var {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
          arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
          avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
          = this.props.teamData.teamCarReports[element.id].gasReport;

        // let dataChartKitLine = AppUtils.convertVictoryDataToChartkitData(arrTotalKmMonthly,
        //   (t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`)
        
        // arrGasAllCars.push(dataChartKitLine)
        if (arrTotalKmMonthly && arrTotalKmMonthly.length > 0) {
            arrGasKmAllCars.push(arrTotalKmMonthly)
        }
        if (arrTotalMoneyMonthly && arrTotalMoneyMonthly.length > 0) {
            arrGasMoneyAllCars.push(arrTotalMoneyMonthly)
        }
        if (arrTotalMoneyPerKmMonthly && arrTotalMoneyPerKmMonthly.length > 0) {
            arrGasMoneyPerKmAllCars.push(arrTotalMoneyPerKmMonthly)
        }
      }
    })
    return {arrGasKmAllCars, arrGasMoneyAllCars, arrGasMoneyPerKmAllCars};
  }

  render() {
    console.log("DetailReport Render:" + AppConstants.CURRENT_VEHICLE_ID)
    //isTotalReport mean this is used in Home screen or Team screen
    if (this.props.currentVehicle || this.props.isTotalReport) { //props
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
                    var {arrGasKmAllCars, arrGasMoneyAllCars, arrGasMoneyPerKmAllCars} = this.calculateAllVehicleGasUsageTeam(12);
                } else {
                    var {arrGasKmAllCars, arrGasMoneyAllCars, arrGasMoneyPerKmAllCars} = this.calculateAllVehicleGasUsage(12);
                }
                var avgKmMonthly = AppUtils.calculateAverageOfArray(arrGasKmAllCars, 2).avg;
                var avgMoneyMonthly = AppUtils.calculateAverageOfArray(arrGasMoneyAllCars, 2).avg;
                var avgMoneyPerKmMonthly = AppUtils.calculateAverageOfArray(arrGasMoneyPerKmAllCars, 2).avg;
                if (this.state.activeDisplay == 1) {
                    var dataToDisplay = arrGasMoneyAllCars;
                } else if (this.state.activeDisplay == 2) {
                    var dataToDisplay = arrGasMoneyPerKmAllCars;
                } else {
                    var dataToDisplay = arrGasKmAllCars;
                }
            } else {
                var {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
                    arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
                    avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
                    = this.props.userData.carReports[this.props.currentVehicle.id].gasReport;
                if (this.state.activeDisplay == 1) {
                    var dataToDisplay = arrTotalMoneyMonthly;
                } else if (this.state.activeDisplay == 2) {
                    var dataToDisplay = arrTotalMoneyPerKmMonthly;
                } else {
                    var dataToDisplay = arrTotalKmMonthly;
                }
            }
        }

        // } else {
        //     if (this.state.activeDisplay == 1) {
        //         var dataToDisplay = this.props.userData.carReports[this.props.currentVehicle.id].gasReport.arrTotalMoneyMonthly;
        //     } else if (this.state.activeDisplay == 2) {
        //         var dataToDisplay = this.props.userData.carReports[this.props.currentVehicle.id].gasReport.arrTotalMoneyPerKmMonthly;
        //     } else {
        //         var dataToDisplay = this.props.userData.carReports[this.props.currentVehicle.id].gasReport.arrTotalKmMonthly;
        //     }
        // }
        if (!AppConstants.TEMPO_USE_BARCHART_GAS) {
            let dataChartKitLine = AppUtils.convertVictoryDataToChartkitData(dataToDisplay,
                (t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`)
        }
        if (avgMoneyPerKmMonthly > averageMoneyPerKmPerDay) {
            // This time Use so Much, 
            var iconInfoUsage= (
                <Icon type="Entypo" name="arrow-long-up" 
                    style={{color: "#d62728", marginLeft: 5}} />
            )
        } else if (avgMoneyPerKmMonthly < averageMoneyPerKmPerDay) {
            // This time Use so Much, 
            var iconInfoUsage= (
                <Icon type="Entypo" name="arrow-long-down" 
                    style={{color: "#2ca02c", marginLeft: 5}} />
            )
        }

        // const mydata = {
        //     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        //     datasets: [{
        //       data: [ 20, 45, 28, 80, 99, 43 ],
        //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        //       strokeWidth: 2 // optional
        //     }]
        // }
        return (
            <View style={styles.container}>
                <View style={styles.textRow}>
                    <Text><H2>
                        {this.props.isTotalReport ? 
                            AppLocales.t("HOME_GAS_USAGE") :
                            AppLocales.t("CARDETAIL_H1_GAS_USAGE")}
                    </H2></Text>
                    <Segment small>
                        <Button small first onPress={() => this.setState({activeDisplay: 0})}
                            active={this.state.activeDisplay === 0}>
                            <Text style={{fontSize: 12}}>Km</Text></Button>
                        <Button small  onPress={() => this.setState({activeDisplay: 1})}
                            active={this.state.activeDisplay === 1}>
                            <Text style={{fontSize: 12}}>đ</Text></Button>
                        <Button small last  onPress={() => this.setState({activeDisplay: 2})}
                            active={this.state.activeDisplay === 2}>
                            <Text style={{fontSize: 12}}>đ/Km</Text></Button>
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

                {AppConstants.TEMPO_USE_BARCHART_GAS ? (
                    <View style={styles.gasUsageContainer}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={300}
                            padding={{top:10,bottom:30,left:50,right:20}}
                        >
                        {/* TODO, Date X axis not Match */}
                        <VictoryStack
                            width={Layout.window.width}
                            domainPadding={{y: [0, 10], x: [10, 0]}}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        >
                        {this.props.isTotalReport ? (
                            dataToDisplay.map((item, idx) => (
                                <VictoryBar
                                key={idx}
                                data={item}
                                />
                            ))
                        ) : (
                            <VictoryBar
                                data={dataToDisplay}
                            />
                        )}
                        </VictoryStack>
                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`}
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
                            tickFormat={(t) => `${AppUtils.formatMoneyToK(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 12, padding: 0}
                            }}
                        />

                        </VictoryChart>
                    </View>
                ): (
                <View style={styles.gasUsageContainer}>
                    {dataChartKitLine.labels.length > 0 ? (
                    <LineChart
                        data={dataChartKitLine}
                        width={Layout.window.width}
                        height={300}
                        withDots={true}
                        withInnerLines={false}
                        onDataPointClick={(value, dataset, getcolor) => {
                            this.onDataPointClick(value, dataset, getcolor, dataToDisplay)
                        }}
                        verticalLabelRotation={45}
                        chartConfig={{
                            backgroundGradientFrom: "#03528a",
                            backgroundGradientFromOpacity: 1,
                            backgroundGradientTo: "#52038a",
                            backgroundGradientToOpacity: 1,
                            fillShadowGradient:"#dddddd",
                            fillShadowGradientOpacity: 0.2,
                            // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            color: (opacity = 1) => `rgba(255, 255, 255, 1)`,
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.9
                        }}
                    />) : (null)
                    }
                </View>
                )}

                {this.state.duration != AppLocales.t("GENERAL_ALL") ? (
                <View>
                <View style={styles.textRow}>
                    <Text><H2>
                    {AppLocales.t("CARDETAIL_AVERAGE_IN")}{this.state.duration + " " + durationTypeToVietnamese(this.state.durationType)}
                    </H2></Text>
                </View>
                <View style={styles.statRow}>
                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H2>{avgKmMonthly ? 
                                avgKmMonthly.toFixed(1) : ""}</H2></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>
                            Km/{AppLocales.t("GENERAL_MONTH")}
                            </Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H2>{avgMoneyMonthly ?
                             (avgMoneyMonthly).toFixed(0): ""}</H2></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>đ/{AppLocales.t("GENERAL_MONTH")}</Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header  style={{flexDirection: "row", alignItems: "center"}}>
                            <Text><H2>{avgMoneyPerKmMonthly ?
                             (avgMoneyPerKmMonthly).toFixed(0) : ""}</H2></Text>
                            {iconInfoUsage}
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>đ/Km</Text>
                        </Body>
                        </CardItem>
                    </Card>
                </View>
                </View>
                ): null}
                
            </View>
        )
    } else {
        return (
            <Container>
            <Content>
            <View style={styles.container}>

            </View>
            </Content>
            </Container>
        )
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
        height: 350,
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
)(GasUsageReport);
