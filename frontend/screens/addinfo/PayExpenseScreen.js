import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import AppContants from '../../constants/AppConstants'
import Layout from '../../constants/Layout';

import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/VehicleReducer'
import AppConstants from '../../constants/AppConstants';
import apputils from '../../constants/AppUtils';

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
            for (let i = 0; i < this.props.vehicleData.expenseList.length; i++) {
                if (this.props.vehicleData.expenseList[i].id == AppContants.CURRENT_EDIT_FILL_ID && 
                        this.props.vehicleData.expenseList[i].vehicleId == AppContants.CURRENT_VEHICLE_ID) {
                    this.setState({
                        ...this.props.vehicleData.expenseList[i],
                        vehicleId: AppContants.CURRENT_VEHICLE_ID,
                        id: AppContants.CURRENT_EDIT_FILL_ID,
                        fillDate:this.props.vehicleData.expenseList[i].fillDate.toLocaleString(),
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
            // this.props.vehicleData.expenseList.forEach(item => {
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
                        <Text style={styles.rowLabel}>
                            Vehicle:
                        </Text>
                        <Item regular>
                        <Picker
                            mode="dropdown"
                            style={{width: (Layout.window.width-40)*0.6}}
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
                            Date:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Date"
                            onChangeText={(fillDate) => this.setState({fillDate})}
                            value={this.state.fillDate}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Price(VND):
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
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
                            <Picker
                                mode="dropdown"
                                style={{width: (Layout.window.width-40)*0.6}}
                                placeholder="Select Expense Type"
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

PayExpenseScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Expense</Title>
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
)(PayExpenseScreen);
