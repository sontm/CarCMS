import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, TextInput, Picker, Button, AsyncStorage } from 'react-native';


// props.vehicle
// brand: '',
// model: '',
// licensePlate: '',
// checkedDate:
class VehicleBasicReport extends Component {
    constructor(props) {
        super(props);
    }
    render() {
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
                        Average Km Per Lit:
                    </Text>
                    <Text style={styles.statRowValue}>
                        200Km/Lit
                    </Text>
                </View>

                <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>
                        Fill Oil Estimation:
                    </Text>
                    <Text style={styles.statRowValue}>
                        200/15000 Km
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
