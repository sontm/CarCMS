import React from 'react';

import { View, StyleSheet, TextInput, AsyncStorage, Platform } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, 
    Item, Picker, Button, Text, Input, Label, H2, Tabs, Tab, TabHeading} from 'native-base';
import {HeaderText} from '../../components/StyledText'
import AppConstants from '../../constants/AppConstants'
import AppLocales from '../../constants/i18n';
import { connect } from 'react-redux';
import {actSettingSetMaintainType} from '../../redux/UserReducer'

class ServiceMaintainSettingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Km: [5000, 10000, 20000, 40000, 80000],
            Month: [6, 12, 24, 48, 96],
            KmBike: [4000, 8000, 12000, 16000, 20000],
            MonthBike: [4, 8, 12, 18, 24],
        };
        this.save = this.save.bind(this)
        this.onSetValue = this.onSetValue.bind(this)
    }

    save = async (newVehicle) => {
        try {
            console.log("WIll Save Maintain Type setting:")
            console.log(this.state)
            this.props.actSettingSetMaintainType(this.state)

            this.props.navigation.navigate('Settings')
        } catch (e) {
            console.error('Failed to save Vehicle SEtting.')
            console.log(e)
        }
    }
    onSetValue(value, level, isMonth, isBike) {
        if (isBike) {
            if (!isMonth) {
                let prevState = this.state;
                prevState.KmBike[level-1] = Number(value);

                this.setState(prevState)
            } else {
                let prevState = this.state;
                prevState.MonthBike[level-1] = Number(value);

                this.setState(prevState)
            }
        } else {
            if (!isMonth) {
                let prevState = this.state;
                prevState.Km[level-1] = Number(value);

                this.setState(prevState)
            } else {
                let prevState = this.state;
                prevState.Month[level-1] = Number(value);

                this.setState(prevState)
            }
        }
    }
    componentWillMount() {
        console.log("MainainServiceSetting WillMount:")
        if (this.props.userData.settingService) {
            // aready set
            this.setState({
                ...this.props.userData.settingService
            })
        }
    }
    render() {
        return (
            <Container>
            <Tabs style={{flex: 1}}>
            <Tab heading={AppLocales.t("GENERAL_CAR")}
                    tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                    activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
                <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L1")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 1, false)}
                                value={""+this.state.Km[0]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 1, true)}
                                value={""+this.state.Month[0]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L2")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 2, false)}
                                value={""+this.state.Km[1]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 2, true)}
                                value={""+this.state.Month[1]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L3")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 3, false)}
                                value={""+this.state.Km[2]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 3, true)}
                                value={""+this.state.Month[2]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L4")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 4, false)}
                                value={""+this.state.Km[3]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 4, true)}
                                value={""+this.state.Month[3]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L5")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 5, false)}
                                value={""+this.state.Km[4]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 5, true)}
                                value={""+this.state.Month[4]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        block primary
                        onPress={() => this.save(this.state)}
                    ><Text>{AppLocales.t("SETTING_REMIND_BTN_SAVE")}</Text></Button>
                    </View>

                </View>
                </Content>
                </Tab>



                <Tab heading={AppLocales.t("GENERAL_BIKE")}
                        tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
                <Content>
                <View style={styles.formContainer}>
                <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L1_BIKE")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 1, false, true)}
                                value={""+this.state.KmBike[0]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 1, true, true)}
                                value={""+this.state.MonthBike[0]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L2_BIKE")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 2, false, true)}
                                value={""+this.state.KmBike[1]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 2, true, true)}
                                value={""+this.state.MonthBike[1]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L3_BIKE")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 3, false, true)}
                                value={""+this.state.KmBike[2]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 3, true, true)}
                                value={""+this.state.MonthBike[2]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H2>{AppLocales.t("SETTING_MAINTAIN_L4_BIKE")}</H2></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 4, false, true)}
                                value={""+this.state.KmBike[3]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 4, true, true)}
                                value={""+this.state.MonthBike[3]}
                            />
                        </Item>
                    </View>
                </View>
                </Content>
                </Tab>
            </Tabs>
        </Container>
        );
    }
}

ServiceMaintainSettingScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header hasTabs style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{flex: 4}}>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_MAINTAIN")}</HeaderText></Title>
          </Body>
          <Right style={{flex: 1}}/>
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: AppConstants.DEFAULT_FORM_PADDING_HORIZON,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // vertial align
    justifyContent: "center",
    //height: 50,
    width: AppConstants.DEFAULT_FORM_WIDTH,
    alignSelf:"center",
    marginTop: 7,
  },
  rowLabel: {
    flex: 5,
    textAlign: "left",
    paddingRight: 5,
    fontSize: 14
  },
  rowFormNoBorder: {
    flex: 2
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

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actSettingSetMaintainType
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ServiceMaintainSettingScreen);

