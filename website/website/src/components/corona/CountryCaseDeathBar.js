import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import AppConstants from '../../utils/AppConstants'
import AppUtils from '../../utils/AppUtils'
import {VictoryLabel, VictoryPie, VictoryBar, VictoryContainer, VictoryLegend, VictoryStack, VictoryChart, VictoryAxis, VictoryLine, VictoryScatter} from 'victory';


export default class CountryCaseDeathBar extends Component {
    //   data: [
    //     {
    //         date:"2020-01-31 12:45",
            // countries: [
            //     {
            //         name:"China",
            //         name_vn:"China",
            //         code:"cn",
            //         case: 9782,
            //         death: 213,
            //     },
    //     }]

  // Out
  // data:[{x:1|2|3,y}]
  // arrLabelY:["China","Vietnam"]
    parseCountriesTop(inputData, showChinaProvince, showVietnamProvince) {
        let caseArr = [];
        let deathArr = [];
        let arrLabelY = [];
        let hubeiData = null;

        if (showVietnamProvince) {
            if (inputData && inputData.vietnam_province && inputData.vietnam_province.length > 0 && inputData.vietnam_province[0].provinces) {
                inputData.vietnam_province[0].provinces.forEach( (item,idx) => {
                    arrLabelY.push(item.name)

                    caseArr.push({x: idx+1, y: item.case})
                    if (item.death) {
                        deathArr.push({x: idx+1, y: item.death})
                    } else {
                        deathArr.push({x: idx+1, y: 0})
                    }
                })
            }
        } else
        if (showChinaProvince) {
            if (inputData && inputData.china_province && inputData.china_province.length > 0 && inputData.china_province[0].provinces) {
                inputData.china_province[0].provinces.forEach( (item,idx) => {
                    if (idx > 0) {
                        arrLabelY.push(item.name)

                        caseArr.push({x: idx, y: item.case})
                        if (item.death) {
                            deathArr.push({x: idx, y: item.death})
                        }
                    } else {
                        hubeiData = item;
                    }
                })
            }
        } else {
            // Show Other countries
            if (inputData && inputData.data && inputData.data.length > 0 && inputData.data[0].countries) {
                inputData.data[0].countries.forEach( (item,idx) => {
                    if (idx > 0) {
                    let xDate = new Date(item.date)
                    arrLabelY.push(item.name)

                    caseArr.push({x: idx, y: item.case})
                    deathArr.push({x: idx, y: item.death})
                    }
                })
            }
        }

        return {caseArr, deathArr, arrLabelY, hubeiData};
    }

    render() {
       
        var {caseArr, deathArr, arrLabelY, hubeiData} = this.parseCountriesTop(this.props.theData, this.props.showChinaProvince, this.props.showVietnamProvince)
        let theBarWidth = 8;
        if (arrLabelY.length < 10) {
            theBarWidth = 13;
        }

        return (
                <div style={{width:"100%", height: "100%"}}>
                    <VictoryChart
                        //width={Layout.window.width}
                        height={arrLabelY.length*17 < 150 ? 150 :arrLabelY.length*17 }
                        padding={{top:5,bottom:20,left:73,right:30}}
                        domainPadding={{y: [0, 0], x: [20, 10]}}
                        colorScale={AppConstants.COLOR_SCALE_10}
                    >
                    <VictoryStack
                        //width={Layout.window.width}
                        //domainPadding={{y: [0, 10], x: [20, 10]}}
                        colorScale={AppConstants.COLOR_SCALE_10}
                    >
                    {/* <VictoryGroup offset={100}
                        colorScale={AppConstants.COLOR_SCALE_10}
                    > */}
                        <VictoryBar
                            barWidth={theBarWidth}
                            data={caseArr}
                            horizontal
                            labels={({ datum }) => `${datum.y>0?datum.y:""}`}
                            labelComponent={<VictoryLabel dx={1} style={{fontSize: 9}}/>}
                        />
                        <VictoryBar
                            barWidth={theBarWidth}
                            data={deathArr}
                            horizontal
                            labels={({ datum }) => `${datum.y>0?datum.y:""}`}
                            labelComponent={<VictoryLabel dx={1} style={{fontSize: 9}}/>}
                        />
                    </VictoryStack>
                    <VictoryAxis
                        crossAxis
                        standalone={false}
                        tickValues={arrLabelY}
                        //tickFormat={(t,idx) => `${AppUtils.formatDateMonthYearVN(t)}`}
                        tickLabelComponent={<VictoryLabel style={{fontSize: 9}}/>}
                        // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                        //tickValues={tickXLabels}
                        style={{
                            // grid: {stroke: "rgb(240,240,240)"},
                            //ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 8,padding: 1, angle: 0}
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        standalone={false}
                        //label={arrLabelY[this.state.activeDisplay]}
                        axisLabelComponent={<VictoryLabel dy={40} dx={120} style={{fontSize: 10}}/>}
                        // tickFormat={(t) => `${this.state.activeDisplay!= 0 ? AppUtils.formatMoneyToK(t) :
                        //     AppUtils.formatDistanceToKm(t)}`}
                        // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                        style={{
                            ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 9, padding: 0}
                        }}
                    />
                    </VictoryChart>

                    {this.props.noLegend ? null :
                    <div style={{marginTop: 5, marginLeft: 10, marginBottom: 10}}>
                        <VictoryContainer
                            //width={Layout.window.width}
                            height={20}
                        >
                        <VictoryLegend standalone={false}
                            x={15} y={5}
                            itemsPerRow={4}
                            colorScale={AppConstants.COLOR_SCALE_10}
                            orientation="horizontal"
                            gutter={30}
                            symbolSpacer={5}
                            labelComponent={<VictoryLabel style={{fontSize: 17}}/>}
                            data={[{name:this.props.showVietnamProvince ? AppConstants.NHOME_CASE_CONFIRMED_VN: AppConstants.NHOME_CASE_CONFIRMED},
                                {name:this.props.showVietnamProvince ? AppConstants.NHOME_CASE_DEATH_VN: AppConstants.NHOME_CASE_DEATH}]}
                        />
                        </VictoryContainer>
                    </div>}

                </div>
        )
    }
}
