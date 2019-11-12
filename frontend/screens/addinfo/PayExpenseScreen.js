import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input,Label, DatePicker } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import AppContants from '../../constants/AppConstants'
import Layout from '../../constants/Layout';

import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import AppConstants from '../../constants/AppConstants';
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';

class PayExpenseScreen extends React.Component {
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
            type: "expense",
            subType: "",
            remark: "",
        };
        this.save = this.save.bind(this)
    }

    componentWillMount() {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            const currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
            for (let i = 0; i < currentVehicle.expenseList.length; i++) {
                if (currentVehicle.expenseList[i].id == AppContants.CURRENT_EDIT_FILL_ID) {
                    this.setState({
                        ...currentVehicle.expenseList[i],
                        vehicleId: AppContants.CURRENT_VEHICLE_ID,
                        id: AppContants.CURRENT_EDIT_FILL_ID,
                        fillDate:currentVehicle.expenseList[i].fillDate.toLocaleString(),
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
            console.log("WIll Edit Expense:")
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price)
            }

            this.props.actVehicleEditFillItem(newData, AppContants.FILL_ITEM_EXPENSE)
            this.props.navigation.goBack()
        } else {
            console.log("WIll Save Expense:")
            let newData = {
                ...this.state,
                
                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price)
            }
            
            // let maxId = 0;
            // this.props.userData.expenseList.forEach(item => {
            //     if (maxId < item.id) {
            //         maxId = item.id
            //     }
            // })
            newData.id = apputils.uuidv4();
            console.log(newData)
            this.props.actVehicleAddFillItem(newData, AppConstants.FILL_ITEM_EXPENSE)

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
                        <Text style={styles.rowLabel}>
                        {AppLocales.t("NEW_EXPENSE_TYPE")+":"}
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
                                {AppContants.DATA_EXPENSE_TYPE.map(item => (
                                    <Picker.Item label={item.name} value={item.name} key={item.id}/>
                                ))}
                            </Picker>
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

PayExpenseScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{AppLocales.t("NEW_EXPENSE_HEADER")}</Title>
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
    height: 54,
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
)(PayExpenseScreen);
