import React, { Component } from 'react'
import QLXLayout from "../../components/QLXLayout"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import AppConstants from '../../utils/AppConstants'
import AppUtils from '../../utils/AppUtils'
import {VictoryLabel, VictoryPie, VictoryBar, VictoryContainer, VictoryLegend, VictoryStack, VictoryChart, VictoryAxis, VictoryLine, VictoryScatter} from 'victory';
import axios from 'axios';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import CountryCaseDeathBar from '../../components/corona/CountryCaseDeathBar'
import { StyleSheet, css } from 'aphrodite';

import { Helmet } from "react-helmet"

axios.defaults.baseURL = AppConstants.SERVER_API;

const styles = StyleSheet.create({
    txtNotice: {
        fontSize: '1.0em',
        margin: "0 auto"
    }
});

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            country:AppConstants.NHOME_GENERAL_WORLD,
            ncov: {}
        };
    }
    componentDidMount() {
        if (!this.state.ncov.data) {
            axios.get("/ncov/data",
            { headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials':true,
                'APIKEY': 'WEB-S1E9C9R0E0T5K0E7Y-QLXGW',
            }})
            .then((response) => {
                
                this.setState({
                    ncov: response.data.nCoV
                })
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }
    componentDidUpdate() {
        if (!this.state.ncov.data) {
            axios.get("/ncov/data",
            { headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials':true,
                'APIKEY': 'WEB-S1E9C9R0E0T5K0E7Y-QLXGW',
            }})
            .then((response) => {
                
                this.setState({
                    ncov: response.data.nCoV
                })
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    renderDropdownItemCountry(inputData) {
        
        var dropdownView = [];
        this.arrLabels = [];
        dropdownView.push(
            <Dropdown.Item eventKey={0}
                key={AppConstants.NHOME_GENERAL_WORLD}>
                {AppConstants.NHOME_GENERAL_WORLD} 
            </Dropdown.Item>
        )
        this.arrLabels.push(AppConstants.NHOME_GENERAL_WORLD)

        dropdownView.push(
            <Dropdown.Item eventKey={1}
                key={AppConstants.NHOME_GENERAL_OTHER_COUNTRY}>
                {AppConstants.NHOME_GENERAL_OTHER_COUNTRY} 
            </Dropdown.Item>
        )
        this.arrLabels.push(AppConstants.NHOME_GENERAL_OTHER_COUNTRY)
            
        dropdownView.push(<Dropdown.Divider />)
        inputData.data[0].countries.forEach((item, idx) => {
            //if (idx > 0) {
                dropdownView.push (
                    <Dropdown.Item eventKey={idx+1}
                        key={item.name}>
                        {item.name} 
                    </Dropdown.Item>
                )
                this.arrLabels.push(item.name)
            //}
        })
        
        return dropdownView;
    }

    parseWorldCurrimulative(inputData, showSpecific) {
        let caseArr = [];
        let deathArr = [];
        let tickXLabels = [];
        let noteText = null;
        let selectCountry = this.state.country;
    
        if (showSpecific && this.props.showSpecific!=AppConstants.NHOME_GENERAL_OTHER_COUNTRY) {
            selectCountry = showSpecific;
        }
        if (selectCountry == AppConstants.NHOME_GENERAL_WORLD) {
            if (inputData && inputData.data && inputData.data.length > 0) {
                inputData.data.forEach( item => {
                    let xDate = new Date(item.date)
                    AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
    
                    caseArr.push({x: xDate, y: item.world.case})
                    deathArr.push({x: xDate, y: item.world.death})
                })
            }
        } else if (selectCountry == AppConstants.NHOME_GENERAL_OTHER_COUNTRY) {
            // Other Country than China Mainland
            if (inputData && inputData.data && inputData.data.length > 0) {
                inputData.data.forEach( item => {
                    let xDate = new Date(item.date)
                    AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
    
                    let caseNo = item.world.case;
                    let deathNo = item.world.death;
                    if (item.countries.length > 0) {
                        caseArr.push({x: xDate, y: item.world.case - item.countries[0].case})
                        deathArr.push({x: xDate, y: item.world.death - item.countries[0].death})
                    }
                    
                })
            }
        } else {
            // Specific Country
            if (inputData && inputData.data && inputData.data.length > 0) {
                let isFirstData = true;
    
                inputData.data.forEach( item => {
                    let xDate = new Date(item.date)
                    AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
    
                    let isExist = false;
                    if (item.countries.length > 0) {
                        for(let i = 0; i < item.countries.length; i++) {
                            let theCountry = item.countries[i]
                            if (theCountry.name == selectCountry) {
                                if (isFirstData) {
                                    noteText = theCountry.note;
                                    isFirstData = false;
                                }
                                caseArr.push({x: xDate, y: theCountry.case})
                                deathArr.push({x: xDate, y: theCountry.death})
                                isExist = true;
                                break;
                            }
                        }
                    }
    
                    if (!isExist) {
                        caseArr.push({x: xDate, y: 0})
                        deathArr.push({x: xDate, y: 0})
                    }
    
                    
                })
            }
        }
    
        return {caseArr, deathArr, tickXLabels, noteText};
    }

    render() {
        let theData = this.state.ncov;
        console.log("theData.data")
        console.log(theData.data)
        if (theData.data) {

            let totalCaseWorld = theData.data[0].world.case;
            let totalCaseChina = theData.data[0].countries[0].case;

            let vietnamData = null;
            let vietnamDataPre = null;
            let foundLatestVN = false;
            let isFinish = false;
            if (theData.data && theData.data.length > 0 && theData.data[0].countries) {
            var latestDate = new Date(theData.data[0].date);
            for (let c = 0; c < theData.data.length; c++) {

                for (let i = 0; i < theData.data[c].countries.length; i++) {
                let theCountry = theData.data[c].countries[i];
                if (theCountry.name.toLowerCase() == "vietnam" || theCountry.name.toLowerCase() == "viet nam") {
                    if (!foundLatestVN) {
                    vietnamData = theCountry;
                    vietnamDataPre = theCountry;
                    foundLatestVN = true;
                    } else {
                    vietnamDataPre = theCountry;
                    isFinish = true;
                    break;
                    }
                }
                }
                if (isFinish) {
                break;
                }
            }
            }

            let caseArr1 = [{x:1, y: 8096},{x:2, y: 2494},{x:3,y:theData.data[0].world.case}]
            let deathArr1 = [{x:1, y: 774},{x:2, y: 858},{x:3,y:theData.data[0].world.death}]
            let arrLabelX = ["MERS-CoV","SARS-CoV", "nCoV"]
            let theBarWidth = 25;
            
            let dropdownView = this.renderDropdownItemCountry(theData);

            var {caseArr, deathArr, tickXLabels, noteText} 
                = this.parseWorldCurrimulative(theData);
            tickXLabels = AppUtils.reviseTickLabelsToCount(tickXLabels, 14);
            let hubeiData = theData.china_province[0].provinces[0];

            return (
                <QLXLayout>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Corona Virus Live Stats - nCoV Wuhan 2019-2020</title>
                    <link rel="canonical" href="http://localhost:8000/coronavirus" />
                </Helmet>
                <div style={{marginLeft:"10px", marginRight:"10px", marginTop:"10px"}}>
                <Row>
                    <Col xs={0} md={1}>

                    </Col>

                    <Col xs={12} md={10}><div>
                        <div style={{textAlign:"center"}}>
                            <span style={{margin: "0 auto", color: AppConstants.COLOR_TEXT_DARKEST_INFO, fontSize: "1.8em"}}>
                                Corona Virus Live Stats - Wuhan nCoV 2019-2020</span>
                        </div>

                        {latestDate ? 
                        <div>
                            <span style={{margin: "0 auto", fontStyle:"italic", color: AppConstants.COLOR_TEXT_LIGHT_INFO, fontSize: "0.9em"}}>
                                Live Stats at {" "+latestDate.toGMTString()}</span>
                        </div> : null}
                    <Card>
                        <Card.Header>
                            <div style={{textAlign: "center", fontSize:"1.8em"}}>{AppConstants.NHOME_GENERAL_WORLD}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={4} style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_CASE_CURVED}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_D3_DARK_GREEN, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].world.curve)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                            {theData.data[1].world.curve ? AppUtils.formatValueWithSign(theData.data[0].world.curve - theData.data[1].world.curve) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                            {theData.data[1].world.curve ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>


                                <Col xs={12} md={4} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row>
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{display: "inline-block", color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_CASE_CONFIRMED}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 38,margin: "0 auto"}}>
                                        {(theData.data[0].world.case)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                            {theData.data[1].world.case ? 
                                                AppUtils.formatValueWithSign(theData.data[0].world.case - theData.data[1].world.case) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{textAlign: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                            {theData.data[1].world.case ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>

                                <Col xs={12} md={4} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO,margin: "0 auto"}}>
                                            {AppConstants.NHOME_CASE_DEATH}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_GOOGLE, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].world.death)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                            {theData.data[1].world.death ? 
                                                AppUtils.formatValueWithSign(theData.data[0].world.death - theData.data[1].world.death) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                            {theData.data[1].world.death ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>

                    <br />

                    <Card>
                        <Card.Header>
                            <div style={{textAlign: "center", fontSize:"1.8em"}}>
                                {AppConstants.NHOME_GENERAL_CHINA}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={4} style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_CASE_CURVED}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_D3_DARK_GREEN, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].countries[0].curve)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                        {theData.data[1].countries[0].curve ? AppUtils.formatValueWithSign(theData.data[0].countries[0].curve - theData.data[1].countries[0].curve) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                        {theData.data[1].countries[0].curve ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>


                                <Col xs={12} md={4} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row>
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{display: "inline-block", color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_CASE_CONFIRMED}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 38,margin: "0 auto"}}>
                                        {(theData.data[0].countries[0].case)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                            {theData.data[1].countries[0].case ? 
                                                AppUtils.formatValueWithSign(theData.data[0].countries[0].case - theData.data[1].countries[0].case) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{textAlign: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                            {theData.data[1].countries[0].case ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>

                                <Col xs={12} md={4} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO,margin: "0 auto"}}>
                                            {AppConstants.NHOME_CASE_DEATH}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_GOOGLE, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].countries[0].death)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                        {theData.data[1].countries[0].death ? 
                                                AppUtils.formatValueWithSign(theData.data[0].countries[0].death - theData.data[1].countries[0].death) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                            {theData.data[1].countries[0].death ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>

                    <br />

                    <Card>
                        <Card.Header>
                            <div style={{textAlign: "center", fontSize:"1.8em"}}>
                                {AppConstants.NHOME_GENERAL_OTHER_COUNTRY}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {(theData.data[0].world.curve && theData.data[0].countries[0].curve) ? 
                                <Col xs={12} md={4} style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_CASE_CURVED}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_D3_DARK_GREEN, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].world.curve - theData.data[0].countries[0].curve)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                            {(theData.data[1].world.curve - theData.data[1].countries[0].curve) ? 
                                            AppUtils.formatValueWithSign((theData.data[0].world.curve - theData.data[0].countries[0].curve) - 
                                            (theData.data[1].world.curve - theData.data[1].countries[0].curve)) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                        {(theData.data[1].world.curve - theData.data[1].countries[0].curve) ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col> : null}


                                <Col xs={12} md={4} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row>
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{display: "inline-block", color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_CASE_CONFIRMED}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 38,margin: "0 auto"}}>
                                        {(theData.data[0].world.case - theData.data[0].countries[0].case)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                            {theData.data[1].countries[0].case ? 
                                                AppUtils.formatValueWithSign(((theData.data[0].world.case - 
                                                    theData.data[0].countries[0].case) - 
                                                    (theData.data[1].world.case - 
                                                    theData.data[1].countries[0].case))) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{textAlign: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                            {theData.data[1].countries[0].case ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>

                                <Col xs={12} md={4} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO,margin: "0 auto"}}>
                                            {AppConstants.NHOME_CASE_DEATH}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_GOOGLE, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].world.death - theData.data[0].countries[0].death)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                        {theData.data[1].countries[0].death ? 
                                                AppUtils.formatValueWithSign(((theData.data[0].world.death - 
                                                    theData.data[0].countries[0].death) - 
                                                    (theData.data[1].world.death - 
                                                    theData.data[1].countries[0].death))) : ""}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                            {theData.data[1].countries[0].death ? AppConstants.NHOME_GENERAL_PREV_DAY : ""}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>


                    <br />

                    <Card>
                        <Card.Header>
                            <div style={{textAlign: "center", fontSize:"1.8em"}}>
                                {AppConstants.NHOME_GENERAL_VIETNAM}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {(theData.data[0].world.curve && theData.data[0].countries[0].curve) ? 
                                <Col xs={12} md={3} style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_CASE_CONFIRMED_VN}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 34,margin: "0 auto"}}>
                                        {vietnamData.case}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                            {AppUtils.formatValueWithSign((vietnamData.case - vietnamDataPre.case))}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                        {AppConstants.NHOME_GENERAL_PREV_DAY}
                                        </div>
                                    </Row>
                                    </div>
                                </Col> : null}


                                <Col xs={12} md={3} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row>
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{display: "inline-block", color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_CASE_DEATH_VN}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_GOOGLE, fontSize: 38,margin: "0 auto"}}>
                                        {(vietnamData.death)}
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO,margin: "0 auto"}}>
                                        {AppUtils.formatValueWithSign(vietnamData.death - vietnamDataPre.death)}
                                        </div>
                                    </Row>
                                    
                                    <Row>
                                        <div style={{textAlign: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                            {AppConstants.NHOME_GENERAL_PREV_DAY}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>

                                <Col xs={12} md={3} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO,margin: "0 auto"}}>
                                            {AppConstants.NHOME_CASE_SUSPECT_VN}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_TEXT_DARKEST_INFO, fontSize: 34,margin: "0 auto"}}>
                                        {vietnamData.suspect}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>

                                <Col xs={12} md={3} style={{textAlign: "center"}}>

                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO,margin: "0 auto"}}>
                                            {vietnamData.curve ? AppConstants.NHOME_CASE_CURVED_VN : AppConstants.NHOME_CASE_ISOLATE_VN}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_D3_DARK_GREEN, fontSize: 34,margin: "0 auto"}}>
                                        {(vietnamData.curve ? vietnamData.curve : vietnamData.isolate)}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{marginTop: "20px", width: "100%"}}>
                                <CountryCaseDeathBar theData={theData} showVietnamProvince={true}/>
                            </Row>
                        </Card.Body>
                    </Card>


                    <br />


                    <Card>
                        <Card.Header>
                            <div style={{textAlign: "center", fontSize:"1.8em"}}>
                                Overall Stats
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={3} style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_TRANS_RATE}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].tranmission_rate_min)+" - " + 
                                            theData.data[0].tranmission_rate_max}
                                        </div>
                                    </Row>


                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 15,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                        {AppConstants.NHOME_TRANS_RATE_NOTE}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>


                                <Col xs={12} md={3} style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_FATAL_RATE}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_GOOGLE, fontSize: 34,margin: "0 auto"}}>
                                        {AppUtils.formatToPercent(theData.data[0].world.death, theData.data[0].world.death+theData.data[0].world.case)}
                                        </div>
                                    </Row>


                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 15,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                        {AppConstants.NHOME_FATAL_RATE_NOTE}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>

                                <Col xs={12} md={3} style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_INCU_PERIOD}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].incubation_period_min)+" - " + 
                                            theData.data[0].incubation_period_max}
                                        </div>
                                    </Row>


                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 15,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                        {AppConstants.NHOME_INCU_PERIOD_NOTE}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>


                                <Col xs={12} md={3} style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                    <Row >
                                        <div className={css(styles.txtNotice)}>
                                            <div style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                            {AppConstants.NHOME_COUNTRIES}
                                            </div>
                                        </div>
                                    </Row>

                                    <Row>
                                        <div style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 34,margin: "0 auto"}}>
                                        {(theData.data[0].countries.length)}
                                        </div>
                                    </Row>


                                    <Row>
                                        <div style={{alignSelf: "center", fontSize: 14,color: AppConstants.COLOR_TEXT_LIGHT_INFO,margin: "0 auto"}}>
                                        {AppUtils.formatValueWithSign((theData.data[0].countries.length - theData.data[1].countries.length)) + 
                                        " "+AppConstants.NHOME_GENERAL_PREV_DAY}
                                        </div>
                                    </Row>
                                    </div>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>

                    <br />

                    <Row>
                        <Col xs={12} md={6}>
                            <Card>
                            <Card.Header>
                                <div style={{textAlign: "center", fontSize:"1.6em"}}>
                                    {AppConstants.NHOME_HEADER_CASE_PIE}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div>
                                <VictoryPie
                                    colorScale={AppConstants.COLOR_SCALE_10}
                                    data={[{x:AppConstants.NHOME_GENERAL_CHINA, y: totalCaseChina},
                                    {x:AppConstants.NHOME_GENERAL_OTHER_COUNTRY, y: totalCaseWorld-totalCaseChina}]}
                                    radius={100}
                                    labels={({ datum }) => (datum&&datum.y > 0) ? (
                                        (datum.y) + "\n"
                                        +"("+AppUtils.formatToPercent(datum.y, totalCaseWorld)+")") : ""}
                                    labelRadius={({ radius }) => radius + 5 }
                                    //labelComponent={<VictoryLabel style={{fontSize: 8, color: AppConstants.COLOR_TEXT_LIGHT_INFO}}/>}
                                    height={300}
                                    width={300}
                                    style={{
                                        labels: {
                                        fontSize: 14, fill: AppConstants.COLOR_TEXT_DARKDER_INFO
                                        }
                                    }}
                                />
                                </div>
                                <div style={{marginTop: 5, marginLeft: 10}}>
                                    <VictoryContainer
                                        //width={Layout.window.width}
                                        height={20}
                                    >
                                    <VictoryLegend standalone={false}
                                        x={15} y={5}
                                        itemsPerRow={4}
                                        colorScale={AppConstants.COLOR_SCALE_10}
                                        orientation="horizontal"
                                        gutter={20}
                                        symbolSpacer={7}
                                        labelComponent={<VictoryLabel style={{fontSize: 17}}/>}
                                        data={[{name:AppConstants.NHOME_GENERAL_CHINA},{name:AppConstants.NHOME_GENERAL_OTHER_COUNTRY}]}
                                    />
                                    </VictoryContainer>
                                </div>
                            </Card.Body>

                            </Card>
                        </Col>


                        <Col xs={12} md={6}>
                            <Card>
                            <Card.Header>
                                <div style={{textAlign: "center", fontSize:"1.6em"}}>
                                SARS(2003) vs MERS(2012) vs nCoV
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <div style={{fontSize: 10,textAlign:"center"}}>
                                        {AppConstants.NHOME_FATAL_RATE}
                                        </div>
                                    </Col>
                                    <Col>
                                        <div style={{fontSize: 10,textAlign:"center"}}>
                                        {AppConstants.NHOME_FATAL_RATE}
                                        </div>
                                    </Col>
                                    <Col>
                                        <div style={{fontSize: 10,textAlign:"center"}}>
                                        {AppConstants.NHOME_FATAL_RATE}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div style={{color: AppConstants.COLOR_GOOGLE,fontSize: 28,textAlign:"center"}}>
                                        {"9.6%"}
                                        </div>
                                    </Col>
                                    <Col>
                                        <div style={{color: AppConstants.COLOR_GOOGLE,fontSize: 28,textAlign:"center"}}>
                                        {"34.4%"}
                                        </div>
                                    </Col>
                                    <Col>
                                        <div style={{color: AppConstants.COLOR_GOOGLE,fontSize: 28,textAlign:"center"}}>
                                        {AppUtils.formatToPercent(theData.data[0].world.death, theData.data[0].world.death+theData.data[0].world.case)}
                                        </div>
                                    </Col>
                                </Row>
                                <div>
                                    <VictoryChart
                                        //width={Layout.window.width}
                                        height={420}
                                        padding={{top:20,bottom:20,left:10,right:10}}
                                        domainPadding={{y: [0, 0], x: [50, 50]}}
                                        colorScale={AppConstants.COLOR_SCALE_10}
                                    >
                                    <VictoryStack
                                        //width={Layout.window.width}
                                        //domainPadding={{y: [0, 10], x: [20, 10]}}
                                        colorScale={AppConstants.COLOR_SCALE_10}
                                    >
                                        <VictoryBar
                                            barWidth={theBarWidth}
                                            data={caseArr1}
                                            labels={({ datum }) => `${datum.y>0?(datum.y+"\ncases"):""}`}
                                            labelComponent={<VictoryLabel dx={30} dy={20} style={{fontSize: 12}}/>}
                                        />
                                        <VictoryBar
                                            barWidth={theBarWidth}
                                            data={deathArr1}
                                            labels={({ datum }) => `${datum.y>0?(datum.y+" deaths"):""}`}
                                            labelComponent={<VictoryLabel dx={0} dy={-5} style={{fontSize: 12}}/>}
                                        />
                                    </VictoryStack>
                                    <VictoryAxis
                                        crossAxis
                                        standalone={false}
                                        tickValues={arrLabelX}
                                        //tickFormat={(t,idx) => `${AppUtils.formatDateMonthYearVN(t)}`}
                                        tickLabelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                                        // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                                        //tickValues={tickXLabels}
                                        style={{
                                            // grid: {stroke: "rgb(240,240,240)"},
                                            //ticks: {stroke: "grey", size: 5},
                                            tickLabels: {fontSize: 12,padding: 1, angle: 0}
                                        }}
                                    />
                                    </VictoryChart>
                                </div>
                            </Card.Body>

                            </Card>
                        </Col>
                    </Row>

                    <br />

                    <Card>
                        <Card.Header>
                            <div style={{textAlign: "center", fontSize:"1.8em"}}>
                                <DropdownButton id="dropdown-basic-button" title={"Cummulative Data: "+this.state.country}
                                    drop={"down"}
                                    variant="secondary">
                                    {dropdownView}
                                </DropdownButton>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>{AppConstants.NHOME_HEADER_TOTAL_CASE_BYTIME}</Card.Title>
                            <VictoryChart
                                //width={Layout.window.width}
                                height={250}
                                padding={{top:7,bottom:25,left:5,right:0}}
                                domainPadding={{y: [10, 40], x: [22, 22]}}
                            >
                                <VictoryLine
                                    interpolation="linear"
                                    data={caseArr}
                                    style={{
                                        data: {
                                            //fill: AppConstants.COLOR_D3_MIDDLE_GREEN, fillOpacity: 0.08, 
                                            stroke: AppConstants.COLOR_HEADER_BG, strokeWidth: 1
                                        },
                                    }}
                                    labels={({ datum }) => (datum&&datum.y > 0&&tickXLabels.indexOf(datum.x)>0) ? (datum.y) : ""}
                                    labelComponent={<VictoryLabel style={{fontSize: 9}}/>}
                                    colorScale={AppConstants.COLOR_SCALE_10}
                                />

                                <VictoryScatter
                                    style={{ data: { fill: AppConstants.COLOR_HEADER_BG } }}
                                    size={2}
                                    data={caseArr}
                                />

                                <VictoryAxis
                                    crossAxis
                                    standalone={false}
                                    tickFormat={(t) => `${AppUtils.formatDateMonthDayVN(new Date(t))}`}
                                    tickLabelComponent={<VictoryLabel style={{fontSize: 8}}/>}
                                    // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                                    tickValues={tickXLabels}
                                    style={{
                                        // grid: {stroke: "rgb(240,240,240)"},
                                        ticks: {stroke: "grey", size: 3},
                                        tickLabels: {fontSize: 8, padding: 5, angle: 30}
                                    }}
                                />
                                <VictoryAxis
                                    dependentAxis
                                    standalone={false}
                                    tickFormat={(t) => `${(t>=1) ? t : 0}`}
                                    // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                                    style={{
                                        // ticks: {stroke: "grey", size: 5},
                                        tickLabels: {fontSize: 8, padding: -8,textAnchor:"start"},
                                        grid: {stroke: ({ tick }) => AppConstants.COLOR_GREY_LIGHT_BG},
                                    }}
                                />

                            </VictoryChart>



                            <Card.Title>{AppConstants.NHOME_HEADER_TOTAL_CASE_BYTIME}</Card.Title>
                            <VictoryChart
                                //width={Layout.window.width}
                                height={250}
                                padding={{top:7,bottom:25,left:5,right:0}}
                                domainPadding={{y: [10, 40], x: [22, 22]}}
                            >
                                <VictoryLine
                                    interpolation="linear"
                                    data={deathArr}
                                    style={{
                                        data: {
                                            //fill: AppConstants.COLOR_D3_MIDDLE_GREEN, fillOpacity: 0.08, 
                                            stroke: AppConstants.COLOR_GOOGLE, strokeWidth: 1
                                        },
                                    }}
                                    labels={({ datum }) => (datum&&datum.y > 0&&tickXLabels.indexOf(datum.x)>0) ? (datum.y) : ""}
                                    labelComponent={<VictoryLabel style={{fontSize: 9}}/>}
                                    colorScale={AppConstants.COLOR_SCALE_10}
                                />

                                <VictoryScatter
                                    style={{ data: { fill: AppConstants.COLOR_GOOGLE } }}
                                    size={2}
                                    data={deathArr}
                                />

                                <VictoryAxis
                                    crossAxis
                                    standalone={false}
                                    tickFormat={(t) => `${AppUtils.formatDateMonthDayVN(new Date(t))}`}
                                    tickLabelComponent={<VictoryLabel style={{fontSize: 8}}/>}
                                    // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                                    tickValues={tickXLabels}
                                    style={{
                                        // grid: {stroke: "rgb(240,240,240)"},
                                        ticks: {stroke: "grey", size: 3},
                                        tickLabels: {fontSize: 8, padding: 5, angle: 30}
                                    }}
                                />
                                <VictoryAxis
                                    dependentAxis
                                    standalone={false}
                                    tickFormat={(t) => `${(t>=1) ? t : 0}`}
                                    // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                                    style={{
                                        // ticks: {stroke: "grey", size: 5},
                                        tickLabels: {fontSize: 8, padding: -8,textAnchor:"start"},
                                        grid: {stroke: ({ tick }) => AppConstants.COLOR_GREY_LIGHT_BG},
                                    }}
                                />

                            </VictoryChart>

                        </Card.Body>
                    </Card>

                    <br />

                    <Card>
                        <Card.Header style={{fontSize:"1.7em"}}>
                        {AppConstants.NHOME_HEADER_COUNTRIES_BAR}
                        </Card.Header>
                        <Card.Body>
                            <CountryCaseDeathBar theData={theData}/>
                        </Card.Body>
                    </Card>

                    <br />

                    <Card>
                        <Card.Header style={{fontSize:"1.7em"}}>
                        {AppConstants.NHOME_HEADER_CHINA_PROVINCES}
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>{hubeiData.name + ": " + hubeiData.case}</Card.Title>
                            <CountryCaseDeathBar theData={theData} showChinaProvince={true} noLegend={true}/>
                        </Card.Body>
                    </Card>

                    </div>
                    </Col>

                    <Col xs={0} md={1}>

                    </Col>
                    </Row>
                </div>
                </QLXLayout>
            )
            } else {
                return (
                    <QLXLayout>
                        <div style={{marginLeft:"10px", marginRight:"10px", textAlign: "justify", marginTop: "10px",marginBottom:"70px"}}>
                 
                            <div style={{textAlign:"center"}}>
                                <span style={{margin: "0 auto", color: AppConstants.COLOR_TEXT_DARKEST_INFO, fontSize: "1.8em"}}>
                                    Corona Virus Live Stats - Wuhan nCoV 2019-2020</span>
                            </div>

                            <div style={{textAlign:"center", marginTop:"10px"}}>
                                <span style={{margin: "0 auto"}}>No Data</span>
                            </div>
                  
                        </div>
                    </QLXLayout>
                )
            } 
    }
}
