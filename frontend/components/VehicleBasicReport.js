import React, { Component } from 'react'
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage } from 'react-native';
import {Button, Text, Icon } from 'native-base';

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryPie, VictoryAnimation, VictoryLabel} from 'victory-native';

// props.vehicle
    // brand: '',
    // model: '',
    // licensePlate: '',
    // checkedDate:

// props.vehicleList:[],
    //   fillGasList:[],
    //   fillOilList:[],
class VehicleBasicReport extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let newProps = {
            percent: 50
        }
        let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, lastDate, lastKm}
            = AppUtils.getStatForGasUsage(this.props.fillGasList, this.props.vehicle.id);
        let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
            = AppUtils.getInfoForOilUsage( this.props.fillOilList, this.props.vehicle.id, lastDate, lastKm, averageKmPerDay);
        return (
            <View style={styles.container}>
                <View style={styles.vehicleInfoRow}>
                    <Image
                        source={
                            require('../assets/images/toyota.png')
                        }
                        style={styles.vehicleLogo}
                    />

                    <View style={styles.vehicleInfoText}>
                    <Text style={styles.vehicleInfoTextBrand}>
                        {this.props.vehicle.brand + " " + this.props.vehicle.model}
                    </Text>
                    <Text style={styles.vehicleInfoTextPlate}>
                        {this.props.vehicle.licensePlate}
                    </Text>
                    </View>

                    <View style={styles.viewBtnAddData}>
                        <Button
                            style={styles.btnAddData}
                            iconLeft transparent
                            onPress={() => this.props.navigateToInputInfo(this.props.vehicle.id)}
                        >
                            <Icon type="AntDesign" name='pluscircle' style={{fontSize: 35}}/>
                        </Button>
                        <Text style={styles.textAddData}>Add Data</Text>
                    </View>
                </View>

                <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>
                        Km Per Litre:
                    </Text>
                    <Text style={styles.statRowValue}>
                        {averageKmPerLiter + " "}Km/Litre
                    </Text>
                </View>

                <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>
                        Money Per Litre:
                    </Text>
                    <Text style={styles.statRowValue}>
                        {averageMoneyPerLiter} VND/Litre
                    </Text>
                </View>

                <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>
                        Money Per Day:
                    </Text>
                    <Text style={styles.statRowValue}>
                        {averageMoneyPerDay} VND/Day
                    </Text>
                </View>

                <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>
                        Km Per Day:
                    </Text>
                    <Text style={styles.statRowValue}>
                        {averageKmPerDay} Km/Day
                    </Text>
                </View>
                
                <View style={styles.progressContainer}>
                <VictoryPie
                    colorScale={["tomato", "silver"]}
                    data={[
                        { x: "", y: passedKmFromPreviousOil },
                        { x: "", y: AppConstants.SETTING_KM_NEXT_OILFILL },
                    ]}
                    height={180}
                    innerRadius={70}
                    radius={80}
                    labels={() => null}
                    />
                <View style={styles.labelProgress}>
                    <Text style={styles.labelProgressText}>
                        {passedKmFromPreviousOil}/{AppConstants.SETTING_KM_NEXT_OILFILL}
                    </Text>
                    <Text>Km For Next Oil</Text>
                </View>
                <Text>Estimate Next:{nextEstimateDateForOil ? nextEstimateDateForOil.toLocaleDateString(): "NA"}</Text>
                </View>

                <View style={styles.buttonRow}>
                    <Button
                        title="Nhap Du Lieu"
                        onPress={() => this.props.navigateToInputInfo(this.props.vehicle.id)} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      height: 400,
      backgroundColor: "white",
      marginTop: 20,
      flexDirection: "column",
      borderWidth: 0.5,
      borderColor: "grey",
      justifyContent: "space-between"
    },


    vehicleInfoRow: {
        height: 80,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    vehicleLogo: {
        width: 78,
        height: 78,
        resizeMode: 'contain',
        marginTop: 2,
        marginLeft: 5,
        marginRight: 10
    },
    vehicleInfoText: {
        flexDirection:"column",
        justifyContent: "space-around"
    },
    vehicleInfoTextBrand: {
        fontSize: 25
    },
    vehicleInfoTextPlate: {
        fontSize: 20,
        color: "blue"
    },

    viewBtnAddData: {
        alignSelf: "flex-start",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
    },
    btnAddData: {
        alignSelf: "flex-start",
        width: 60,
        height: 50,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    textAddData: {
        color: "blue"
    },

    statRow: {
        flexDirection: "row"
    },
    statRowLabel: {
        flex: 1,
        textAlign: "right",
        paddingRight: 5
    },
    statRowValue: {
        flex: 2
    },

    buttonRow: {
        alignSelf: "center",
        marginBottom: 5
    },

    progressContainer: {
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    labelProgress: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    labelProgressText: {
        fontSize: 30
    }
})
export default VehicleBasicReport;
