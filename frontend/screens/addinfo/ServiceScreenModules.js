import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Segment,Label, ListItem, CheckBox } from 'native-base';

import {HeaderText} from '../../components/StyledText'
import AppConstants from '../../constants/AppConstants'
import Layout from '../../constants/Layout';
import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';

class ServiceScreenModules extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //serviceModule: [], // Bo Phan cua Xe Sua Chua
            serviceModule: {}, // DauMay: Thay Thế|Bảo Dưỡng|Kiểm Tra
        };

        this.toggleItemCheck = this.toggleItemCheck.bind(this)
        this.okSetModules = this.okSetModules.bind(this)
        this.onSetFixType = this.onSetFixType.bind(this)
    }

    componentWillMount() {
        this.setState({
            serviceModule: AppConstants.TEMPDATA_SERVICE_MAINTAIN_MODULES
        })
    }
    toggleItemCheck(value) {
        console.log("toggleItemCheck:" + value)
        let prevList = this.state.serviceModule;

        //let idx = prevList.indexOf(value);
        if ( prevList[""+value]) {
            // Exist, remove from list
           // prevList.splice(idx, 1)
           delete prevList[""+value];
        } else {
            // not exist, create new
            //prevList.push(value)
            prevList[""+value] = AppLocales.t("GENERAL_MAINTAIN_THAYTHE");
        }
        
        this.setState({
            serviceModule: prevList
        })
    }
    // type: T, K, B
    onSetFixType(item, value) {
        let prevList = this.state.serviceModule;
        prevList[""+item.name] = value;
        this.setState({
            serviceModule: prevList
        })
    }
    okSetModules() {
        AppConstants.TEMPDATA_SERVICE_MAINTAIN_MODULES = this.state.serviceModule;
        this.props.navigation.state.params.onOk(this.state.serviceModule)
        this.props.navigation.navigate("PayService")
    }
    render() {
        let T = AppLocales.t("GENERAL_MAINTAIN_THAYTHE");
        let B = AppLocales.t("GENERAL_MAINTAIN_BAODUONG");
        let K = AppLocales.t("GENERAL_MAINTAIN_KIEMTRA");
        console.log("---------------------Render of service module")
        console.log(this.state.serviceModule)
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                  
                {this.props.appData.typeService.map(item => (
                    <ListItem key={item.name}
                            style={{marginLeft: 5}}>
                        
                        <CheckBox checked={this.state.serviceModule[""+item.name] ? true : false}
                            onPress={() => {this.toggleItemCheck(item.name)}}/>

                        <Body style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", flexGrow: 100}}>
                        <TouchableOpacity onPress={() => {this.toggleItemCheck(item.name)}} >
                            <Text style={{fontSize: 16, minWidth: Layout.window.width * 0.2}}>{item.name}</Text>
                        </TouchableOpacity>
                        {this.state.serviceModule[""+item.name] ? (
                        <View style={{flexDirection:"row", alignItems: "center", justifyContent:"flex-end", marginRight: -15}}>
                                <Text style={this.state.serviceModule[""+item.name]==T ? styles.activeSegmentText2 : styles.inActiveSegmentText2}
                                        onPress={() => this.onSetFixType(item, T)}>
                                    Thay Thế
                                </Text>
                                <Text style={this.state.serviceModule[""+item.name]==K ? styles.activeSegmentText2 : styles.inActiveSegmentText2}
                                        onPress={() => this.onSetFixType(item, K)}>
                                    Kiểm Tra
                                </Text>
                                <Text style={this.state.serviceModule[""+item.name]==B ? styles.activeSegmentText2 : styles.inActiveSegmentText2}
                                        onPress={() => this.onSetFixType(item, B)}>
                                    Bảo Dưỡng
                                </Text>
                        </View>
                        ) : null }
                        </Body>

                        <Right style={{flex: 0}}></Right>
                    </ListItem>
                ))} 
                
                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.okSetModules()}
                    ><Text>{AppLocales.t("GENERAL_ADDDATA")}</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

ServiceScreenModules.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={(navigation) => {navigation.goBack()}}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("NEW_SERVICE_MODULES")}</HeaderText></Title>
          </Body>
          <Right />
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 3,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    justifyContent: "center",
    //height: 54,
    width: "90%",
    alignSelf:"center"
    
  },
  rowLabel: {
    flex: 1,
    textAlign: "right",
    paddingRight: 5,
    color: "rgb(120, 120, 120)"
  },
  rowForm: {
    flex: 2,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  },
  smallerText: {
      fontSize: 11
  },

  activeSegment2: {
    //backgroundColor: AppConstants.COLOR_BUTTON_BG,
    backgroundColor: "white",
    color:AppConstants.COLOR_BUTTON_BG,
    borderColor: "white"
  },
  inActiveSegment2: {
    backgroundColor: "#aec7e8",
    color:AppConstants.COLOR_PICKER_TEXT,
    borderColor: "white"
  },
  activeSegmentText2: {
      //color:"white",
      color:AppConstants.COLOR_GOOGLE,
      fontSize: 12,
      textDecorationLine: "underline",
      fontWeight: "bold",
      marginLeft: 3,
      marginRight: 3,
  },
  inActiveSegmentText2: {
        color:AppConstants.COLOR_PICKER_TEXT,
      fontSize: 11,
      padding: 0,
      margin: 0,
      marginLeft: 3,
      marginRight: 3,
  },

});

const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ServiceScreenModules);
