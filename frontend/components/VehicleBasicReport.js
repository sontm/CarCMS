import React, { Component } from 'react'
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage } from 'react-native';
import {Button, Text, Icon, Card, CardItem, Body, H1, ActionSheet } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea} from 'victory-native';

const BUTTONS = [
    { text: "Fill Gas", icon: "american-football", iconColor: "#2c8ef4" },
    { text: "Fill Oil", icon: "analytics", iconColor: "#f42ced" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
  ];
const FILLGAS_INDEX = 0;
const FILLOIL_INDEX = 1;
const CANCEL_INDEX = 2;

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
class VehicleBasicReport extends Component {
    constructor(props) {
        super(props);

        this.handleAddDataClick = this.handleAddDataClick.bind(this)
    }
    handleAddDataClick(btnIndex) {
        if (btnIndex == FILLGAS_INDEX) {
            this.props.navigation.navigate("FillGas", 
                {vehicleId: this.props.vehicle.id})
        } else if (btnIndex == FILLOIL_INDEX) {
            this.props.navigation.navigate("FillOil", 
                {vehicleId: this.props.vehicle.id})
        }
    }
    render() {
        let newProps = {
            percent: 50
        }
        let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, lastDate, lastKm,
            arrMoneyPerWeek, arrKmPerWeek}
            = AppUtils.getStatForGasUsage(this.props.fillGasList, this.props.vehicle.id);
        let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
            = AppUtils.getInfoForOilUsage( this.props.fillOilList, this.props.vehicle.id, lastDate, lastKm, averageKmPerDay);
        console.log("Layout-------")
        console.log(Layout.window)
        return (
            <View style={styles.container}>
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

                    <View style={styles.viewBtnAddData}>
                        <Button
                            style={styles.btnAddData}
                            iconLeft transparent
                            // onPress={() => this.props.navigateToInputInfo(this.props.vehicle.id)}
                            onPress={() =>
                                ActionSheet.show(
                                {
                                    options: BUTTONS,
                                    cancelButtonIndex: CANCEL_INDEX,
                                    title: "Choose category"
                                },
                                buttonIndex => this.handleAddDataClick(buttonIndex)
                                )
                            }
                        >
                            <Icon type="AntDesign" name='pluscircle' style={{fontSize: 35}}/>
                        </Button>
                        <Text style={styles.textAddData}>Add Data</Text>
                    </View>
                </View>

                <View style={styles.statRow}>
                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H1>{averageKmPerLiter.toFixed(1)}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>
                            Km/Litre
                            </Text>
                        </Body>
                        </CardItem>
                    </Card>
  
                    {/* <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H1>{averageMoneyPerLiter}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>VND/Litre</Text>
                        </Body>
                        </CardItem>
                    </Card> */}

                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H1>{averageKmPerDay.toFixed(1)}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>Km/Day</Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H1>{averageMoneyPerDay.toFixed(0)}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>VND/Day</Text>
                        </Body>
                        </CardItem>
                    </Card>
                </View>
                
                <View style={styles.statRow}>
                <View style={styles.progressContainer}>
                <VictoryPie
                    colorScale={["tomato", "silver"]}
                    data={[
                        { x: "", y: passedKmFromPreviousOil },
                        { x: "", y: AppConstants.SETTING_KM_NEXT_OILFILL },
                    ]}
                    height={150}
                    innerRadius={60}
                    radius={70}
                    labels={() => null}
                    />
                <View style={styles.labelProgress}>
                    <Text style={styles.labelProgressText}>
                        {passedKmFromPreviousOil}/{AppConstants.SETTING_KM_NEXT_OILFILL}
                    </Text>
                    <Text>Km For Next Oil</Text>
                </View>
                <Text>Estimate Next:{nextEstimateDateForOil ? nextEstimateDateForOil.toLocaleDateString(): "NA"}</Text>
                </View>

                <View style={styles.progressContainer}>
                <VictoryPie
                    colorScale={["tomato", "silver"]}
                    data={[
                        { x: "", y: passedKmFromPreviousOil },
                        { x: "", y: AppConstants.SETTING_KM_NEXT_OILFILL },
                    ]}
                    height={150}
                    innerRadius={60}
                    radius={70}
                    labels={() => null}
                    />
                <View style={styles.labelProgress}>
                    <Text style={styles.labelProgressText}>
                        {passedKmFromPreviousOil}/{AppConstants.SETTING_KM_NEXT_OILFILL}
                    </Text>
                    <Text>Km For Next Oil</Text>
                </View>
                <Text>Estimate Next:{nextEstimateDateForOil ? nextEstimateDateForOil.toLocaleDateString(): "NA"}</Text>
                </View>
                
                </View>

                <View style={styles.gasUsageContainer}>
                    <VictoryStack colorScale={["orange", "gold"]}
                        style={{
                            data: { strokeWidth: 0, fillOpacity: 0.2},
                            labels: {
                                fontSize: 10, fill: "#c43a31", padding: 5
                            }
                            }}
                        labels={({ datum }) => datum.x.toLocaleDateString()}
                        width={450}
                        height={250}
                    >
                    <VictoryArea
                        data={arrKmPerWeek}
                        interpolation="linear"
                    />
                    </VictoryStack>
                </View>

                <View style={styles.gasUsageContainer}>
                    <VictoryStack colorScale={["tomato", "gold"]}
                        style={{
                            data: { strokeWidth: 0, fillOpacity: 0.2},
                            labels: {
                                fontSize: 10, fill: "#c43a31", padding: 5
                            }
                            }}
                        labels={({ datum }) => datum.x.toLocaleDateString()}
                        width={450}
                        height={250}
                    >
                    <VictoryArea
                        data={arrMoneyPerWeek}
                        interpolation="linear"
                    />
                    </VictoryStack>
                </View>



                <View style={styles.buttonRow}>
                    <Button
                        //onPress={() => this.props.navigateToInputInfo(this.props.vehicle.id)}
                    >
                        <Text>More > </Text>
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      marginTop: 20,
      flexDirection: "column",
      borderWidth: 0.5,
      borderColor: "grey",
      justifyContent: "space-between"
    },


    vehicleInfoRow: {
        height: 80,
        flexDirection: "row",
        justifyContent: "space-around"
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

    viewBtnAddData: {
        alignSelf: "flex-start",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
    },
    btnAddData: {
        alignSelf: "flex-start",
        width: 60,
        height: 50,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    textAddData: {
        color: "blue"
    },

    statRow: {
        flexDirection: "row",
        padding: 3,
        justifyContent: "center",
        flexWrap: "wrap",
        flexGrow: 100
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

    buttonRow: {
        alignSelf: "center",
        marginTop: 5,
        marginBottom: 5
    },

    progressContainer: {
        width: 180,
        height: 180,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "grey"
    },
    labelProgress: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    labelProgressText: {
        fontSize: 26
    },


    gasUsageContainer: {
        width: "90%",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
})
export default VehicleBasicReport;
