import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AppContants from '../../constants/AppConstants'
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

const DATA_BRAND_MODEL = [
    { id: 1,name: "Toyota", models: [{id:1, name: "Vios"},{id:2, name: "Hilux"},{id:3, name: "Yaris"},{id:4, name: "Camry"}]},
    { id: 2,name: "Madza", models: [{id:5, name: "X3"},{id:6, name: "X4"},{id:7, name: "X5"},{id:8, name: "CX5"}]},
    { id: 3,name: "Honda", models: [{id:9, name: "CRV"},{id:10, name: "City"}]},
    { id: 4,name: "Nissan", models: [{id:11, name: "X-Trail"},{id:12, name: "Sunny"},{id:13, name: "Surge"}]},
    { id: 5,name: "Kia", models: [{id:14, name: "Morning"},{id:15, name: "K3"},{id:16, name: "Cerato"},{id:17, name: "Sorento"}]},
    { id: 6,name: "Huyndai", models: [{id:18, name: "i10"},{id:19, name: "New i10"},{id:20, name: "Accent"},{id:21, name: "Elanta"}]},
];

class FillGasScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleList: [],
            //id: 1, // increment
            vehicleId: 0,
            fillDate: new Date().toLocaleString(),
            amount: "",
            price: "",
            currentKm: ""
        };

        this.load = this.load.bind(this)
        this.save = this.save.bind(this)
    }

    componentWillMount() {
        this.load()
    }
    load = async () => {
        try {
            let vehicleList = await AsyncStorage.getItem(AppContants.STORAGE_VEHICLE_LIST)
            vehicleList = JSON.parse(vehicleList)
            // Add Default value
            vehicleList.unshift({id: 0, brand:"-", model:"Please Select", licensePlate: "-"})

            // If User choose for a Car
            let selectedVehicle = 0;
            if (this.props.navigation.state.params.vehicleId) {
                selectedVehicle = this.props.navigation.state.params.vehicleId
            }
            this.setState({
                vehicleList: vehicleList,
                vehicleId: selectedVehicle
            })
        } catch (e) {
            console.error('Failed to load vehicleList from AsyncStorage.')
            console.log(e)
        }
    }
    save = async (newVehicle) => {
        try {
            console.log("WIll Save:")
            let newData = {
                vehicleId: Number(this.state.vehicleId),
                fillDate: this.state.fillDate,
                amount: Number(this.state.amount),
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)
            }
            console.log(newData)

            const previousData = await AsyncStorage.getItem(AppContants.STORAGE_FILL_GAS_LIST)
            let newDataList = JSON.parse(previousData)
            if (!newDataList) {
                newDataList = [];
            }
            newData.id = newDataList.length + 1;
            newDataList.push(newData)
            await AsyncStorage.setItem(AppContants.STORAGE_FILL_GAS_LIST, JSON.stringify(newDataList))

            this.props.navigation.push('VehicleDetail')
        } catch (e) {
            console.error('Failed to save vehicleList.')
            console.log(e)
        }
    }

    render() {
        console.log("FIll Gas State of ID:" + this.props.navigation.state.params.vehicleId)
        console.log(this.state)
        return (
            <Container>
            <Content>
            <View style={styles.formContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowLabel}>
                        Vehicle:
                    </Text>
                    <Item regular>
                    <Picker
                        style={styles.rowForm}
                        mode="dropdown"
                        placeholder="Select Car"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.vehicleId}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({vehicleId: itemValue})
                        }
                    >
                        {this.state.vehicleList.map(item => (
                            <Picker.Item label={item.brand + " " + item.model + " " + item.licensePlate}
                                value={item.id} key={item.id}/>
                        ))}
                    </Picker>
                    </Item>
                </View>

                <View style={styles.rowContainer}>
                    <Text style={styles.rowLabel}>
                        Fill Date:
                    </Text>
                    <Item regular style={styles.rowForm}>
                    <Input
                        placeholder="Fill Date"
                        onChangeText={(fillDate) => this.setState({fillDate})}
                        value={this.state.fillDate}
                    />
                    </Item>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowLabel}>
                        Amount:
                    </Text>
                    <Item regular style={styles.rowForm}>
                    <Input
                        style={styles.rowForm}
                        placeholder="Lit"
                        keyboardType="numeric"
                        onChangeText={(amount) => this.setState({amount})}
                        value={this.state.amount}
                    />
                    </Item>
                </View>

                <View style={styles.rowContainer}>
                    <Text style={styles.rowLabel}>
                        Price(VND):
                    </Text>
                    <Item regular style={styles.rowForm}>
                    <Input
                        style={styles.rowForm}
                        placeholder="VND"
                        keyboardType="numeric"
                        onChangeText={(price) => this.setState({price})}
                        value={this.state.price}
                    />
                    </Item>
                </View>

                <View style={styles.rowContainer}>
                    <Text style={styles.rowLabel}>
                        Current Km:
                    </Text>
                    <Item regular style={styles.rowForm}>
                    <Input
                        style={styles.rowForm}
                        placeholder="Km"
                        keyboardType="numeric"
                        onChangeText={(currentKm) => this.setState({currentKm})}
                        value={this.state.currentKm}
                    />
                    </Item>
                </View>
                <View style={styles.rowButton}>
                <Button
                    block primary
                    onPress={() => this.save(this.state)}
                ><Text>Add Data</Text></Button>
                </View>
            </View>
            </Content>
            </Container>
        );
    }
}

FillGasScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Fill Gas</Title>
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
    flex: 1,
    textAlign: "right",
    paddingRight: 5
  },
  rowForm: {
    flex: 2
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

export default FillGasScreen;
