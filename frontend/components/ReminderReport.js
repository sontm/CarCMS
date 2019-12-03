import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker, Badge, TabHeading } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import {NoDataText} from '../components/StyledText';

function renderRemindItem(isTeam, text, passed, target, nextDate, unit, car, licensePlate, owner) {
    if (target > 0 && passed> 0) {
    return (
        <View style={styles.reminderItemContainer} key={text+""+passed+"/"+target+licensePlate+isTeam}>
            <View style={styles.reminderProgress}>
                <VictoryPie
                    colorScale={["tomato", "silver"]}
                    data={[
                        { x: "", y: passed },
                        { x: "", y: (target - passed) },
                    ]}
                    height={50}
                    innerRadius={21}
                    radius={25}
                    labels={() => null}
                    />
                <View style={styles.labelProgress}>
                    <Text style={styles.labelProgressText}>
                        {(passed*100/target).toFixed(0)}%
                    </Text>
                </View>
            </View>
            <View style={styles.reminderInfo}>
                <Text style={{color: "tomato"}}>{text}{" "}{passed}/{target} ({unit})</Text>
                <Text style={{fontSize: 13}}>{car}{" "}{licensePlate}{" "}{owner}</Text>
                {nextDate ?
                <Text style={{fontSize: 13}}>
                    {AppLocales.t("GENERAL_NEXT") + ": "}
                    {AppUtils.formatDateMonthDayYearVNShort(nextDate)}</Text>
                    : null}
            </View>
        </View>
    )
    } else {
        return null;
    }
}
class ReminderReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        activeDisplay: 0
    }

    this.numRemindPrivate = 0;
    this.numRemindTeam = 0;
  }
  renderTabPrivate() {
    let resultView = [];
    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {
        if (this.props.userData.carReports[element.id].maintainRemind) {
            var {lastKmMaintain, lastDateMaintain, lastMaintainKmValidFor, nextEstimatedKmForMaintain,
                nextEstimatedDateForMaintain, passedKmFromPreviousMaintain}
                = this.props.userData.carReports[element.id].maintainRemind;
            resultView.push(
                renderRemindItem(false, AppLocales.t("GENERAL_SERVICE"), passedKmFromPreviousMaintain, lastMaintainKmValidFor, 
                    null, "Km", element.brand+" " +element.model, element.licensePlate)
            )
        }
        var {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize, lastAuthDaysValidFor,
                diffDayFromLastAuthorizeInsurance, nextAuthorizeDateInsurance, lastAuthDaysValidForInsurance,
                diffDayFromLastAuthorizeRoadFee, nextAuthorizeDateRoadFee, lastAuthDaysValidForRoadFee}
            = this.props.userData.carReports[element.id].authReport;
        

        resultView.push(
            renderRemindItem(false, AppLocales.t("GENERAL_AUTHROIZE_AUTH"), diffDayFromLastAuthorize, lastAuthDaysValidFor, 
            nextAuthorizeDate, AppLocales.t("GENERAL_DAY"), element.brand+" " +element.model, element.licensePlate)
        )
        resultView.push(
            renderRemindItem(false, AppLocales.t("GENERAL_AUTHROIZE_INSURANCE"), diffDayFromLastAuthorizeInsurance, lastAuthDaysValidForInsurance, 
            nextAuthorizeDateInsurance, AppLocales.t("GENERAL_DAY"),
            element.brand+" " +element.model, element.licensePlate, element.ownerFullName)
        )
        resultView.push(
            renderRemindItem(false, AppLocales.t("GENERAL_AUTHROIZE_ROADFEE"), diffDayFromLastAuthorizeRoadFee, lastAuthDaysValidForRoadFee, 
            nextAuthorizeDateRoadFee, AppLocales.t("GENERAL_DAY"),
            element.brand+" " +element.model, element.licensePlate, element.ownerFullName)
        )
      }
    })
    resultView = resultView.filter(item => {
        if (item) {
            return true;
        } else {
            return false;
        }
    })

    this.numRemindPrivate=resultView.length;
    if (resultView.length > 0) {
        return resultView;
    } else {
        return (
            <NoDataText />
        )
    }
    
  }
  renderTabTeam() {
    let resultView = [];
    this.props.teamData.teamCarList.forEach(element => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        if (this.props.teamData.teamCarReports[element.id].maintainRemind) {
            var {lastKmMaintain, lastDateMaintain, lastMaintainKmValidFor, nextEstimatedKmForMaintain,
                nextEstimatedDateForMaintain, passedKmFromPreviousMaintain}
                = this.props.teamData.teamCarReports[element.id].maintainRemind;
            resultView.push(
                renderRemindItem(true, AppLocales.t("GENERAL_SERVICE"), passedKmFromPreviousMaintain, lastMaintainKmValidFor, 
                    null, "Km", element.brand+" " +element.model, element.licensePlate, element.ownerFullName)
            )
        }
        var {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize, lastAuthDaysValidFor,
                diffDayFromLastAuthorizeInsurance, nextAuthorizeDateInsurance, lastAuthDaysValidForInsurance,
                diffDayFromLastAuthorizeRoadFee, nextAuthorizeDateRoadFee, lastAuthDaysValidForRoadFee}
            = this.props.teamData.teamCarReports[element.id].authReport;

        

        resultView.push(
            renderRemindItem(true, AppLocales.t("GENERAL_AUTHROIZE_AUTH"), diffDayFromLastAuthorize, lastAuthDaysValidFor, 
            nextAuthorizeDate, AppLocales.t("GENERAL_DAY"),
            element.brand+" " +element.model, element.licensePlate, element.ownerFullName)
        )
        resultView.push(
            renderRemindItem(true, AppLocales.t("GENERAL_AUTHROIZE_INSURANCE"), diffDayFromLastAuthorizeInsurance, lastAuthDaysValidForInsurance, 
            nextAuthorizeDateInsurance, AppLocales.t("GENERAL_DAY"),
            element.brand+" " +element.model, element.licensePlate, element.ownerFullName)
        )
        resultView.push(
            renderRemindItem(true, AppLocales.t("GENERAL_AUTHROIZE_ROADFEE"), diffDayFromLastAuthorizeRoadFee, lastAuthDaysValidForRoadFee, 
            nextAuthorizeDateRoadFee, AppLocales.t("GENERAL_DAY"),
            element.brand+" " +element.model, element.licensePlate, element.ownerFullName)
        )
      }
    })
    resultView = resultView.filter(item => {
        if (item) {
            return true;
        } else {
            return false;
        }
    })
    this.numRemindTeam=resultView.length;

    if (resultView.length > 0) {
        return resultView;
    } else {
        return (
            <NoDataText />
        )
    }
  }
  render() {
    this.numRemindPrivate = 0;
    this.numRemindTeam = 0;
    let privateView = this.renderTabPrivate();
    let teamView = this.renderTabTeam();
    return (
        <View style={styles.container}>
            <View style={styles.textRow}>
                <Text><H3>
                {AppLocales.t("HOME_REMIND")}
                </H3></Text>

                <Segment small style={styles.segmentContainer}>
                    <Button small first onPress={() => this.setState({activeDisplay: 0})}
                        style={this.state.activeDisplay === 0 ? styles.activeSegment : styles.inActiveSegment}>
                        <Text style={this.state.activeDisplay === 0 ? styles.activeSegmentText : styles.inActiveSegmentText}>
                            {AppLocales.t("GENERAL_PRIVATE")}</Text>
                        {this.numRemindPrivate > 0 ? (
                        <Badge danger style={styles.notifyBadge}>
                            <Text style={styles.notifyBadgeText}>{this.numRemindPrivate}</Text>
                        </Badge>
                        ): null}
                    </Button>
                    <Button small last onPress={() => this.setState({activeDisplay: 1})}
                        style={this.state.activeDisplay === 1 ? styles.activeSegment : styles.inActiveSegment}>
                        <Text style={this.state.activeDisplay === 1 ? styles.activeSegmentText : styles.inActiveSegmentText}>
                            {AppLocales.t("GENERAL_TEAM")}</Text>
                        {this.numRemindTeam > 0 ? (
                        <Badge danger style={styles.notifyBadge}>
                            <Text style={styles.notifyBadgeText}>{this.numRemindTeam}</Text>
                        </Badge>
                        ): null}
                    </Button>
                </Segment>
            </View>
            
            <ScrollView>
                {(this.state.activeDisplay === 0) ? (
                    privateView
                ) : (
                    teamView
                )}
            </ScrollView>
        </View>
    )
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flexDirection: "column",
      //borderRadius: 7,
      justifyContent: "space-between",
      marginBottom: 20
    },

    segmentContainer: {
        marginRight: 5,
    },
    activeSegment: {
        backgroundColor: AppConstants.COLOR_BUTTON_BG,
        color:"white",
    },
    inActiveSegment: {
        backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
        color:AppConstants.COLOR_PICKER_TEXT,
    },
    activeSegmentText: {
        color:"white",
        fontSize: 12
    },
    inActiveSegmentText: {
        color:AppConstants.COLOR_PICKER_TEXT,
        fontSize: 12
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

    notifyBadge: {
        position:"relative",
        left: -8,
        //top: 14,
        top: 0,
        //bottom: 0,
        // width: 20,
        height: 20,
        flexDirection:"column",
        justifyContent: "center"
    },
    notifyBadgeText: {
        position:"relative",
        top: -2,
        fontSize: 11,
    },

    reminderItemContainer: {
        flexDirection: "row",
        height: 64,
        // borderWidth: 0.5,
        // borderColor: "grey",
        marginLeft: 5,
        marginRight: 5,
        marginTop: 3
    },
    reminderProgress: {
        width: 50,
        height: 50,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginRight: 10,
        marginLeft: 5
    },
    labelProgress: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    labelProgressText: {
        fontSize: 12
    },

    reminderInfo: {
        flexDirection: "column",
        justifyContent: "center"
    }

})

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ReminderReport);
