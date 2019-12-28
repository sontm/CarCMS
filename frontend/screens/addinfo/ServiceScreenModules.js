import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Segment,Label, ListItem, CheckBox, H3 } from 'native-base';

import {HeaderText, WhiteText} from '../../components/StyledText'
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
        if (this.props.navigation.state.params.isBike == true) {
            AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = true;
        } else {
            AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = false;
        }
        
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
        //console.log(this.state.serviceModule)
        console.log(this.props.userData.customServiceModules)
        console.log(this.props.userData.customServiceModulesBike)

        let serviceArr = this.props.appData.typeService;
        let customArr = this.props.userData.customServiceModules;
        if (this.props.navigation.state.params.isBike == true) {
            serviceArr = this.props.appData.typeServiceBike;
            customArr = this.props.userData.customServiceModulesBike;
        }
        let customView = [];
        if (customArr&& customArr.length >0) {
            customView.push(
                <Text style={styles.textHeadingRow} key="userdefined">
                    {AppLocales.t("SETTING_SERVICEMODULEHEAD_USERDEFINED")}</Text>
            )

            customArr.forEach((item,idx) => {
                customView.push(
                    <ListItem key={item.name+idx}
                            style={{marginLeft: 5}}>
                        
                        <CheckBox checked={this.state.serviceModule[""+item.name] ? true : false}
                            onPress={() => {this.toggleItemCheck(item.name)}}/>

                        <Body style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", flexGrow: 100}}>
                        <TouchableOpacity onPress={() => {this.toggleItemCheck(item.name)}} >
                            <Text style={{fontSize: 16, minWidth: Layout.window.width * 0.2, minHeight: 20}}>{item.name}</Text>
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
                )
            })

            customView.push(
                <Text style={styles.textHeadingRow} key="systemdefined">
                    {AppLocales.t("SETTING_SERVICEMODULEHEAD_SYSTEMDEFINED")}</Text>
            )
        }
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                {customView}
                {serviceArr.map(item => (
                    <ListItem key={item.name}
                            style={{marginLeft: 5}}>
                        
                        <CheckBox checked={this.state.serviceModule[""+item.name] ? true : false}
                            onPress={() => {this.toggleItemCheck(item.name)}}/>

                        <Body style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", flexGrow: 100}}>
                        <TouchableOpacity onPress={() => {this.toggleItemCheck(item.name)}} >
                            <Text style={{fontSize: 16, minWidth: Layout.window.width * 0.2, minHeight: 20}}>{item.name}</Text>
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
                
                    

                </View>
            </Content>
            <View style={styles.rowButton}>
                <Button rounded
                    style={styles.btnSubmit}
                    onPress={() => this.okSetModules()}
                ><Text>{AppLocales.t("GENERAL_ADDDATA")}</Text></Button>
            </View>
            </Container>
        );
    }
}

ServiceScreenModules.navigationOptions = ({ navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body  style={{flex: 4}}>
            <Title><HeaderText>{AppLocales.t("NEW_SERVICE_MODULES") + " " + 
                (navigation.state.params.isBike ? 
                (AppLocales.t("GENERAL_MAINTAIN_BAODUONG") + " " + AppLocales.t("GENERAL_BIKE"))
                : (AppLocales.t("GENERAL_MAINTAIN_BAODUONG") + " " + AppLocales.t("GENERAL_CAR")))}</HeaderText></Title>
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent vertical onPress={() => {
                navigation.navigate("ServiceModuleCreate")
            }}>
              <Icon type="AntDesign" name="plus" />
              <WhiteText style={styles.smallerText}>{AppLocales.t("GENERAL_ADD")}</WhiteText>
            </Button>
          </Right>
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    //paddingTop: 15,
    paddingHorizontal: 3,
    backgroundColor: '#fff',
    flexDirection: "column",
    paddingBottom: 70
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
    alignItems: "center",
    alignSelf: "center",
    position: 'absolute',
    justifyContent: "center",
    bottom: 3,
    left: 0,
    right: 0,
  },
  btnSubmit: {
    width: AppConstants.DEFAULT_FORM_BUTTON_WIDTH,
    backgroundColor: AppConstants.COLOR_BUTTON_BG,
    justifyContent: "center",
  },
  textHeadingRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: "flex-start",
    flexWrap: "wrap",
    flexGrow: 100,
    marginLeft: 0,
    paddingLeft: 5,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    fontSize: 20
  },

  smallerText: {
      fontSize: 10
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
      fontSize: 12,
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
