import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AppContants from '../../constants/AppConstants'
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/VehicleReducer'
import AppConstants from '../../constants/AppConstants';

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
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            for (let i = 0; i < this.props.vehicleData.fillGasList.length; i++) {
                if (this.props.vehicleData.fillGasList[i].id == AppContants.CURRENT_EDIT_FILL_ID && 
                        this.props.vehicleData.fillGasList[i].vehicleId == AppContants.CURRENT_VEHICLE_ID) {
                    this.setState({
                        ...this.props.vehicleData.fillGasList[i],
                        vehicleId: AppContants.CURRENT_VEHICLE_ID,
                        id: AppContants.CURRENT_EDIT_FILL_ID,
                        fillDate:this.props.vehicleData.fillGasList[i].fillDate.toLocaleString(),
                    })
                }
            }
        } else {
            this.setState({
                vehicleId: AppContants.CURRENT_VEHICLE_ID
            })
        }
        
    }

    save(newVehicle) {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppContants.CURRENT_VEHICLE_ID) {
            console.log("WIll Edit FillGas:")
            let newData = {
                ...this.state,

                vehicleId: Number(this.state.vehicleId),
                fillDate: this.state.fillDate,
                amount: Number(this.state.amount),
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)
            }

            this.props.actVehicleEditFillItem(newData, AppContants.FILL_ITEM_GAS)
            this.props.navigation.goBack()
        } else {
            console.log("WIll Save Fill Gas:")
            let newData = {
                ...this.state,

                vehicleId: Number(this.state.vehicleId),
                fillDate: this.state.fillDate,
                amount: Number(this.state.amount),
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)
            }
            let maxId = 0;
            this.props.vehicleData.fillGasList.forEach(item => {
                if (maxId < item.id) {
                    maxId = item.id
                }
            })
            newData.id = maxId + 1;
            console.log(JSON.stringify(newData))
            this.props.actVehicleAddFillItem(newData, AppConstants.FILL_ITEM_GAS)

            this.props.navigation.navigate('VehicleDetail')
        }
    }

    render() {
        console.log("FIll Gas State of ID:" + AppContants.CURRENT_VEHICLE_ID)
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
                        {this.props.vehicleData.vehicleList.map(item => (
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
                        value={""+this.state.amount}
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
                        value={""+this.state.price}
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
                        value={""+this.state.currentKm}
                    />
                    </Item>
                </View>

                <View style={styles.rowContainer}>
                    <Text style={styles.rowLabel}>
                        Ghi Chu:
                    </Text>
                    <Item regular style={styles.rowForm}>
                    <Input
                        placeholder="Ghi Chu"
                        onChangeText={(remark) => this.setState({remark})}
                        value={this.state.remark}
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

const mapStateToProps = (state) => ({
    vehicleData: state.vehicleData
});
const mapActionsToProps = {
    actVehicleAddFillItem,
    actVehicleEditFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(FillGasScreen);
