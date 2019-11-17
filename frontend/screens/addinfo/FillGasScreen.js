import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AppConstants from '../../constants/AppConstants'
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input, 
    Label, DatePicker } from 'native-base';
    import {HeaderText} from '../../components/StyledText'
import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import Layout from '../../constants/Layout';

class FillGasScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            id: 0, // increment
            vehicleId: 0,
            fillDate: new Date().toLocaleString(),
            amount: "",
            price: "",
            currentKm: "",
            type: "gas",
            subType: "",
            remark: "",
        };

        this.save = this.save.bind(this)
    }
    componentWillMount() {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && 
                AppConstants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            const currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);

            for (let i = 0; i < currentVehicle.fillGasList.length; i++) {
                if (currentVehicle.fillGasList[i].id == AppConstants.CURRENT_EDIT_FILL_ID) {
                    this.setState({
                        ...currentVehicle.fillGasList[i],
                        vehicleId: AppConstants.CURRENT_VEHICLE_ID,
                        id: AppConstants.CURRENT_EDIT_FILL_ID,
                        fillDate:currentVehicle.fillGasList[i].fillDate,
                    })
                }
            }
        } else {
            this.setState({
                vehicleId: AppConstants.CURRENT_VEHICLE_ID
            })
        }
        
    }

    save(newVehicle) {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) {
            console.log("WIll Edit FillGas:")
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                amount: Number(this.state.amount),
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)
            }

            this.props.actVehicleEditFillItem(newData, AppConstants.FILL_ITEM_GAS)
            this.props.navigation.goBack()
        } else {
            console.log("WIll Save Fill Gas:")
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                amount: Number(this.state.amount),
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)
            }

            newData.id = apputils.uuidv4();
            console.log(JSON.stringify(newData))
            this.props.actVehicleAddFillItem(newData, AppConstants.FILL_ITEM_GAS)

            this.props.navigation.navigate('VehicleDetail')
        }
    }

    render() {
        console.log("FIll Gas State of ID:" + AppConstants.CURRENT_VEHICLE_ID)
        let theDate = new Date(this.state.fillDate);
        let today = new Date();
        if (today.getFullYear() == theDate.getFullYear && today.getMonth() == theDate.getMonth() &&
                today.getDate() == theDate.getDate()) {
            var datePlaceHoder = AppLocales.t("GENERAL_TODAY")+"(" + apputils.formatDateMonthDayYearVNShort(theDate) + ")";
        } else {
            var datePlaceHoder = apputils.formatDateMonthDayYearVNShort(theDate);
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
                {/* <View style={styles.rowContainer}>
                    <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                    <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_AMOUNT")+": "}</Label>
                    <Input
                        style={styles.rowForm}
                        keyboardType="numeric"
                        onChangeText={(amount) => this.setState({amount})}
                        value={""+this.state.amount}
                    />
                    </Item>
                </View> */}

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

FillGasScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("NEW_GAS_HEADER")}</HeaderText></Title>
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
    // borderWidth: 1,
    // borderColor:"grey"
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
)(FillGasScreen);
