import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AppContants from '../constants/AppConstants'
import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, 
    Card, CardItem, Picker, Form, Item, CheckBox } from 'native-base';
import { connect } from 'react-redux';
import {actVehicleAddVehicle, actVehicleEditVehicle} from '../redux/UserReducer'
import Layout from '../constants/Layout';
import apputils from '../constants/AppUtils';

class RegisterVehicleScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 1, // increment
            brand: '',
            model: '',
            licensePlate: '',
            checkedDate: new Date().toLocaleDateString(),
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
        console.log("CURRENTVEHICLE:" + AppContants.CURRENT_VEHICLE_ID)
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_VEHICLE_ID) {
            for (let i = 0; i < this.props.userData.vehicleList.length; i++) {
                if (this.props.userData.vehicleList[i].id == AppContants.CURRENT_VEHICLE_ID) {
                    this.setState({
                        id: AppContants.CURRENT_VEHICLE_ID,
                        brand:this.props.userData.vehicleList[i].brand,
                        model: this.props.userData.vehicleList[i].model,
                        licensePlate: this.props.userData.vehicleList[i].licensePlate,
                        checkedDate: this.props.userData.vehicleList[i].checkedDate,
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
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_VEHICLE_ID) {
            console.log("WIll Edit:")
            console.log(JSON.stringify(newVehicle))
            this.props.actVehicleEditVehicle(newVehicle)
            this.props.navigation.navigate("Home")
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
            this.props.navigation.navigate("Home")
        }
    }

    getBrandsList(data) {
        let result = [{ id: 0,name: "-Select Brand-"}];
        for (let i = 0; i < data.length; i++) {
            result.push({id: data[i].id, name: data[i].name})
        }
        return result;
    }
    getModelsOfBrand(brandNameOrId, data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == brandNameOrId || data[i].name == brandNameOrId) {
                let result = [...data[i].models];
                result.unshift({ id: 0,name: "-Select Model-"});
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
                        <Text style={styles.rowLabel}>
                            Brand:
                        </Text>
                        <Item regular>
                        <Picker
                            mode="dropdown"
                            style={{width: (Layout.window.width-40)*0.6}}
                            placeholder="Select Brand"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.brand}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({brand: itemValue})
                            }
                        >
                            {this.getBrandsList(AppContants.DATA_BRAND_MODEL).map(item => (
                                <Picker.Item label={item.name} value={item.name} key={item.id}/>
                            ))}
                        </Picker>
                        </Item>

                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Model:
                        </Text>
                        <Item regular>
                        <Picker
                            mode="dropdown"
                            style={{width: (Layout.window.width-40)*0.6}}
                            placeholder="Select Model"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.model}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({model: itemValue})
                            }
                        >
                            {this.getModelsOfBrand(this.state.brand, AppContants.DATA_BRAND_MODEL).map(item => (
                                <Picker.Item label={item.name} value={item.name} key={item.name}/>
                            ))}
                        </Picker>
                        </Item>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            License Plate:
                        </Text>
                        <TextInput
                            style={styles.rowForm}
                            placeholder="Number Plate"
                            onChangeText={(licensePlate) => this.setState({licensePlate})}
                            value={this.state.licensePlate}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Last Checked Date:
                        </Text>
                        <TextInput
                            style={styles.rowForm}
                            placeholder="TODO for DatePicker"
                            onChangeText={(checkedDate) => this.setState({checkedDate})}
                            value={this.state.checkedDate}
                        />
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={styles.rowLabel}>
                            <CheckBox checked={this.state.isDefault}  color="green"
                                onPress={this.handleToggleCheckDefault}
                                style={{marginRight: 10}}/>
                        </View>
                        <View style={styles.rowForm}>
                           <Text>Mặc Định</Text>
                        </View>
                    </View>

                    

                    <View style={styles.rowButton}>
                    <Button
                        style={styles.btnSubmit}
                        onPress={() => this.save(this.state)}
                    ><Text>{((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_VEHICLE_ID) ? "Sửa Đổi" : "Tạo Mới" }</Text></Button>
                    </View>
                </View>
                </Content>
            </Container>
        );
    }
}

RegisterVehicleScreen.navigationOptions = ({ navigation }) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Thông Tin Xe</Title>
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
    height: 50,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowLabel: {
    flex: 2,
    textAlign: "right",
    paddingRight: 5,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  rowForm: {
    flex: 3,
    flexDirection: "row"
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

