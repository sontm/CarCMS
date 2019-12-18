import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AppConstants from '../constants/AppConstants'
import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, 
    Card, CardItem, Picker, Form, Item, CheckBox, Label, Input } from 'native-base';
import { connect } from 'react-redux';
import {actVehicleAddVehicle, actVehicleEditVehicle} from '../redux/UserReducer'
import Layout from '../constants/Layout';
import apputils from '../constants/AppUtils';
import AppLocales from '../constants/i18n';
import {HeaderText} from '../components/StyledText'

class RegisterVehicleScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 1, // increment
            brand: '',
            model: '',
            licensePlate: '',
            type: 'car', // car or bike
            //: new Date().toLocaleDateString(),
            isDefault: false,
            maxMeter: 0,
            fillGasList:[],
            fillOilList:[],
            authorizeCarList:[],
            expenseList:[],
            serviceList:[]
        };

        this.save = this.save.bind(this)
        this.handleToggleCheckDefault = this.handleToggleCheckDefault.bind(this)
    }

    componentWillMount() {
        console.log("CURRENTVEHICLE:" + AppConstants.CURRENT_VEHICLE_ID)
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) {
            // Edit Information
            for (let i = 0; i < this.props.userData.vehicleList.length; i++) {
                if (this.props.userData.vehicleList[i].id == AppConstants.CURRENT_VEHICLE_ID) {
                    this.setState({
                        id: AppConstants.CURRENT_VEHICLE_ID,
                        brand:this.props.userData.vehicleList[i].brand,
                        model: this.props.userData.vehicleList[i].model,
                        licensePlate: this.props.userData.vehicleList[i].licensePlate,
                        type: this.props.userData.vehicleList[i].type ? this.props.userData.vehicleList[i].type : "car",
                        maxMeter: this.props.userData.vehicleList[i].maxMeter
                        //checkedDate: this.props.userData.vehicleList[i].checkedDate,
                        //isDefault: this.props.userData.vehicleList[i].isDefault
                    })
                }
            }
        } else {
            // In case this is the First Car, Set it to Default
            // if (!this.props.userData.vehicleList || this.props.userData.vehicleList.length < 1) {
            //     this.setState({
            //         isDefault: true
            //     })
            // }
            // Set to the First Car in List
            if (this.props.appData.carModels && this.props.appData.carModels.length > 0) {
            this.setState({
                brand: this.props.appData.carModels[0].name
            })
            }
        }
    }
    handleToggleCheckDefault(e) {
        console.log("handleToggleCheckDefault:")
        console.log(e)
        this.setState({
            isDefault: !this.state.isDefault
        })
    }
    save(newVehicle) {
        if (!this.state.licensePlate) {
            Toast.show({
                text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                //buttonText: "Okay",
                type: "danger"
            })
        } else {
            if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) {
                console.log("WIll Edit:")
                // Only Set some Information. IFNOT, fillGasList will LOSt
                newVehicle = {
                    id: this.state.id,
                    brand:this.state.brand,
                    model: this.state.model,
                    licensePlate: this.state.licensePlate,
                    type: this.state.type ? this.state.type : "car",
                    isDefault: this.state.isDefault
                }

                console.log(JSON.stringify(newVehicle))
                this.props.actVehicleEditVehicle(newVehicle, this.props.userData)
                this.props.navigation.navigate("MyVehicle")
            } else {
                console.log("WIll Save:")
                console.log(this.state)
                // let maxId = 0;
                // this.props.userData.vehicleList.forEach(item => {
                //     if (maxId < item.id) {
                //         maxId = item.id
                //     }
                // })

                newVehicle.id = apputils.uuidv4();
                console.log(JSON.stringify(newVehicle))
                this.props.actVehicleAddVehicle(newVehicle, this.props.userData)
                this.props.navigation.navigate("MyVehicle")
            }
        }
    }

    getBrandsList(data) {
        //let result = [{ id: 0,name: "-"+AppLocales.t("NEW_CAR_BRAND")+"-"}];
        let result = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].type==this.state.type) {
                result.push({id: data[i].id, name: data[i].name})
            }
        }
        return result;
    }
    getModelsOfBrand(brandNameOrId, data) {
        for (let i = 0; i < data.length; i++) {
            if ( this.state.type == "bike" ) {
                if (data[i].type == "bike" && (data[i].id == brandNameOrId || data[i].name == brandNameOrId)) {
                    let result = [...data[i].models];
                    //result.unshift({ id: 0,name: "-"+AppLocales.t("NEW_CAR_MODEL")+"-"});
                    return result;
                }
            } else {
                if (data[i].type == "car" && (data[i].id == brandNameOrId || data[i].name == brandNameOrId)) {
                    let result = [...data[i].models];
                    //result.unshift({ id: 0,name: "-"+AppLocales.t("NEW_CAR_MODEL")+"-"});
                    return result;
                }
            }
        }
        return [{ id: 0,name: "N/A"}];
    }
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                                <Label>{AppLocales.t("NEW_CAR_TYPE")}</Label>
                            </View>
                            <View style={{...styles.rowFormNoBorder, marginTop: 10}}>
                            <CheckBox checked={this.state.type == "car"} 
                                onPress={() =>this.setState({type: "car"})}/>
                            <Text onPress={() =>this.setState({type: "car"})}>{"    " + AppLocales.t("GENERAL_CAR")+""}</Text>
                            
                            <CheckBox style={{marginLeft: 20}} checked={this.state.type == "bike"} 
                                onPress={() =>this.setState({type: "bike"})}/>
                            <Text onPress={() =>this.setState({type: "bike"})}>{"    " + AppLocales.t("GENERAL_BIKE")+""}</Text>
                            
                            </View>
                        </Item>
                    </View>


                    <View style={styles.rowContainer}>
                        {/* <Item regular> */}
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label>{AppLocales.t("NEW_CAR_BRAND")}</Label>
                            <View style={styles.rowForm}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: AppConstants.DEFAULT_FORM_WIDTH}}
                                placeholder={"--"+AppLocales.t("NEW_CAR_BRAND")+"--"}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.brand}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({brand: itemValue})
                                }
                            >
                                {this.getBrandsList(this.props.appData.carModels).map(item => (
                                    <Picker.Item label={item.name} value={item.name} key={item.id}/>
                                ))}
                            </Picker>
                            </View>
                        </Item>
                        {/* </Item> */}

                    </View>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label>{AppLocales.t("NEW_CAR_MODEL")}</Label>
                            <View style={styles.rowForm}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: AppConstants.DEFAULT_FORM_WIDTH}}
                                placeholder={"--"+AppLocales.t("NEW_CAR_MODEL")+"--"}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.model}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({model: itemValue})
                                }
                            >
                                {this.getModelsOfBrand(this.state.brand, this.props.appData.carModels).map(item => (
                                    <Picker.Item label={item.name} value={item.name} key={item.name}/>
                                ))}
                            </Picker>
                            </View>
                        </Item>
                    </View>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                                <Label>{AppLocales.t("NEW_CAR_PLATE")}</Label>
                                {!this.state.licensePlate ?
                                <Label style={{color: "red"}}>*</Label>
                                : null}
                            </View>
                            <Input 
                                style={styles.rowForm}
                                onChangeText={(licensePlate) => this.setState({licensePlate})}
                                value={this.state.licensePlate}
                            />
                        </Item>
                    </View>

                    {this.state.maxMeter > 0 ?
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label>
                            {AppLocales.t("ADD_MAX_METER_LBL")}
                        </Label>
                        <Text style={{fontStyle: "italic", fontSize: 14, color: AppConstants.COLOR_TEXT_DARKEST_INFO, alignSelf: "flex-start"}}>
                            {(this.state.maxMeter>0) ? 
                            "(Xe đã qua vòng Công tơ mét "+ this.state.maxMeter + "Km)" : null}
                        </Text>
                        <Input
                            onChangeText={(maxMeter) => this.setState({maxMeter})}
                            value={""+this.state.maxMeter}
                            keyboardType="numeric"
                        />
                        </Item>
                    </View> : null}
  

                    {/* <View style={styles.rowContainer}>
                        <View style={styles.rowLabel}>
                            <CheckBox checked={this.state.isDefault}  color={AppConstants.COLOR_D3_DARK_GREEN}
                                onPress={this.handleToggleCheckDefault}
                                style={{marginRight: 10}}/>
                        </View>
                        <View style={styles.rowFormNoBorder}>
                           <Text>{AppLocales.t("GENERAL_DEFAULT")}</Text>
                        </View>
                    </View>
                     */}
                </View>
                </Content>
                <View style={styles.rowButton}>
                    <Button rounded
                        style={styles.btnSubmit}
                        onPress={() => this.save(this.state)}
                    ><Text>{((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) ? "Sửa Đổi" : "Tạo Mới" }</Text></Button>
                </View>
            </Container>
        );
    }
}

