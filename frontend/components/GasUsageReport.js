import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, Picker, Form, DatePicker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';


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
        tillDate: new Date()
    };

  }

  onValueChangeDuration(value) {
    this.setState({
        duration: value
    });
  }

  onValueChangeDurationType(value) {
    this.setState({
        durationType: value
    });
  }
  // TODO for change Date
  onSetDateOption(newDate) {
    console.log(newDate)
    this.setState({
        tillDate: newDate
    });
  }

  render() {
    console.log("DetailReport Render:" + AppConstants.CURRENT_VEHICLE_ID)
    if (this.props.currentVehicle) { //props
        let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
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
        
        if (avgMoneyPerKmMonthly > averageMoneyPerKmPerDay) {
            // This time Use so Much, 
            var iconInfoUsage= (
                <Icon type="Entypo" name="arrow-long-up" 
                    style={{color: "#d62728", marginLeft: 5}} />
            )
        } else if (avgMoneyPerKmMonthly > averageMoneyPerKmPerDay) {
            // This time Use so Much, 
            var iconInfoUsage= (
                <Icon type="Entypo" name="arrow-long-down" 
                    style={{color: "#2ca02c", marginLeft: 5}} />
            )
        }
        

        return (
            <View style={styles.container}>
                <View style={styles.textRow}>
                    <Text><H2>
                        Monthly Gas Usage
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
                        textStyle={{ color: "#1f77b4" }}
                        style={{width: 70}}
                        >
                        <Picker.Item label="6" value={6} />
                        <Picker.Item label="9" value={9} />
                        <Picker.Item label="12" value={12} />
                    </Picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.durationType}
                        onValueChange={this.onValueChangeDurationType.bind(this)}
                        textStyle={{ color: "#1f77b4"}}
                        style={{width: 90}}
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
                        textStyle={{ color: "#1f77b4" }}
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
                        domainPadding={{y: [50, 25], x: [10, 10]}}
                        padding={{top:10,bottom:30,left:10,right:10}}
                    >
                    <VictoryLine colorScale={AppConstants.COLOR_SCALE_10}
                        style={{
                            data: { stroke: "#c43a31" },
                            parent: { border: "1px solid #ccc"}
                        }}
                        labels={({ datum }) => (datum.y.toFixed(0))}
                        data={dataToDisplay}
                        interpolation="linear"
                    />
                    <VictoryAxis
                        crossAxis
                        standalone={false}
                        tickFormat={(t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`}
                        //tickCount={dataToDisplay ? dataToDisplay.length-1 : 3}
                        style={{
                            grid: {stroke: "rgb(240,240,240)"},
                            ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 12, padding: 0}
                        }}
                    />
                    </VictoryChart>
                </View>

                <View style={styles.textRow}>
                    <Text><H2>
                        Average in {this.state.duration + " " + durationTypeToVietnamese(this.state.durationType)}
                    </H2></Text>
                </View>
                <View style={styles.statRow}>
                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H1>{avgKmMonthly ? avgKmMonthly.toFixed(1) : ""}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>
                            Km/Month
                            </Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H1>{avgMoneyMonthly ? (avgMoneyMonthly).toFixed(0): ""}</H1></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>VND/Month</Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header  style={{flexDirection: "row", alignItems: "center"}}>
                            <Text><H1>{avgMoneyPerKmMonthly ? (avgMoneyPerKmMonthly).toFixed(0) : ""}</H1></Text>
                            {iconInfoUsage}
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text>VND/Km</Text>
                        </Body>
                        </CardItem>
                    </Card>
                </View>


                <View style={styles.textRow}>
                    <Text><H3>
                        Average All Time
                    </H3></Text>
                </View>
                <View style={styles.statRow}>
                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H3>{averageKmPerDay ? (averageKmPerDay*30).toFixed(0): ""}</H3></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text style={{fontSize: 13}}>Km/Month</Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H3>{averageMoneyPerDay ? (averageMoneyPerDay*30).toFixed(0) : ""}</H3></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text style={{fontSize: 13}}>VND/Month</Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem header>
                            <Text><H3>{averageMoneyPerKmPerDay ? averageMoneyPerKmPerDay.toFixed(0) : ""}</H3></Text>
                        </CardItem>
                        <CardItem>
                        <Body>
                            <Text style={{fontSize: 13}}>VND/Km</Text>
                        </Body>
                        </CardItem>
                    </Card>
                </View>
                
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
      marginTop: 20,
      flexDirection: "column",
      borderWidth: 0.5,
      borderColor: "grey",
      justifyContent: "space-between"
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


export default GasUsageReport;