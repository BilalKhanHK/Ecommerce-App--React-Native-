import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {BallIndicator, BarIndicator} from 'react-native-indicators';

const BallIndicatorComponent = ({title, color}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '90%',
      }}>
      <View
        style={{
          height: '10%',
          width: '20%',
        }}>
        <BallIndicator color={color} />
      </View>
      <Text style={{color: 'green', fontSize: 18}}>
        {title} <Text style={{fontSize: 30}}>...</Text>
      </Text>
    </View>
  );
};

// Define default props
BallIndicatorComponent.defaultProps = {
  title: 'Loading',
  color: 'red',
};

const styles = StyleSheet.create({});

export default BallIndicatorComponent;
