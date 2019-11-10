import React from 'react';
import { Text } from 'react-native';

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
