import React from 'react';
import { View, StyleSheet, Text, TextInput, Picker, Button, AsyncStorage } from 'react-native';
import AppContants from '../constants/AppConstants'

class InputInfoScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.rowButton}>
                    <Button
                        title="Fill Gas"
                        onPress={() => this.props.navigation.navigate("FillGas", 
                            {vehicleId: this.props.navigation.state.params.vehicleId})}
                    />
                </View>

                <View style={styles.rowButton}>
                    <Button
                        title="Fill Oil"
                        onPress={() => this.props.navigation.navigate("FillOil", 
                            {vehicleId: this.props.navigation.state.params.vehicleId})}
                    />
                </View>
            </View>
        );
    }
}

InputInfoScreen.navigationOptions = {
    title: 'Input Info',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between"
  },
  rowButton: {
    //flexDirection:"row",
    //justifyContent: "center",
    margin: 20,
  }
});

export default InputInfoScreen;
