import { StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StyleSheet, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Root } from "native-base";

import AppNavigator from './navigation/AppNavigator';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import axios from 'axios';
import axiosDefaults from 'axios/lib/defaults';
import AppConstants from './constants/AppConstants';

import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';

axios.defaults.baseURL = AppConstants.SERVER_API;

// import {pushNotification} from './components/pushNotification'

// pushNotification.configure();

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

//If you are using react, wrap your root component with PersistGate. 
//This delays the rendering of your app's UI until your persisted state has been retrieved and saved to redux
class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isLoadingComplete: false
      }
      this.setLoadingComplete = this.setLoadingComplete.bind(this);
  }
  setLoadingComplete(param) {
    this.setState({
      isLoadingComplete: param
    })
  }

  // These will be called Apter Redux-Load, so can connect to Server
  // componentWillMount() {
  //   console.log("App componentWillMount*********************")
  // }
  componentDidMount() {
    console.log("App componentDidMount*********************")
  }
  async componentWillMount() {
    console.log("App componentWillMount*********************")
    // await Font.loadAsync({
    //   Roboto: require("native-base/Fonts/Roboto.ttf"),
    //   Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    // });
    // this.setState({ loading: false });
  }
  render() {
    //StatusBar.setBarStyle('light-content', true);
    //const [isLoadingComplete, setLoadingComplete] = useState(false);
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => handleFinishLoading(this.setLoadingComplete)}
        />
      );
    } else {
      //https://stackoverflow.com/questions/45044941/react-native-expo-stacknavigator-overlaps-notification-bar
      // need add margin of status bar
      return (
        <View style={styles.container}>
          <MyStatusBar backgroundColor="#fff" barStyle="light-content" />
          <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Root>
            <AppNavigator/>
            </Root>
          </PersistGate>
          </Provider>
          <AdMobBanner
            style={styles.bottomBanner}
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            // Test ID, Replace with your-admob-unit-id
            testDeviceID="EMULATOR"
            didFailToReceiveAdWithError={this.bannerError}
          />
        </View>
      );
    }
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/logo/toyota.png'),
      require('./assets/images/toyota.png')
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT : StatusBar.currentHeight;
//const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //marginTop: StatusBar.currentHeight,
    marginTop: STATUSBAR_HEIGHT, // in ios, need to margin -20 screen 
  },
  // statusBar: {
  //   height: STATUSBAR_HEIGHT,
  // },
  bottomBanner: {
    //position: "absolute",
    bottom: 0
  },
});

export default App;