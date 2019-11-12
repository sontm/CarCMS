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
            //: new Date().toLocaleDateString(),
            isDefault: false,
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
            for (let i = 0; i < this.props.userData.vehicleList.length; i++) {
                if (this.props.userData.vehicleList[i].id == AppConstants.CURRENT_VEHICLE_ID) {
                    this.setState({
                        id: AppConstants.CURRENT_VEHICLE_ID,
                        brand:this.props.userData.vehicleList[i].brand,
                        model: this.props.userData.vehicleList[i].model,
                        licensePlate: this.props.userData.vehicleList[i].licensePlate,
                        //checkedDate: this.props.userData.vehicleList[i].checkedDate,
                        isDefault: this.props.userData.vehicleList[i].isDefault
                    })
                }
            }
        } else {
            // In case this is the First Car, Set it to Default
            if (!this.props.userData.vehicleList || this.props.userData.vehicleList.length < 1) {
                this.setState({
                    isDefault: true
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
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) {
            console.log("WIll Edit:")
            console.log(JSON.stringify(newVehicle))
            this.props.actVehicleEditVehicle(newVehicle)
            this.props.navigation.navigate("MyVehicle")
        } else {
            console.log("WIll Save:")
            // let maxId = 0;
            // this.props.userData.vehicleList.forEach(item => {
            //     if (maxId < item.id) {
            //         maxId = item.id
            //     }
            // })
            newVehicle.id = apputils.uuidv4();
            console.log(JSON.stringify(newVehicle))
            this.props.actVehicleAddVehicle(newVehicle)
            this.props.navigation.navigate("MyVehicle")
        }
    }

    getBrandsList(data) {
        //let result = [{ id: 0,name: "-"+AppLocales.t("NEW_CAR_BRAND")+"-"}];
        let result = [];
        for (let i = 0; i < data.length; i++) {
            result.push({id: data[i].id, name: data[i].name})
        }
        return result;
    }
    getModelsOfBrand(brandNameOrId, data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == brandNameOrId || data[i].name == brandNameOrId) {
                let result = [...data[i].models];
                //result.unshift({ id: 0,name: "-"+AppLocales.t("NEW_CAR_MODEL")+"-"});
                return result;
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
                        {/* <Text style={styles.rowLabel}>
                            {AppLocales.t("NEW_CAR_BRAND")}:
                        </Text> */}
                        {/* <Item regular> */}
                        <Item picker>
                            <Label>{AppLocales.t("NEW_CAR_BRAND")+": "}</Label>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: (Layout.window.width-40)*0.7}}
                                placeholder={"--"+AppLocales.t("NEW_CAR_BRAND")+"--"}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.brand}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({brand: itemValue})
                                }
                            >
                                {this.getBrandsList(AppConstants.DATA_BRAND_MODEL).map(item => (
                                    <Picker.Item label={item.name} value={item.name} key={item.id}/>
                                ))}
                            </Picker>
                        </Item>
                        {/* </Item> */}

                    </View>
                    <View style={styles.rowContainer}>
                        {/* <Text style={styles.rowLabel}>
                        {AppLocales.t("NEW_CAR_MODEL")}:
                        </Text> */}
                        <Item picker>
                            <Label>{AppLocales.t("NEW_CAR_MODEL")+": "}</Label>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: (Layout.window.width-40)*0.7}}
                                placeholder={"--"+AppLocales.t("NEW_CAR_MODEL")+"--"}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.model}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({model: itemValue})
                                }
                            >
                                {this.getModelsOfBrand(this.state.brand, AppConstants.DATA_BRAND_MODEL).map(item => (
                                    <Picker.Item label={item.name} value={item.name} key={item.name}/>
                                ))}
                            </Picker>
                        </Item>
                    </View>
                    <View style={styles.rowContainer}>
                        <Item inlineLabel>
                            <Label>{AppLocales.t("NEW_CAR_PLATE")+": "}</Label>
                            <Input 
                                onChangeText={(licensePlate) => this.setState({licensePlate})}
                                value={this.state.licensePlate}
                            />
                        </Item>
                        {/* <Text style={styles.rowLabel}>
                        {AppLocales.t("NEW_CAR_PLATE")}:
                        </Text>
                        <TextInput
                            style={styles.rowFormTextInput}
                            placeholder="Number Plate"
                            onChangeText={(licensePlate) => this.setState({licensePlate})}
                            value={this.state.licensePlate}
                        /> */}
                    </View>
  

                    <View style={styles.rowContainer}>
                        <View style={styles.rowLabel}>
                            <CheckBox checked={this.state.isDefault}  color={AppConstants.COLOR_D3_DARK_GREEN}
                                onPress={this.handleToggleCheckDefault}
                                style={{marginRight: 10}}/>
                        </View>
                        <View style={styles.rowFormNoBorder}>
                           <Text>{AppLocales.t("GENERAL_DEFAULT")}</Text>
                        </View>
                    </View>

                    

                    <View style={styles.rowButton}>
                    <Button
                        style={styles.btnSubmit}
                        onPress={() => this.save(this.state)}
                    ><Text>{((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) ? "Sửa Đổi" : "Tạo Mới" }</Text></Button>
                    </View>
                </View>
                </Content>
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
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignSelf:"center",
    alignItems: "center", // vertial align
    height: 60,
    width: "90%"
    // borderBottomColor: "rgb(230, 230, 230)",
    // borderBottomWidth: 0.5
  },
  rowLabel: {
    flex: 2,
    textAlign: "right",
    paddingRight: 5,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  rowFormNoBorder: {
    flex: 3,
    flexDirection: "row"
  },
  rowForm: {
    flex: 3,
    flexDirection: "row",
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
    actVehicleAddVehicle, actVehicleEditVehicle
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(RegisterVehicleScreen);

