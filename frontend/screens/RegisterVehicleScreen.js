import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AppContants from '../constants/AppConstants'
import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Picker, Form, Item } from 'native-base';

const DATA_BRAND_MODEL = [
    { id: 1,name: "Toyota", models: [{id:1, name: "Vios"},{id:2, name: "Hilux"},{id:3, name: "Yaris"},{id:4, name: "Camry"}]},
    { id: 2,name: "Madza", models: [{id:5, name: "X3"},{id:6, name: "X4"},{id:7, name: "X5"},{id:8, name: "CX5"}]},
    { id: 3,name: "Honda", models: [{id:9, name: "CRV"},{id:10, name: "City"}]},
    { id: 4,name: "Nissan", models: [{id:11, name: "X-Trail"},{id:12, name: "Sunny"},{id:13, name: "Surge"}]},
    { id: 5,name: "Kia", models: [{id:14, name: "Morning"},{id:15, name: "K3"},{id:16, name: "Cerato"},{id:17, name: "Sorento"}]},
    { id: 6,name: "Huyndai", models: [{id:18, name: "i10"},{id:19, name: "New i10"},{id:20, name: "Accent"},{id:21, name: "Elanta"}]},
];

class RegisterVehicleScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //id: 1, // increment
            brand: '',
            model: '',
            licensePlate: '',
            checkedDate: new Date().toLocaleDateString()
        };

        this.save = this.save.bind(this)
    }

    componentWillMount() {
        this.load()
    }
    load = async () => {
        try {
            const vehicle = await AsyncStorage.getItem(AppContants.STORAGE_VEHICLE_LIST)
            console.log("VehicleList:")
            console.log(JSON.parse(vehicle))
        } catch (e) {
            console.error('Failed to load vehicleList from AsyncStorage.')
            console.log(e)
        }
    }
    save = async (newVehicle) => {
        try {
            console.log("WIll Save:")
            console.log(JSON.stringify(newVehicle))

            const prevVehiclesStorage = await AsyncStorage.getItem(AppContants.STORAGE_VEHICLE_LIST)
            let prevVehicles = JSON.parse(prevVehiclesStorage)
            if (!prevVehicles) {
                prevVehicles = [];
            }
            newVehicle.id = prevVehicles.length + 1;
            prevVehicles.push(newVehicle)
            await AsyncStorage.setItem(AppContants.STORAGE_VEHICLE_LIST, JSON.stringify(prevVehicles))

            this.props.navigation.push("Home")
        } catch (e) {
            console.error('Failed to save vehicleList.')
            console.log(e)
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
                            style={{height: 50, width: "60%"}}
                            placeholder="Select your SIM"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.brand}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({brand: itemValue})
                            }
                        >
                            {this.getBrandsList(DATA_BRAND_MODEL).map(item => (
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
                            style={{height: 50, width: "60%"}}
                            placeholder="Select Model"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.model}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({model: itemValue})
                            }
                        >
                            {this.getModelsOfBrand(this.state.brand, DATA_BRAND_MODEL).map(item => (
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
                    
                    

                    <View style={styles.rowButton}>
                    <Button
                        style={styles.btnSubmit}
                        onPress={() => this.save(this.state)}
                    ><Text>Create New Vehicle</Text></Button>
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
            <Button transparent onPress={() => navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>New Vehicle</Title>
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
    borderWidth: 1,
    borderColor:"grey"
  },
  rowLabel: {
    flex: 2,
    textAlign: "right",
    paddingRight: 5
  },
  rowForm: {
    flex: 3
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

export default RegisterVehicleScreen;
