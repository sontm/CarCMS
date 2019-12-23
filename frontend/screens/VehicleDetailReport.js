import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, TabHeading, ScrollableTab } from 'native-base';
import Layout from '../constants/Layout'
import {HeaderText, NoDataText} from '../components/StyledText'
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

  componentDidMount() {
    console.log("~~~~~~~~~~~~DetailReport DidMount:" + AppConstants.CURRENT_VEHICLE_ID)
  }
  componentDidUpdate() {
    console.log("~~~~~~~~~~~~DetailReport DidUpdate:" + AppConstants.CURRENT_VEHICLE_ID)
  }
  render() {
    console.log("~~~~~~~~~~~~DetailReport Render:" + AppConstants.CURRENT_VEHICLE_ID)
    
    if (this.props.navigation && this.props.navigation.state.params && this.props.navigation.state.params.vehicle) {
        var currentVehicle = this.props.navigation.state.params.vehicle;
    } else {
        var currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
    }

    if (currentVehicle) {
        AppConstants.CURRENT_VEHICLE_ID = currentVehicle.id;
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
        // calcualte Service maintain date or KM
        //totalNextDay
        let passedDay =  AppUtils.calculateDiffDayOf2Date(this.props.userData.carReports[currentVehicle.id].maintainRemind.lastDateMaintain,
            new Date());
        let totalDayForMaintain = this.props.userData.carReports[currentVehicle.id].maintainRemind.totalNextDay;
        if (!totalDayForMaintain) {
            totalDayForMaintain = AppUtils.calculateDiffDayOf2Date(this.props.userData.carReports[currentVehicle.id].maintainRemind.lastDateMaintain,
                this.props.userData.carReports[currentVehicle.id].maintainRemind.nextEstimatedDateForMaintain);
        }
        let percentByDate = 1.0 * passedDay/totalDayForMaintain;
        let percentByKm = 1.0 * this.props.userData.carReports[currentVehicle.id].maintainRemind.passedKmFromPreviousMaintain/
            this.props.userData.carReports[currentVehicle.id].maintainRemind.lastMaintainKmValidFor;
        if (percentByDate > percentByKm) {
            // Will Show by Date
            var passService = passedDay;
            var totalNeedService = totalDayForMaintain;
            var unitService = AppLocales.t("GENERAL_DAY");
            var nextDateService = this.props.userData.carReports[currentVehicle.id].maintainRemind.nextEstimatedDateForMaintain;

            var passServiceSub = this.props.userData.carReports[currentVehicle.id].maintainRemind.passedKmFromPreviousMaintain;
            var totalNeedServiceSub = this.props.userData.carReports[currentVehicle.id].maintainRemind.lastMaintainKmValidFor;
            var unitServiceSub = "Km";
        } else {
            var passServiceSub = passedDay;
            var totalNeedServiceSub = totalDayForMaintain;
            var unitServiceSub = AppLocales.t("GENERAL_DAY");
            var nextDateServiceSub = this.props.userData.carReports[currentVehicle.id].maintainRemind.nextEstimatedDateForMaintain;

            var passService = this.props.userData.carReports[currentVehicle.id].maintainRemind.passedKmFromPreviousMaintain;
            var totalNeedService = this.props.userData.carReports[currentVehicle.id].maintainRemind.lastMaintainKmValidFor;
            var unitService = "Km";
        }
        let isHaveRemindData = false;
        if ((this.props.userData.carReports[currentVehicle.id].maintainRemind && totalNeedService) ||
                (this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidFor) ||
                (this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForInsurance) ||
                (this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForRoadFee)) {
            isHaveRemindData = true;
        }
        return (
            <Container>
            <Header hasTabs style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
            <Left style={{flex:1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
                </Button>
            </Left>
            <Body  style={{flex:5}}>
                <Title><HeaderText>{currentVehicle.brand + " " +
                     currentVehicle.model + " " + currentVehicle.licensePlate}</HeaderText></Title>
            </Body>
            <Right style={{flex:1}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("VehicleHistory", 
                    {vehicle: currentVehicle, isMyVehicle:this.props.navigation.state.params.isMyVehicle})}>
                    <View style={styles.rightHistoryView}>
                    <Icon type="MaterialCommunityIcons" name="file-document-outline" style={styles.rightHistoryIcon}/>
                    <Text style={styles.rightHistoryText}>{AppLocales.t("GENERAL_HISTORY")}</Text>
                    </View>
                </TouchableOpacity>
                
            </Right>
            </Header>

            {this.props.userData.carReports[currentVehicle.id] ? (
            // <Tabs locked={true} renderTabBar={()=> <ScrollableTab tabsContainerStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}/>}>
            <Tabs locked={true}>
                <Tab heading={AppLocales.t("GENERAL_MONEYUSAGE")} tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        textStyle={{fontSize: 14, color: AppConstants.COLOR_TEXT_INACTIVE_TAB}} 
                        activeTextStyle={{fontSize: 14,color: "white"}}>
                    <Content>
                    <ScrollView>
                    <MoneyUsageByTimeReport currentVehicle={currentVehicle}/>
                    <MoneyUsageReport currentVehicle={currentVehicle}/>
                    <MoneyUsageReportServiceMaintain currentVehicle={currentVehicle}/>
                    </ScrollView>
                    </Content>
                </Tab>
                <Tab heading={AppLocales.t("GENERAL_GAS")} tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        textStyle={{fontSize: 14, color: AppConstants.COLOR_TEXT_INACTIVE_TAB}} 
                        activeTextStyle={{fontSize: 14,color: "white"}}>
                    <Content>
                    <GasUsageReport currentVehicle={currentVehicle}/>
                    </Content>
                </Tab>
                <Tab heading={AppLocales.t("CARDETAIL_REMINDER")}
                        tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        textStyle={{fontSize: 14, color: AppConstants.COLOR_TEXT_INACTIVE_TAB}} 
                        activeTextStyle={{fontSize: 14,color: "white"}}>
                    <Content>
                    <View style={styles.container}>
                        <View style={styles.reminderContainer}>
                        <View style={styles.textRow}>
                            <Text><H3>
                                {AppLocales.t("CARDETAIL_REMINDER")}
                            </H3></Text>
                        </View>
                        
                        <View style={styles.statRow}>
                            {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidFor ? 
                            <View style={styles.remindItemContainer}>
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
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_AUTH")}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorize}/
                                        {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidFor}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_NEXT") + ": "}{this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDate ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDate): "NA"}</Text>
                            </View>
                            </View> : null}

                            {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForInsurance ?  (
                            <View style={styles.remindItemContainer}>
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
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_INSURANCE")}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorizeInsurance}/
                                        {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForInsurance}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_NEXT") + ": "}{this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDateInsurance ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDateInsurance): "NA"}</Text>
                            </View></View>) : null}

                            {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForRoadFee ? (
                            <View style={styles.remindItemContainer}>
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
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_ROADFEE")}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {this.props.userData.carReports[currentVehicle.id].authReport.diffDayFromLastAuthorizeRoadFee}/
                                        {this.props.userData.carReports[currentVehicle.id].authReport.lastAuthDaysValidForRoadFee}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_NEXT") + ": "}{this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDateRoadFee ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        this.props.userData.carReports[currentVehicle.id].authReport.nextAuthorizeDateRoadFee): "NA"}
                                </Text>
                            </View></View>
                            ) : null}

{(this.props.userData.carReports[currentVehicle.id].maintainRemind && totalNeedService )? (
                            <View style={styles.remindItemContainer}>
                            <View style={styles.progressContainer}>
                            <VictoryPie
                                colorScale={["tomato", "silver"]}
                                data={[
                                    { x: "", y: passService },
                                    { x: "", y: (totalNeedService - passService) },
                                ]}
                                height={140}
                                innerRadius={58}
                                radius={65}
                                labels={() => null}
                                labelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                                />
                            <View style={styles.labelProgress}>
                                <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_SERVICE")}</Text>
                                <Text style={{fontSize: 20}}>
                                    {passService}/
                                    {totalNeedService}
                                </Text>
                                <Text>{unitService}</Text>
                            </View>
                            {nextDateService ? 
                            <Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_NEXT") + ": "}
                                {AppUtils.formatDateMonthDayYearVNShort(nextDateService)}
                            </Text> : null}
                            </View>
                            <Text style={{fontSize: 12, textAlign:"center", alignSelf:"center"}}>{"(Nếu Theo "+ unitServiceSub + ": "}
                                {passServiceSub+"/"+ totalNeedServiceSub+ unitServiceSub+")"}
                                {/* {!nextDateServiceSub ? ")" : ""} */}
                            </Text>
                            {/* {nextDateServiceSub ? 
                            <Text style={{fontSize: 13}}>{AppLocales.t("GENERAL_NEXT") + ": "}
                                {AppUtils.formatDateMonthDayYearVNShort(nextDateServiceSub)+")"}
                            </Text> : null} */}
                            </View>
                            ) : null }

                        </View>
                        {!isHaveRemindData ? 
                        (<NoDataText />) : null}
                    </View>
                    </View>
                    </Content>
                </Tab>
                
                <Tab heading={AppLocales.t("CARDETAIL_SERVICE_TABLE_SHORT")} tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        textStyle={{fontSize: 14, color: AppConstants.COLOR_TEXT_INACTIVE_TAB}} 
                        activeTextStyle={{fontSize: 14,color: "white"}}>
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
    header: null
});

const styles = StyleSheet.create({
    container: {
      //backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
      flexDirection: "column",
    //   borderWidth: 0.5,
    //   borderColor: "grey",
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

    remindItemContainer: {
        width: 150,
        height: 180,
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "center",
        paddingTop: 5,
        marginBottom: 10,
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
