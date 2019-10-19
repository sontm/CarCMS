import React, { Component } from 'react'
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage } from 'react-native';
import {Content, Button, Text, Icon, Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

const BUTTONS = [
    { text: "Fill Gas", icon: "american-football", iconColor: "#2c8ef4" },
    { text: "Fill Oil", icon: "analytics", iconColor: "#f42ced" },
    { text: "Car Authorize", icon: "analytics", iconColor: "#f42ced" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
  ];
const FILLGAS_INDEX = 0;
const FILLOIL_INDEX = 1;
const CAR_AUTHORIZE_INDEX = 2;
const CANCEL_INDEX = 3;

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

        this.handleAddDataClick = this.handleAddDataClick.bind(this)
    }
    handleAddDataClick(btnIndex) {
        if (btnIndex == FILLGAS_INDEX) {
            this.props.navigation.navigate("FillGas", 
                {vehicleId: this.props.vehicle.id})
        } else if (btnIndex == FILLOIL_INDEX) {
            this.props.navigation.navigate("FillOil", 
                {vehicleId: this.props.vehicle.id})
        } else if (btnIndex == CAR_AUTHORIZE_INDEX) {
            this.props.navigation.navigate("CarAuthorize", 
                {vehicleId: this.props.vehicle.id})
        }
    }
    componentDidUpdate() {
        console.log("VehicleReport DIDUpdate")
    }
    render() {
        console.log("VehicleReport Render")
        let newProps = {
            percent: 50
        }
        let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, lastDate, lastKm,
            arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas}
            = AppUtils.getStatForGasUsage(this.props.fillGasList, this.props.vehicle.id);
        let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
            = AppUtils.getInfoForOilUsage( this.props.fillOilList, this.props.vehicle.id, lastDate, lastKm, averageKmPerDay);
        let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
            = AppUtils.getInfoCarAuthorizeDate(this.props.authorizeCarList, this.props.vehicle.id)

        return (
            <Content>
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

                <View style={styles.textRow}>
                    <Text><H2>
                        Reminder
                    </H2></Text>
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
                        <Text>Oil:</Text>
                        <Text style={styles.labelProgressText}>
                            {passedKmFromPreviousOil}/{AppConstants.SETTING_KM_NEXT_OILFILL}
                        </Text>
                        <Text>Km</Text>
                    </View>
                    <Text>Next:{nextEstimateDateForOil ? nextEstimateDateForOil.toLocaleDateString(): "NA"}</Text>
                    </View>

                    <View style={styles.progressContainer}>
                    <VictoryPie
                        colorScale={["tomato", "silver"]}
                        data={[
                            { x: "", y: diffDayFromLastAuthorize },
                            { x: "", y: AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR },
                        ]}
                        height={150}
                        innerRadius={60}
                        radius={70}
                        labels={() => null}
                        />
                    <View style={styles.labelProgress}>
                        <Text>Authorize:</Text>
                        <Text style={styles.labelProgressText}>
                            {diffDayFromLastAuthorize}/{AppConstants.SETTING_DAY_NEXT_AUTHORIZE_CAR}
                        </Text>
                        <Text>Days</Text>
                    </View>
                    <Text>Next:{nextAuthorizeDate ? nextAuthorizeDate.toLocaleDateString(): "NA"}</Text>
                    </View>
                    
                </View>


                <View style={styles.textRow}>
                    <Text><H2>
                        Total Average Usage
                    </H2></Text>
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
                            <Text><H1>{(averageKmPerDay*7).toFixed(0)}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>Km/Week</Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H1>{(averageMoneyPerDay*7).toFixed(0)}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>VND/Week</Text>
                        </Body>
                        </CardItem>
                    </Card>
                </View>
                
                

                {/* <View style={styles.gasUsageContainer}>
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
                </View> */}

                <View style={styles.textRow}>
                    <Text><H2>
                        Gas Usage
                    </H2></Text>
                </View>
                <View style={styles.gasUsageContainer}>
                <Tabs scrollWithoutAnimation={true} style={{backgroundColor: "grey"}}>
                    <Tab heading="Km Per Week" 
                            tabStyle={{backgroundColor: "white"}}
                            activeTabStyle={{backgroundColor: "white"}}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={300}
                            domainPadding={{y: [10, 25], x: [10, 10]}}
                            padding={{top:10,bottom:30,left:0,right:0}}
                        >
                        <VictoryLine colorScale={["tomato", "gold"]}
                            style={{
                                data: { stroke: "#c43a31" },
                                parent: { border: "1px solid #ccc"}
                            }}
                            labels={({ datum }) => (datum.y.toFixed(0)+"Km")}
                            data={arrKmPerWeek}
                            interpolation="natural"
                        />
                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatDateMonthDayVN(new Date(t))}`}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                            tickCount={arrKmPerWeek.length/2}
                        />
                        </VictoryChart>
                        
                    </Tab>

                    <Tab heading="Money Per Week"
                        tabStyle={{backgroundColor: "white"}}
                        activeTabStyle={{backgroundColor: "white"}}
                        >
                        <VictoryChart
                            width={Layout.window.width}
                            height={300}
                            domainPadding={{y: [20, 20]}}
                            padding={{top:10,bottom:30,left:50,right:0}}
                        >
                        <VictoryLine colorScale={["orange", "gold"]}
                            style={{
                                data: { stroke: "#c43a31" },
                                parent: { border: "1px solid #ccc"}
                            }}
                            // labels={({ datum }) => datum.x.toLocaleDateString()}
                            data={arrMoneyPerWeek}
                            interpolation="natural"

                        />
                        </VictoryChart>
                    </Tab>
                </Tabs>
                </View>

                <View style={styles.textRow}>
                    <Text><H2>
                        Money Usage (K VND)
                    </H2></Text>
                </View>
                <View style={styles.statRow}>
                    <View style={styles.moneyUsagePieContainer}>
                        <VictoryPie
                            colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
                            data={[
                                { x: "Gas", y: totalMoneyGas },
                                { x: "Oil", y: totalMoneyOil },
                                { x: "Authorize", y: totalMoneyAuthorize },
                            ]}
                            radius={100}
                            labels={({ datum }) => datum.y > 0 ? (datum.x + ": " + datum.y/1000 + "K") : ""}
                            labelRadius={({ innerRadius }) => innerRadius + 20 }
                            />
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <Button
                        //onPress={() => this.props.navigateToInputInfo(this.props.vehicle.id)}
                    >
                        <Text>More > </Text>
                    </Button>
                </View>
            </View>
            </Content>
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

    textRow: {
        flexDirection: "row",
        paddingTop: 10,
        paddingLeft: 5,
        justifyContent: "flex-start",
        flexWrap: "wrap",
        flexGrow: 100
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
        marginTop: 30,
        marginBottom: 5
    },

    progressContainer: {
        width: 180,
        height: 180,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
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
        width: "96%",
        height: 350,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "green"
    },

    moneyUsagePieContainer: {
        width: Layout.window.width,
        height: 250,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
})
export default VehicleBasicReport;
