import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Picker} from 'native-base';

import VehicleBasicReport from '../../components/VehicleBasicReport'
import AppLocales from '../../constants/i18n'

class MemberVehicleListScreen extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log("MemberVehicleListScreen Render")
    return (
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.contentContainer}>
              {this.props.navigation.state.params && this.props.navigation.state.params.member &&
                this.props.navigation.state.params.member.vehicleList.map(item => (
                <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={() => {}}
                  navigation={this.props.navigation}
                />
              ))}

            </ScrollView>
          </View>
    );
  }
}

MemberVehicleListScreen.navigationOptions = ({navigation}) => ({
  header: (
    <Header>
      <Left>
        <Button transparent onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>{AppLocales.t("TEAM_MEMBER_CAR_HEADER")}</Title>
      </Body>
      <Right />
    </Header>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {

  },
  sortContainer: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
});

const mapStateToProps = (state) => ({
});
const mapActionsToProps = {
};

export default connect(
  mapStateToProps,mapActionsToProps
)(MemberVehicleListScreen);

