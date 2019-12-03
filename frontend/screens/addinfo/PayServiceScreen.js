import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input,Label, DatePicker, CheckBox, ListItem } from 'native-base';

import {HeaderText} from '../../components/StyledText'
import AppConstants from '../../constants/AppConstants'
import Layout from '../../constants/Layout';
import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';

function renderMaintainModuleItem(item, onRemove) {
    return (
    <View style={{flexDirection:"row", backgroundColor: "cyan"}} key={item}>
        <Text>{item}</Text>
        <Icon type="FontAwesome" name="remove" style={{fontSize: 12}}/>
    </View>
    )
}

class PayServiceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            id: 0, // increment
            vehicleId: 0,
            fillDate: new Date().toLocaleString(),
            price: "",
            currentKm: "",
            amount: "",
            type: "service",
            subType: "", // not used
            remark: "",
            validFor: 5000, // km or Month
            validForIndex: 0, // index in array of maintain type
            serviceModule: {}, // Bo Phan cua Xe Sua Chua
            isConstantFix: false // when FIx sudden a problem of Car, not Maintainance 
        };

        this.save = this.save.bind(this)
        this.setMaintainType = this.setMaintainType.bind(this)
        this.onUpdateMaintainModules = this.onUpdateMaintainModules.bind(this)
        this.removeMaintainModule = this.removeMaintainModule.bind(this)
    }

    componentWillMount() {
        console.log("            PayService Screen WillMount")
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            const currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
            for (let i = 0; i < currentVehicle.serviceList.length; i++) {
                if (currentVehicle.serviceList[i].id == AppConstants.CURRENT_EDIT_FILL_ID) {
                    AppConstants.TEMPDATA_SERVICE_MAINTAIN_MODULES = currentVehicle.serviceList[i].serviceModule;

                    this.setState({
                        ...currentVehicle.serviceList[i],
                        vehicleId: AppConstants.CURRENT_VEHICLE_ID,
                        id: AppConstants.CURRENT_EDIT_FILL_ID,
                        fillDate:currentVehicle.serviceList[i].fillDate.toLocaleString(),
                    })
                }
            }
        } else {
           
            AppConstants.TEMPDATA_SERVICE_MAINTAIN_MODULES = {};
            this.setState({
                vehicleId: AppConstants.CURRENT_VEHICLE_ID
            })
        }
    }
    
    save = async (newVehicle) => {
        console.log(this.state)

        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) {
            console.log("WIll Edit FillOil:")
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)
            }
            console.log(newData)

            this.props.actVehicleEditFillItem(newData, AppConstants.FILL_ITEM_SERVICE, this.props.userData)
            this.props.navigation.goBack()
        } else {
            console.log("WIll Save Car Authorize:")
            let newData = {
                ...this.state,
                
                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)
            }
            // let maxId = 0;
            // this.props.userData.serviceList.forEach(item => {
            //     if (maxId < item.id) {
            //         maxId = item.id
            //     }
            // })
            newData.id = apputils.uuidv4();
            console.log(newData)

            this.props.actVehicleAddFillItem(newData, AppConstants.FILL_ITEM_SERVICE, this.props.userData)

            this.props.navigation.navigate('VehicleDetail')
        }
    }

    setMaintainType(value, index) {
        console.log("setMaintainType validForIndex:" + index)
        this.setState({
            validForIndex: index,
            validFor: value
        })
    }
    combineMaintainType(settingService) {
        let result = [];
        console.log(" combine MainTain Type:")
        if (settingService) {
            if (settingService.Km && settingService.Km.length > 0 &&
                    settingService.Month && settingService.Month.length > 0) {
                settingService.Km.forEach((item, idx) => {
                    result.push({
                        text: settingService.Km[idx]+"Km ("+AppLocales.t("GENERAL_OR")+" "+
                         settingService.Month[idx]+" "+AppLocales.t("GENERAL_MONTH") +")",
                        kmValue: settingService.Km[idx],
                        index: idx
                    })
                })
                
            }
            
        }
        return result; 
    }

    // called by ServiceScreenModules to re-render after go Back
    onUpdateMaintainModules(values) {
        console.log("OK from CHILD calleddddddddddddddddddddddddddd")
        console.log(values)
        this.setState({
            serviceModule: values
        })
    }
    removeMaintainModule(value) {
        console.log(" remove Maintain Module calledddd")
        console.log(value)
        console.log(this.state.serviceModule[""+value])
        if (this.state.serviceModule[""+value]) {
            let prevList = this.state.serviceModule;
            delete prevList[""+value];

            this.setState({
                serviceModule: prevList
            })
        }
    }
    render() {
        let theDate = new Date(this.state.fillDate);
        let today = new Date();
        if (today.getFullYear() == theDate.getFullYear && today.getMonth() == theDate.getMonth() &&
                today.getDate() == theDate.getDate()) {
            var datePlaceHoder = AppLocales.t("GENERAL_TODAY")+"(" + apputils.formatDateMonthDayYearVNShort(theDate) + ")";
        } else {
            var datePlaceHoder = apputils.formatDateMonthDayYearVNShort(theDate);
        }
        let maintainTypeArr = this.combineMaintainType(this.props.userData.settingService)
        console.log("            PayServiceScreen render")
        console.log(AppConstants.TEMPDATA_SERVICE_MAINTAIN_MODULES)

        let viewServiceModule = [];
        for (let prop in this.state.serviceModule) {
            // Because these two Obj share same prop, so set in 1 for loop
            if (Object.prototype.hasOwnProperty.call(this.state.serviceModule, prop) && 
                    Object.prototype.hasOwnProperty.call(this.state.serviceModule, prop)) {

                let item = this.state.serviceModule[""+prop];
                viewServiceModule.push(
                    <ListItem key={prop+""+item} style={{flexDirection:"row", justifyContent: "space-between"}}>
                        <Text>{prop+":" + item}</Text>
                        <TouchableOpacity 
                                onPress={() => this.removeMaintainModule(prop)}>
                            <Icon type="FontAwesome" name="remove" style={{fontSize: 17, color: "grey"}} />
                        </TouchableOpacity>
                    </ListItem>
                )
            }
        }

        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Picker
                            style={{width: (Layout.window.width-40)*0.9, borderColor: "#1f77b4",borderWidth: 0.3,
                                alignSelf:"center"}}
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder={"--"+AppLocales.t("NEW_GAS_CAR")+"--"}
                            placeholderStyle={{ color: "#bfc6ea", alignSelf:"center" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.vehicleId}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({vehicleId: itemValue})
                            }
                        >
                            {this.props.userData.vehicleList.map(item => (
                                <Picker.Item label={item.brand + " " + item.model + " " + item.licensePlate}
                                    value={item.id} key={item.id}/>
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_FILLDATE")+": "}</Label>
                        <View style={styles.rowForm}>
                        <DatePicker
                            defaultDate={theDate}
                            minimumDate={new Date(2010, 1, 1)}
                            maximumDate={new Date(2100, 12, 31)}
                            locale={"vi"}
                            timeZoneOffsetInMinutes={undefined}
                            modalTransparent={false}
                            animationType={"fade"}
                            androidMode={"default"}
                            placeHolderText={datePlaceHoder}
                            textStyle={{ color: AppConstants.COLOR_PICKER_TEXT }}
                            placeHolderTextStyle={{ color: AppConstants.COLOR_PICKER_TEXT }}
                            onDateChange={(fillDate) => this.setState({fillDate})}
                            disabled={false}
                            iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        />
                        </View>
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                    <View style={styles.rowForm}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label>{AppLocales.t("NEW_SERVICE_TYPE")+": "}</Label>
                            <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
                            <Text style={styles.smallerText}>{AppLocales.t("NEW_SERVICE_MAINTAIN")+""}</Text>
                            <CheckBox checked={this.state.isConstantFix != true} 
                                onPress={() =>this.setState({isConstantFix: false})}/>
                            
                            <Text style={styles.smallerText}>{"          " + AppLocales.t("NEW_SERVICE_CONSANTFIX")+""}</Text>
                            <CheckBox checked={this.state.isConstantFix == true} 
                                onPress={() =>this.setState({isConstantFix: true})}/>
                            </View>
                        </Item>
                        </View>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <View style={styles.rowForm}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label>{AppLocales.t("NEW_SERVICE_MAINTAIN_TYPE")}</Label>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: (Layout.window.width-40)*0.9,
                                    alignSelf:"center"}}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.validFor}
                                onValueChange={(itemValue, itemIndex) =>
                                   this.setMaintainType(itemValue, itemIndex)
                                }
                            >
                                { maintainTypeArr.map((item, idx) => (
                                    <Picker.Item label={""+item.text} value={item.kmValue} key={idx}/>
                                ))}
                            </Picker>
                        </Item>
                        </View>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_PRICE")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(price) => this.setState({price})}
                            value={""+this.state.price}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_CURRENTKM")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(currentKm) => this.setState({currentKm})}
                            value={""+this.state.currentKm}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={styles.rowForm}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <View style={{flexDirection:"row"}}>
                                <Label>{AppLocales.t("NEW_SERVICE_MODULES")}</Label>
                                <Button transparent small
                                    onPress={() => {this.props.navigation.navigate("ServiceModules", {onOk: this.onUpdateMaintainModules})
                                }}>
                                    <Text>{AppLocales.t("MAINTAIN_ADD_MODULE")}</Text>
                                    <Icon type="Entypo" name="plus" style={{fontSize: 14}}/>
                                </Button>
                            </View>
                            <View style={{width: (Layout.window.width-40)*0.6}}>
                                {viewServiceModule}
                            </View>
                        </Item>
                        </View>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_REMARK")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(remark) => this.setState({remark})}
                            value={this.state.remark}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.save(this.state)}
                    ><Text>{AppLocales.t("GENERAL_ADDDATA")}</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

PayServiceScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("NEW_SERVICE_HEADER")}</HeaderText></Title>
          </Body>
          <Right />
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    justifyContent: "center",
    //height: 54,
    width: "90%",
    alignSelf:"center"
    
  },
  rowLabel: {
    flex: 1,
    textAlign: "right",
    paddingRight: 5,
    color: "rgb(120, 120, 120)"
  },
  rowForm: {
    flex: 2,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  },
  smallerText: {
      fontSize: 13
  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actVehicleAddFillItem,
    actVehicleEditFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(PayServiceScreen);
