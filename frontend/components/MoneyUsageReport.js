import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'

class MoneyUsageReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        duration: 12,
        tillDate: new Date(),
    };
  }
  onValueChangeDuration(value) {
    this.setState({
        duration: value
    });
    this.displayByFilter = true;
  }

  // TODO for change Date
  onSetDateOption(newDate) {
    this.setState({
        tillDate: newDate
    });
    this.displayByFilter = true;
  }
  
  render() {
    if (this.props.currentVehicle) {
        if (this.displayByFilter) {
            var {totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend}
                = AppUtils.getInfoMoneySpend(this.props.currentVehicle,
                    this.state.duration, this.state.tillDate);
            var {arrExpenseTypeSpend} = AppUtils.getInfoMoneySpendInExpense(this.props.currentVehicle.expenseList);
        } else {
            var {totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend}
                = this.props.tempData.carReports[this.props.currentVehicle.id].moneyReport;

            var {arrExpenseTypeSpend} = this.props.tempData.carReports[this.props.currentVehicle.id].expenseReport;
        }

        return (
            <View style={styles.container}>
                
                <View style={styles.textRow}>
                    <Text><H2>
                    {AppLocales.t("CARDETAIL_H1_MONEY_USAGE")}
                    </H2></Text>
                </View>
                <View style={styles.textRowOption}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.duration}
                        onValueChange={this.onValueChangeDuration.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 16 }}
                        style={{width: 80}}
                        >
                        <Picker.Item label="3" value={3} />
                        <Picker.Item label="6" value={6} />
                        <Picker.Item label="9" value={9} />
                        <Picker.Item label="12" value={12} />
                        <Picker.Item label="18" value={18} />
                        <Picker.Item label="24" value={24} />
                        <Picker.Item label={AppLocales.t("GENERAL_ALL")} value={AppLocales.t("GENERAL_ALL")} />
                    </Picker>

                    <Text style={{fontSize: 15, marginLeft: 10}}>Tháng Gần Nhất Đến</Text>
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

                <View style={styles.statRow}>
                    <View style={styles.moneyUsagePieContainer}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={[
                                { x: AppLocales.t("GENERAL_GAS"), y: totalGasSpend },
                                { x: AppLocales.t("GENERAL_OIL"), y: totalOilSpend },
                                { x: AppLocales.t("GENERAL_AUTHROIZE"), y: totalAuthSpend },
                                { x: AppLocales.t("GENERAL_EXPENSE"), y: totalExpenseSpend },
                                { x: AppLocales.t("GENERAL_SERVICE"), y: totalServiceSpend },
                            ]}
                            radius={100}
                            labels={({ datum }) => datum.y > 0 ? (datum.x + ": " + datum.y/1000 + "K") : ""}
                            // labelRadius={({ innerRadius }) => innerRadius + 20 }
                            />
                    </View>
                </View>

                <View style={{...styles.textRow, marginTop: 15}}>
                    <Text><H3>
                    {AppLocales.t("CARDETAIL_H1_EXPENSE_USAGE")}
                    </H3></Text>
                </View>
                <View style={styles.statRow}>
                    <View style={styles.moneyUsagePieContainer}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={arrExpenseTypeSpend}
                            radius={100}
                            labels={({ datum }) => datum.y > 0 ? (datum.x + ": " + datum.y/1000 + "K") : ""}
                            // labelRadius={({ innerRadius }) => innerRadius + 20 }
                            />
                    </View>
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
      flexDirection: "column",
      borderRadius: 7,
      justifyContent: "space-between",
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
        marginTop: 15,
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

    buttonRow: {
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 5
    },

    moneyUsageStackContainer: {
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
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
    tempData: state.tempData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(MoneyUsageReport);
