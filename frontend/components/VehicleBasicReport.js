import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, TextInput, Picker, Button, AsyncStorage } from 'react-native';

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';

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



                <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>
                        Km For Oil:
                    </Text>
                    <Text style={styles.statRowValue}>
                        {passedKmFromPreviousOil}Km / {AppConstants.SETTING_KM_NEXT_OILFILL}Km
                    </Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>
                        Estimate Next Oil Date:
                    </Text>
                    <Text style={styles.statRowValue}>
                        {nextEstimateDateForOil ? nextEstimateDateForOil.toLocaleDateString(): "NA"}
                    </Text>
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
      height: 300,
      backgroundColor: "white",
      marginTop: 20,
      flexDirection: "column",
      borderWidth: 0.5,
      borderColor: "grey",
      justifyContent: "space-between"
    },


    vehicleInfoRow: {
        height: 80,
        flexDirection: "row"
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
    }
})
export default VehicleBasicReport;
