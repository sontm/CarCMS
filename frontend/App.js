import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Root } from "native-base";

import AppNavigator from './navigation/AppNavigator';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import axios from 'axios';
import axiosDefaults from 'axios/lib/defaults';
import AppConstants from './constants/AppConstants';

axios.defaults.baseURL = AppConstants.SERVER_API;

// import {pushNotification} from './components/pushNotification'

// pushNotification.configure();

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
      if (Platform.OS === 'ios') {
        return (
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Root>
              <AppNavigator />
              </Root>
            </PersistGate>
            </Provider>
          </View>
        );
      } else {
        return (
          <SafeAreaView style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Root>
              <AppNavigator />
              </Root>
            </PersistGate>
            </Provider>
          </SafeAreaView>
        );
      }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;