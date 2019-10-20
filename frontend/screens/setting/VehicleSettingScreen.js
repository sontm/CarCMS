import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import AppContants from '../../constants/AppConstants'

import { connect } from 'react-redux';
import {actSettingSetVehicleDefault} from '../../redux/SettingReducer'

class VehicleSettingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //id: 1, // increment
            kmForOilCar: 10000,
            kmForOilBike: 2000,
            monthAuthoBeyond9To7Year: 18,
            monthAuthoBeyond9From7To12Year: 12,
            monthAuthoBeyond9Over12Year: 6,
            monthAuthoOver9: 6,
            monthAuthoAdvanceTo7Year: 12,
            monthAuthoAdvanceOver7Year: 6,
        };

        this.save = this.save.bind(this)
    }

    save = async (newVehicle) => {
        try {
            console.log("WIll Save Vehicle SEtting Default:")
            let newData = {
                kmForOilBike: Number(this.state.kmForOilBike),
                kmForOilCar: Number(this.state.kmForOilCar),
                monthAuthoBeyond9To7Year: Number(this.state.monthAuthoBeyond9To7Year),
                monthAuthoBeyond9From7To12Year: Number(this.state.monthAuthoBeyond9From7To12Year),
                monthAuthoBeyond9Over12Year: Number(this.state.monthAuthoBeyond9Over12Year),
                monthAuthoOver9: Number(this.state.monthAuthoOver9),
                monthAuthoAdvanceTo7Year: Number(this.state.monthAuthoAdvanceTo7Year),
                monthAuthoAdvanceOver7Year: Number(this.state.monthAuthoAdvanceOver7Year),
            }
            console.log(newData)
            this.props.actSettingSetVehicleDefault(newData)

            this.props.navigation.navigate('Settings')
        } catch (e) {
            console.error('Failed to save Vehicle SEtting.')
            console.log(e)
        }
    }
    componentWillMount() {
        console.log("VehicleSEttingScreen WillMount:" + JSON.stringify(this.props.settingData))
        if (this.props.settingData.defaultVehicleSetting && this.props.settingData.defaultVehicleSetting.kmForOilCar) {
            // aready set
            this.setState({
                ...this.props.settingData.defaultVehicleSetting
            })
        }
    }
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Thay Dau Xe May:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Km"
                            onChangeText={(kmForOilBike) => this.setState({kmForOilBike})}
                            value={""+this.state.kmForOilBike}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Thay Dau Oto:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Km"
                            onChangeText={(kmForOilCar) => this.setState({kmForOilCar})}
                            value={""+this.state.kmForOilCar}
                        />
                        </Item>
                    </View>
                    

                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Oto Duoi 9 Cho, Nho Hon 7 Nam:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="So Thang Dang Kiem"
                            keyboardType="numeric"
                            onChangeText={(monthAuthoBeyond9To7Year) => this.setState({monthAuthoBeyond9To7Year})}
                            value={""+this.state.monthAuthoBeyond9To7Year}
                        />
                        </Item>
                    </View>


                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Oto Duoi 9 Cho, 7 Nam - 12 Nam:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="So Thang Dang Kiem"
                            keyboardType="numeric"
                            onChangeText={(monthAuthoBeyond9From7To12Year) => this.setState({monthAuthoBeyond9From7To12Year})}
                            value={""+this.state.monthAuthoBeyond9From7To12Year}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Oto Duoi 9 Cho, Tren 12 Nam:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="So Thang Dang Kiem"
                            keyboardType="numeric"
                            onChangeText={(monthAuthoBeyond9Over12Year) => this.setState({monthAuthoBeyond9Over12Year})}
                            value={""+this.state.monthAuthoBeyond9Over12Year}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Oto Tren 9 Cho:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="So Thang Dang Kiem"
                            keyboardType="numeric"
                            onChangeText={(monthAuthoOver9) => this.setState({monthAuthoOver9})}
                            value={""+this.state.monthAuthoOver9}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Xe Chuyen Dung, Duoi 7 Nam:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="So Thang Dang Kiem"
                            keyboardType="numeric"
                            onChangeText={(monthAuthoAdvanceTo7Year) => this.setState({monthAuthoAdvanceTo7Year})}
                            value={""+this.state.monthAuthoAdvanceTo7Year}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Xe Chuyen Dung, Tren 7 Nam:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="So Thang Dang Kiem"
                            keyboardType="numeric"
                            onChangeText={(monthAuthoAdvanceOver7Year) => this.setState({monthAuthoAdvanceOver7Year})}
                            value={""+this.state.monthAuthoAdvanceOver7Year}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.save(this.state)}
                    ><Text>Save Data</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

VehicleSettingScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Default Setting</Title>
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
    flex: 1
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    settingData: state.settingData
});
const mapActionsToProps = {
    actSettingSetVehicleDefault
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleSettingScreen);

