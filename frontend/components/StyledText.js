import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import AppLocales from '../constants/i18n'
import AppConstants from '../constants/AppConstants';

export function MonoText(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />
  );
}

export function HeaderText(props) {
  return (
    <Text {...props} style={[props.style, { color: 'white' }]} />
  );
}

export function WhiteText(props) {
  return (
    <Text {...props} style={[props.style, { color: 'white' }]} />
  );
}

export function NoDataText(props) {
  return (
    <View style={styles.containerNoData}>
      <Text style={{fontSize: 18, color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
        {props.content ? props.content : AppLocales.t("GENERAL_NODATA")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerNoData: {
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    minHeight: 100
  }
})