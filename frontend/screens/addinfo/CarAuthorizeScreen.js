import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, 
    Input,  Label, DatePicker, Card, CardItem } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import AppContants from '../../constants/AppConstants'

import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import Layout from '../../constants/Layout';

class CarAuthorizeScreen extends React.Component {
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
            type: "auth",
            subType: "",
            remark: "",
            validFor:"", // i.e Each Auth in 1 year
        };

        this.save = this.save.bind(this)
    }

    componentWillMount() {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            const currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppContants.CURRENT_VEHICLE_ID);
            for (let i = 0; i < currentVehicle.authorizeCarList.length; i++) {
                if (currentVehicle.authorizeCarList[i].id == AppContants.CURRENT_EDIT_FILL_ID) {
                    this.setState({
                        ...currentVehicle.authorizeCarList[i],
                        vehicleId: AppContants.CURRENT_VEHICLE_ID,
                        id: AppContants.CURRENT_EDIT_FILL_ID,
                        fillDate:currentVehicle.authorizeCarList[i].fillDate.toLocaleString(),
                    })
                }
            }
        } else {
            this.setState({
                vehicleId: AppContants.CURRENT_VEHICLE_ID
            })
        }
    }
    
    save = async (newVehicle) => {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_VEHICLE_ID) {
            console.log("WIll Edit FillOil:")
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm),
                validFor: Number(this.state.validFor)
            }

            this.props.actVehicleEditFillItem(newData, AppContants.FILL_ITEM_AUTH)
            this.props.navigation.goBack()
        } else {
            console.log("WIll Save Car Authorize:")
            let newData = {
                ...this.state,
                
                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm),
                validFor: Number(this.state.validFor)
            }
            // let maxId = 0;
            // this.props.userData.authorizeCarList.forEach(item => {
            //     if (maxId < item.id) {
            //         maxId = item.id
            //     }
            // })
            newData.id = apputils.uuidv4();
            
            console.log(newData)

            this.props.actVehicleAddFillItem(newData, AppContants.FILL_ITEM_AUTH)

            this.props.navigation.navigate('VehicleDetail')
        }
    }

    render() {
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
                            defaultDate={new Date()}
                            minimumDate={new Date(2010, 1, 1)}
                            maximumDate={new Date(2100, 12, 31)}
                            locale={"vi"}
                            timeZoneOffsetInMinutes={undefined}
                            modalTransparent={false}
                            animationType={"fade"}
                            androidMode={"default"}
                            placeHolderText={AppLocales.t("GENERAL_TODAY")+"(" + apputils.formatDateMonthDayYearVNShort(new Date()) + ")"}
                            textStyle={{ color: "#1f77b4" }}
                            placeHolderTextStyle={{ color: "#1f77b4" }}
                            onDateChange={(fillDate) => this.setState({fillDate})}
                            disabled={false}
                            iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        />
                        </View>
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                        {AppLocales.t("NEW_AUTH_TYPE")+":"}
                        </Text>
                        <View style={styles.rowForm}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: (Layout.window.width-40)*0.6,
                                    alignSelf:"center"}}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.subType}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({subType: itemValue})
                                }
                            >
                                {AppContants.DATA_AUTH_TYPE.map(item => (
                                    <Picker.Item label={item.name} value={item.name} key={item.id}/>
                                ))}
                            </Picker>
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
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_AUTH_VALIDFOR")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(validFor) => this.setState({validFor})}
                            value={""+this.state.validFor}
                        />
                        </Item>
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
                    ><Text>
                    {((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_VEHICLE_ID) ? 
                        AppLocales.t("GENERAL_EDITDATA") : 
                        AppLocales.t("GENERAL_ADDDATA")}
                    </Text></Button>
                    </View>

                    <View style={styles.rowNote}>
                        <Card>
                            <CardItem>
                            <Body style={{flexDirection:"row", justifyContent:"center"}}>
                                <Text>
                                {AppLocales.t("NOTE_VALIDFOR_OIL")}
                                </Text>
                            </Body>
                            </CardItem>
                        </Card>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

CarAuthorizeScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{AppLocales.t("NEW_AUTH_HEADER")}</Title>
          </Body>
          <Right />
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 7,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    justifyContent: "center",
    height: 50,
    width: "96%",
    alignSelf:"center"
  },
  rowLabel: {
    flex: 2,
    textAlign: "right",
    paddingRight: 5,
    color: "rgb(120, 120, 120)",
    fontSize: 15
  },
  rowForm: {
    flex: 3,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  rowNote: {
    marginTop: 20,
    alignSelf:"center",
    width: "96%",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actVehicleAddFillItem,
    actVehicleEditFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(CarAuthorizeScreen);
