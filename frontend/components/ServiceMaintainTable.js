import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

class ServiceMaintainTable extends React.Component {
  constructor(props) {
    super(props);
  }

  parseMaintainTableData(theVehicle) {
    let arrCurrentKm = [];
    let arrDiffKm = ["-"];
    let arrCurrentDate = [];
    let arrDiffDay = ["-"];
    let tableData = []; // 2 dimensional array
    let widthArr = [];
    let firstCol = [];
    let arrMaintainType = [];

    let objTableData = {}; // {DauMay: [ThayThe,"","",BaoDUong]}

    let prevKm = 0;
    let prevDate = 0;
    let serviceArr = this.props.appData.typeService;
    if (theVehicle.type != "car") {
        serviceArr = this.props.appData.typeServiceBike;
    }
    serviceArr.forEach(item => {
        objTableData[""+item.name] = [];
        firstCol.push([item.name]);
    })

    if (theVehicle.serviceList && theVehicle.serviceList.length > 0) {
        theVehicle.serviceList.forEach(item => {
            let itemDate = AppUtils.normalizeFillDate(new Date(item.fillDate));


            arrCurrentDate.push(itemDate);
            arrCurrentKm.push(item.currentKm+"Km\n"+AppUtils.formatDateMonthDayYearVNShortShort(itemDate));
            if (!prevKm) {prevKm=item.currentKm; prevDate=itemDate}
            else {
                
                let diffTime = Math.abs(itemDate - prevDate); // in ms
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                let diffMonth = (diffDays/30).toFixed(1);
                arrDiffDay.push(diffMonth);
                arrDiffKm.push((item.currentKm - prevKm)+"Km\n"+"trong "+diffMonth+"tháng");

                prevKm=item.currentKm; prevDate=itemDate
            }

            if (item.isConstantFix) {
                arrMaintainType.push("Sửa Chữa Phát Sinh");
            } else {
                if (item.validFor > 100) {
                    arrMaintainType.push(item.validFor+" Km");
                } else {
                    arrMaintainType.push(item.validFor+" Tháng");
                }
            }

            for (let prop in objTableData) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objTableData, prop) && 
                        Object.prototype.hasOwnProperty.call(objTableData, prop)) {

                    if (item.serviceModule[""+prop]) {
                        // this time, this Module is in Maintain
                        objTableData[""+prop].push(item.serviceModule[""+prop][0]);
                    } else {
                        // Not in Service list, add empty
                        objTableData[""+prop].push("");
                    }
                }
            }
            widthArr.push(60);
        })
    }

    for (let prop in objTableData) {
        // Because these two Obj share same prop, so set in 1 for loop
        if (Object.prototype.hasOwnProperty.call(objTableData, prop) && 
                Object.prototype.hasOwnProperty.call(objTableData, prop)) {

            let rowData = [];
            rowData.push(...objTableData[""+prop])

            tableData.push(rowData)
        }
    }
    return {tableData, arrCurrentKm, arrDiffKm, arrCurrentDate, arrDiffDay, arrMaintainType, widthArr, firstCol};
  }

  
  render() {
    if (this.props.currentVehicle) {
        // const state = this.state;
        // const tableData = [];
        // for (let i = 0; i < 30; i += 1) {
        // const rowData = [];
        // for (let j = 0; j < 9; j += 1) {
        //     rowData.push(`${i}${j}`);
        // }
        // tableData.push(rowData);
        // }
        let {tableData, arrCurrentKm, arrDiffKm, arrCurrentDate, arrDiffDay, arrMaintainType, widthArr, firstCol} = this.parseMaintainTableData(this.props.currentVehicle)
        return (
            <View style={styles.container}>
                <View style={styles.textRow}>
                    <Text><H2>
                    {AppLocales.t("MYCAR_SERVICEREPORT")}
                    </H2></Text>
                </View>

                <View style={{flexDirection: "row"}}>
                <View style={{width: 80}}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        <Row data={["Loại Bảo Dưỡng"]} style={styles.headerFirst} textStyle={styles.textHeader}/>
                        <Row data={["Tại Km,Ngày"]} style={styles.headerFirst} textStyle={styles.textHeader}/>
                        <Row data={["Đi Thực Tế"]} style={styles.headerHighFirst} textStyle={styles.textHeader}/>
                    </Table>
                    <ScrollView style={styles.dataWrapper}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        {
                        firstCol.map((rowData, index) => (
                            <Row
                            key={index}
                            data={rowData}
                            style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                            textStyle={styles.textSmall}
                            />
                        ))
                        }
                    </Table>
                    </ScrollView>
                </View>

                <ScrollView horizontal={true} style={{}}>
                    <View>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            <Row data={arrMaintainType} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader}/>
                            <Row data={arrCurrentKm} widthArr={widthArr} style={styles.header} textStyle={styles.textHeaderMedium}/>
                            <Row data={arrDiffKm} widthArr={widthArr} style={styles.headerHigh} textStyle={styles.textHeaderSmall}/>
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            {
                            tableData.map((rowData, index) => (
                                <Row
                                key={index}
                                data={rowData}
                                widthArr={widthArr}
                                style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                                textStyle={styles.text}
                                />
                            ))
                            }
                        </Table>
                        </ScrollView>
                    </View>
                </ScrollView>
                </View>

                <View style={styles.textRow}>
                    <Text style={{fontSize: 14, fontStyle: "italic"}}>
                        {AppLocales.t("GENERAL_MAINTAIN_THAYTHE")[0]+": " + AppLocales.t("GENERAL_MAINTAIN_THAYTHE") + ". "}
                        {AppLocales.t("GENERAL_MAINTAIN_BAODUONG")[0]+": " + AppLocales.t("GENERAL_MAINTAIN_BAODUONG") + ". "}
                        {AppLocales.t("GENERAL_MAINTAIN_KIEMTRA")[0]+": " + AppLocales.t("GENERAL_MAINTAIN_KIEMTRA") + ". "}
                    </Text>
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
      borderWidth: 0.5,
      borderColor: "grey",
      justifyContent: "space-between",
      marginBottom: 20,
      borderRadius: 7,
      paddingBottom: 20
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
    header: { height: 30, backgroundColor: '#537791' },
    headerHigh: {height: 40, backgroundColor: '#537791'},
    headerFirst: { height: 30, backgroundColor: '#5377A1' },
    headerHighFirst: {height: 40, backgroundColor: '#5377A1'},

    text: { textAlign: 'center', fontWeight: '100' },
    textSmall: { textAlign: 'center', fontSize: 12, },
    textHeader: {textAlign: 'center', fontSize: 13, color: "white"},
    textHeaderMedium: {textAlign: 'center', fontSize: 12, color: "white"},
    textHeaderSmall: {textAlign: 'center', fontSize: 11, color: "white"},
    dataWrapper: { marginTop: -1 },
    row: { height: 25, backgroundColor: '#E7E6E1' }

})

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData,
    appData: state.appData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ServiceMaintainTable);
