import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';

class VehicleDetailReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        vehicle: {},
    };

  }
  componentWillMount() {
    // Set Current Vehicle ID if not Set
    if (!AppConstants.CURRENT_VEHICLE_ID) {
        AppConstants.CURRENT_VEHICLE_ID = this.props.userData.defaultVehicleId;
    }
  }
  componentDidMount() {
    //console.log("DetailReport DidMount:" + this.props.navigation.state.params.vehicleId)

    //AppConstants.CURRENT_VEHICLE_ID = this.props.navigation.state.params.vehicleId;
  }

  componentWillReceiveProps(nextProps) {
    console.log("DetailReport WillReceiveProps")
  }

  render() {
    console.log("DetailReport Render:" + AppConstants.CURRENT_VEHICLE_ID)
    if (this.props.navigation.state.params.vehicle) {
        var currentVehicle = this.props.navigation.state.params.vehicle;
    } else {
        var currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
    }
    
    if (currentVehicle) {
        let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, lastDate, lastKm,
            arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas}
            = AppUtils.getStatForGasUsage(currentVehicle.fillGasList);
        let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
            = AppUtils.getInfoForOilUsage(currentVehicle.fillOilList, 
                lastDate, lastKm, averageKmPerDay);
        let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
            = AppUtils.getInfoCarAuthorizeDate(currentVehicle.authorizeCarList)

        return (
            <Container>
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
                        {currentVehicle.brand + " " + currentVehicle.model}
                    </Text>
                    <Text style={styles.vehicleInfoTextPlate}>
                        {currentVehicle.licensePlate}
                    </Text>
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
                            <Text><H1>{averageKmPerLiter ? averageKmPerLiter.toFixed(1) : ""}</H1></Text>
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
                            <Text><H1>{averageKmPerDay ? (averageKmPerDay*7).toFixed(0): ""}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>Km/Week</Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H1>{averageMoneyPerDay ? (averageMoneyPerDay*7).toFixed(0) : ""}</H1></Text>
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
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
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

            </View>
            </Content>
            </Container>
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

VehicleDetailReport.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Vehicle Detail</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => navigation.navigate("VehicleHistory", {vehicle: navigation.state.params.vehicle})}>
                <View style={styles.rightHistoryView}>
                <Icon type="MaterialCommunityIcons" name="file-document-outline" style={styles.rightHistoryIcon}/>
                <Text style={styles.rightHistoryText}>History</Text>
                </View>
            </TouchableOpacity>
            
          </Right>
        </Header>
    )
});

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

    rightHistoryView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    rightHistoryIcon: {
        fontSize: 20,
        color: "rgb(50,50,50)"
    },
    rightHistoryText: {
        textAlign: "center",
        fontSize: 12,
        color: "rgb(50,50,50)"
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

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleDetailReport);
