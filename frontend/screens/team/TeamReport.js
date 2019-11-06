import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import Layout from '../../constants/Layout'
import AppUtils from '../../constants/AppUtils'
import AppConstants from '../../constants/AppConstants';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, H2, H3, H1 } from 'native-base';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import VehicleBasicReport from '../../components/VehicleBasicReport'
import AppLocales from '../../constants/i18n'

class TeamReport extends React.Component {
  constructor(props) {
    super(props)

  }

  calculateAllVehicleTotalMoney(numberOfMonth) {
    let arrTotalAllCars = [];
    this.props.tempData.teamCarList.forEach(element => {
      if (this.props.tempData.teamCarReports && this.props.tempData.teamCarReports[element.id]) {
        let {arrTotalMoneySpend} = this.props.tempData.teamCarReports[element.id].moneyReport;
        //console.log(arrTotalMoneySpend)
        // Only Keep numberOfMonth element at the end
        if (arrTotalMoneySpend.length > numberOfMonth) {
          arrTotalMoneySpend.splice(0, arrTotalMoneySpend.length - numberOfMonth);
        }
        if (arrTotalMoneySpend && arrTotalMoneySpend.length > 0)
        arrTotalAllCars.push(arrTotalMoneySpend)
      }
    });
    return arrTotalAllCars;
  }
  calculateAllVehicleGasUsage(numberOfMonth) {
    let arrGasAllCars = [];
    this.props.tempData.teamCarList.forEach(element => {
      if (this.props.tempData.teamCarReports && this.props.tempData.teamCarReports[element.id]) {
        var {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
          arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
          avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
          = this.props.tempData.teamCarReports[element.id].gasReport;

        // let dataChartKitLine = AppUtils.convertVictoryDataToChartkitData(arrTotalKmMonthly,
        //   (t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`)
        
        // arrGasAllCars.push(dataChartKitLine)
        if (arrTotalKmMonthly && arrTotalKmMonthly.length > 0)
        arrGasAllCars.push(arrTotalKmMonthly)
      }
    })
    return arrGasAllCars;
  }

  render() {
    console.log("TeamReport Render")
    let arrTotalAllCars = this.calculateAllVehicleTotalMoney(6);
    let arrGasAllCars = this.calculateAllVehicleGasUsage(12);

    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              
              <View style={styles.moneySpendContainer}>
                <View style={styles.textRow}>
                    <Text><H2>
                    {AppLocales.t("HOME_MONEY_SPEND")}
                    </H2></Text>
                </View>

                <View style={styles.barChartStackContainer}>
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
                  {arrTotalAllCars.map((item, idx) => (
                    <VictoryBar
                      key={idx}
                      data={item}
                    />
                  ))}
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
                          tickLabels: {fontSize: 12, padding: 0}
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
              </View>

              <View style={styles.moneySpendContainer}>
                <View style={styles.textRow}>
                    <Text><H2>
                    {AppLocales.t("HOME_GAS_USAGE")}
                    </H2></Text>
                </View>

                <View style={styles.gasUsageContainer}>
                  <VictoryChart
                      width={Layout.window.width}
                      height={350}
                      padding={{top:10,bottom:30,left:50,right:20}}
                  >
                  <VictoryStack
                      width={Layout.window.width}
                      domainPadding={{y: [0, 10], x: [10, 0]}}
                      colorScale={AppConstants.COLOR_SCALE_10}
                  >
                  {arrGasAllCars && arrGasAllCars.map((item, idx) => (
                    <VictoryBar
                      key={idx}
                      data={item}
                    />
                  ))}
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
                          tickLabels: {fontSize: 12, padding: 0}
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
              </View>

            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_BG
  },
  contentContainer: {

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
  moneySpendContainer: {
    backgroundColor: "white",
    flexDirection: "column",
    borderWidth: 0.5,
    borderColor: "grey",
    justifyContent: "space-between",
    marginBottom: 20,
    borderRadius: 7,
  },
  barChartStackContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  gasUsageContainer: {
    width: "96%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

const mapStateToProps = (state) => ({
  tempData: state.tempData
});
const mapActionsToProps = {
};

export default connect(
  mapStateToProps,mapActionsToProps
)(TeamReport);

