import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';

import { connect } from 'react-redux';
import {actAppIncreaseOpenCount} from '../redux/AppDataReducer'


import {
    AdMobBanner,
    AdMobInterstitial,
} from 'expo-ads-admob';
import AppConstants from '../constants/AppConstants';

var canShowInterestial = true;
export async function checkAndShowInterestial() {
    if (canShowInterestial) {
        AppConstants.ADS_COUNT_CLICK_INTERACTIVE++;
        console.log("||AdsManager||: CountInteractive:" + AppConstants.ADS_COUNT_CLICK_INTERACTIVE)
        if (AppConstants.ADS_COUNT_CLICK_INTERACTIVE < AppConstants.ADS_COUNT_CLICK_SHOW_INTERESTIAL) {
            return;
        }
        AppConstants.ADS_COUNT_CLICK_INTERACTIVE = 0;
        try {
            AdMobInterstitial.setAdUnitID(AppConstants.ADS_INTERESTIALID); // Test ID, Replace with your-admob-unit-id
            AdMobInterstitial.setTestDeviceID('EMULATOR');
            AdMobInterstitial.addEventListener("interstitialDidLoad", () =>
            console.log("interstitialDidLoad")
            );
            AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () =>
            console.log("interstitialDidFailToLoad")
            );
            AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
            console.log("interstitialDidOpen")
            );
            AdMobInterstitial.addEventListener("interstitialDidClose", () =>
            console.log("interstitialDidClose")
            );
            AdMobInterstitial.addEventListener("interstitialWillLeaveApplication", () =>
            console.log("interstitialWillLeaveApplication")
            );
            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
            await AdMobInterstitial.showAdAsync();
        } catch (error) {
            console.log("Interestial Error*");
            console.log(error)
        }
    }
}

class AdsManager extends React.Component {
  constructor(props) {
    super(props);

  }
  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }
  componentDidMount() {
    console.log("||||Ads Manager|||| DidMount, count:" + this.props.appData.countOpen)
    this.props.actAppIncreaseOpenCount()
    if (this.props.appData.countOpen < 10) {
        canShowInterestial = false;
    } else {
        canShowInterestial = !this.props.appData.isNoAds;
    }
  }

  
  render() {
    console.log("||||Ads Manager|||| Render, count:" + this.props.appData.countOpen)
    //this.props.appData.isNoAds
    if (this.props.appData.countOpen < 10) {
        return null
    } else {
        return (
            <AdMobBanner
                style={styles.bottomBanner}
                bannerSize="fullBanner"
                adUnitID={AppConstants.ADS_BANNERID}
                // Test ID, Replace with your-admob-unit-id
                testDeviceID="EMULATOR"
                didFailToReceiveAdWithError={this.bannerError}
            />
        )
    }
  }
}

const styles = StyleSheet.create({
    container: {
    },

})


const mapStateToProps = (state) => ({
    appData: state.appData
});
const mapActionsToProps = {
    actAppIncreaseOpenCount
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(AdsManager);