RegisterVehicleScreen.navigationOptions = ({ navigation }) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>Thông Tin Xe</HeaderText></Title>
          </Body>
          <Right />
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: AppConstants.DEFAULT_FORM_PADDING_HORIZON,
    backgroundColor: "rgba(0,0,0,0)",
    flexDirection: "column",
    paddingBottom: 50
  },
  rowContainer: {
    flexDirection: "row",
    alignSelf:"center",
    alignItems: "center", // vertial align
    //height: 60,
    width: AppConstants.DEFAULT_FORM_WIDTH,
    marginTop: 15
  },

  rowFormNoBorder: {
    flexDirection: "row",
    width: AppConstants.DEFAULT_FORM_WIDTH,
  },
  rowForm: {
    flexDirection: "row",
    borderBottomColor: "rgb(210, 210, 210)",
    borderBottomWidth: 0.5,
    width: AppConstants.DEFAULT_FORM_WIDTH,
  },
  
  rowButton: {
    alignItems: "center",
    alignSelf: "center",
    position: 'absolute',
    justifyContent: "center",
    bottom: 3,
    left: 0,
    right: 0,
  },
  btnSubmit: {
    width: AppConstants.DEFAULT_FORM_BUTTON_WIDTH,
    backgroundColor: AppConstants.COLOR_BUTTON_BG,
    justifyContent: "center",
  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actVehicleAddVehicle, actVehicleEditVehicle
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(RegisterVehicleScreen);

