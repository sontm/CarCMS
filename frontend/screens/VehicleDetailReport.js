import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, TabHeading } from 'native-base';
import Layout from '../constants/Layout'
import {HeaderText} from '../components/StyledText'
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import GasUsageReport from '../components/GasUsageReport'
import MoneyUsageReport from '../components/MoneyUsageReport'
import MoneyUsageByTimeReport from '../components/MoneyUsageByTimeReport'
import ServiceMaintainTable from '../components/ServiceMaintainTable';
import MoneyUsageReportServiceMaintain from '../components/MoneyUsageReportServiceMaintain';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import {actTempCalculateCarReport} from '../redux/UserReducer'

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
    
    if (this.props.navigation && this.props.navigation.state.params && this.props.navigation.state.params.vehicle) {
        var currentVehicle = this.props.navigation.state.params.vehicle;
    } else {
        var currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
    }

    if (currentVehicle) {
        //console.log("CALL actTempCalculateCarReport from Detail Report:")
        //this.props.actTempCalculateCarReport(currentVehicle, null, this.props.userData)
        //console.log("END actTempCalculateCarReport:")
        // let {lastDate, lastKm, averageKmPerDay} = AppUtils.getLastDateAndKmFromGas(currentVehicle.fillGasList);
        // let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
        //     = AppUtils.getInfoForOilUsage(currentVehicle.fillOilList, 
        //         lastDate, lastKm, averageKmPerDay);
        // let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
        //     = AppUtils.getInfoCarAuthorizeDate(currentVehicle.authorizeCarList)
        // let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend,
        //     totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend}
        //     = AppUtils.getInfoMoneySpend(currentVehicle.fillGasList, currentVehicle.fillOilList, 
        //         currentVehicle.authorizeCarList, currentVehicle.expenseList, currentVehicle.serviceList);
        // let {arrExpenseTypeSpend} = AppUtils.getInfoMoneySpendInExpense(currentVehicle.expenseList);
        
        let imgSource = AppUtils.loadImageSourceOfBrand(currentVehicle.brand.toLowerCase(), currentVehicle.type!="car")

        return (
            <Container>
            {this.props.userData.carReports[currentVehicle.id] ? (
            <Tabs style={{flex: 1}} locked={true}>
                <Tab heading={ <TabHeading><Text style={{fontSize: 14}}>{AppLocales.t("CARDETAIL_REMINDER")}</Text></TabHeading>}>
                    <Content>
                    <View style={styles.container}>
                        <View style={styles.reminderContainer}>
                        <View style={styles.textRow}>
                            <Text><H2>
                                {AppLocales.t("CARDETAIL_REMINDER")}
                            </H2></Text>
                        </View>
                        
                        <View style={styles.statRow}>
                            {this.props.userData.carReports[currentVehicle.id].maintainRemind ? (
                            <View style={styles.progressContainer}>
                            <VictoryPie
                                colorScale={["tomato", "silver"]}
                                data={[
                                    { x: "", y: this.props.userData.carReports[currentVehicle.id].maintainRemind.passedKmFromPreviousMaintain },
                                    { x: "", y: (this.props.userData.carReports[currentVehicle.id].maintainRemind.lastMaintainKmValidFor - 
                                        this.props.userData.carReports[currentVehicle.id].maintainRemind.passedKmFromPreviousMaintain) },
                                ]}
                                height={140}
                                innerRadius={58}
                                radius={65}
                                labels={() => null}
                                />
                            <View style={styles.labelProgress}>
                                <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_SERVICE") + ": "}</Text>
                                <Text style={styles.labelProgressText}>
                                    {this.props.userData.carReports[currentVehicle.id].maintainRemind.passedKmFromPreviousMaintain}/
                                    {this.props.userData.carReports[currentVehicle.id].maintainRemind.lastMaintainKmValidFor}
                                </Text>
                                <Text>Km</Text>
                            </View>
                            </View>
                            ) : null }

                            <View style={styles.progressContainer}>
                                <VictoryPie
                                    colorScale={["tomato", "silver"]}
                                    data={[
                                        { x: "", y: this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize },
                                        { x: "", y: (this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidFor -
                                            this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize) },
                                    ]}
                                    height={140}
                                    innerRadius={58}
                                    radius={65}
                                    labels={() => null}
                                    />
                                <View style={styles.labelProgress}>
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_AUTH") + ": "}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize}/
                                        {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidFor}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text>{AppLocales.t("GENERAL_NEXT") + ": "}{this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDate ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDate): "NA"}</Text>
                            </View>

                            <View style={styles.progressContainer}>
                                <VictoryPie
                                    colorScale={["tomato", "silver"]}
                                    data={[
                                        { x: "", y: this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorizeInsurance },
                                        { x: "", y: (this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForInsurance -
                                            this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorizeInsurance) },
                                    ]}
                                    height={140}
                                    innerRadius={58}
                                    radius={65}
                                    labels={() => null}
                                    />
                                <View style={styles.labelProgress}>
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_INSURANCE") + ": "}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorizeInsurance}/
                                        {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForInsurance}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text>{AppLocales.t("GENERAL_NEXT") + ": "}{this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDateInsurance ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDateInsurance): "NA"}</Text>
                            </View>

                            <View style={styles.progressContainer}>
                                <VictoryPie
                                    colorScale={["tomato", "silver"]}
                                    data={[
                                        { x: "", y: this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorizeRoadFee },
                                        { x: "", y: (this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForRoadFee -
                                            this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorizeRoadFee) },
                                    ]}
                                    height={140}
                                    innerRadius={58}
                                    radius={65}
                                    labels={() => null}
                                    />
                                <View style={styles.labelProgress}>
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_ROADFEE") + ": "}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorizeRoadFee}/
                                        {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForRoadFee}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text>{AppLocales.t("GENERAL_NEXT") + ": "}{this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDateRoadFee ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDateRoadFee): "NA"}</Text>
                            </View>

                        </View>
                    </View>
                    </View>
                    </Content>
                </Tab>
                <Tab heading={ <TabHeading><Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_GAS")}</Text></TabHeading>}>
                    <Content>
                    <GasUsageReport currentVehicle={currentVehicle}/>
                    </Content>
                </Tab>
                <Tab heading={ <TabHeading><Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_MONEYUSAGE")}</Text></TabHeading>}>
                    <Content>
                    <MoneyUsageByTimeReport currentVehicle={currentVehicle}/>
                    <MoneyUsageReport currentVehicle={currentVehicle}/>
                    <MoneyUsageReportServiceMaintain currentVehicle={currentVehicle}/>
                    </Content>
                </Tab>
                <Tab heading={ <TabHeading><Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_SERVICE")}</Text></TabHeading>}>
                    <Content>
                    <ServiceMaintainTable  currentVehicle={currentVehicle}/>
                    </Content>
                </Tab>
            </Tabs>
            ) : null}
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
        <Header hasTabs style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("CARDETAIL_HEADER")}</HeaderText></Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => navigation.navigate("VehicleHistory", 
                {vehicle: navigation.state.params.vehicle, isMyVehicle:navigation.state.params.isMyVehicle})}>
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
      //backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
      flexDirection: "column",
      borderWidth: 0.5,
      borderColor: "grey",
      justifyContent: "space-between",
    },


    vehicleInfoRow: {
        backgroundColor: "white",
        height: 80,
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
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
        color: AppConstants.COLOR_HEADER_BUTTON
    },
    rightHistoryText: {
        textAlign: "center",
        fontSize: 12,
        color: AppConstants.COLOR_HEADER_BUTTON
    },

    reminderContainer: {
        backgroundColor: "white",
        //borderWidth: 0.5,
        //borderColor: "grey",
        marginBottom: 20,
        //borderRadius: 7,
       
    },

    textRow: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingTop: 10,
        paddingLeft: 5,
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        flexGrow: 100,
        borderRadius: 7,
    },
    statRow: {
        backgroundColor: "white",
        flexDirection: "row",
        padding: 3,
        justifyContent: "center",
        flexWrap: "wrap",
        flexGrow: 100,
        borderRadius: 7,
        backgroundColor: "white"
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
        width: 150,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 5,
    },
    labelProgress: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    labelProgressText: {
        fontSize: 22
    },
    progressTitle: {
        fontSize: 13
    },


    gasUsageContainer: {
        width: "96%",
        height: 350,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
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
    userData: state.userData
});
const mapActionsToProps = {
    actTempCalculateCarReport
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleDetailReport);
