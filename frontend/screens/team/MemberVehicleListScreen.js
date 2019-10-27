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

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from 'native-base';

import VehicleBasicReport from '../../components/VehicleBasicReport'

class MemberVehicleListScreen extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    console.log("MemberVehicleListScreen Render")
    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              {this.props.navigation.state.params && this.props.navigation.state.params.member &&
                this.props.navigation.state.params.member.vehicleList.map(item => (
                <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={() => {}}
                  navigation={this.props.navigation}
                />
              ))}

            </ScrollView>
          </View>
        </Content>
      </Container>
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
        <Title>Member Vehicle</Title>
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
});

const mapStateToProps = (state) => ({
});
const mapActionsToProps = {
};

export default connect(
  mapStateToProps,mapActionsToProps
)(MemberVehicleListScreen);
