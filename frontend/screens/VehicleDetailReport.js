import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';
import {actVehicleOpenDetailVehicle} from '../redux/VehicleReducer'
// vehicleList: {brand: "Kia", model: "Cerato", licensePlate: "18M1-78903", checkedDate: "01/14/2019", id: 3}
// fillGasList: {vehicleId: 2, fillDate: "10/14/2019, 11:30:14 PM", amount: 2, price: 100000, currentKm: 123344, id: 1}
// fillOilList: {vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1}
class VehicleDetailReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        vehicle: {},
    };

  }
  componentDidMount() {
    //console.log("DetailReport DidMount:" + this.props.navigation.state.params.vehicleId)

    //this.props.actVehicleOpenDetailVehicle(this.props.navigation.state.params.vehicleId)
    //AppConstants.CURRENT_VEHICLE_ID = this.props.navigation.state.params.vehicleId;
  }

  componentWillReceiveProps(nextProps) {
    console.log("DetailReport WillReceiveProps")
  }
//   componentDidUpdate() {
//     console.log("DetailReport DIDUpdate")
//     if (this.props.navigation.state && this.props.navigation.state.params && 
//             this.props.navigation.state.params.vehicleId && 
//             AppConstants.CURRENT_VEHICLE_ID != this.props.navigation.state.params.vehicleId) {
//         let vehicle;
//         for(let i = 0; i < this.state.vehicleList.length; i++) {
//             if (this.state.vehicleList[i].id == this.props.navigation.state.params.vehicleId) {
//                 vehicle = this.state.vehicleList[i];
//                 break;
//             }
//         }
//         this.setState({
//             currentVehicleId: this.props.navigation.state.params.vehicleId,
//             vehicle: vehicle,
//         })
//     }

  render() {
    console.log("DetailReport Render:" + AppConstants.CURRENT_VEHICLE_ID)
    let currentVehicle = {};
    const arrVehicles = this.props.vehicleData.vehicleList.filter(
        item => item.id == AppConstants.CURRENT_VEHICLE_ID);
    if (arrVehicles && arrVehicles.length > 0) {
        currentVehicle = arrVehicles[0];
    }
    let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, lastDate, lastKm,
        arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas}
        = AppUtils.getStatForGasUsage(this.props.vehicleData.fillGasList, AppConstants.CURRENT_VEHICLE_ID);
    let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
        = AppUtils.getInfoForOilUsage( this.props.vehicleData.fillOilList, AppConstants.CURRENT_VEHICLE_ID, 
            lastDate, lastKm, averageKmPerDay);
    let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
        = AppUtils.getInfoCarAuthorizeDate(this.props.vehicleData.authorizeCarList, 
            AppConstants.CURRENT_VEHICLE_ID)

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

                <View style={styles.viewBtnAddData}>
                    <Button
                        style={styles.btnAddData}
                        iconLeft transparent
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
    }
}

VehicleDetailReport.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Vehicle Detail</Title>
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

const mapStateToProps = (state) => ({
    vehicleData: state.vehicleData
});
const mapActionsToProps = {
    actVehicleOpenDetailVehicle
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleDetailReport);
