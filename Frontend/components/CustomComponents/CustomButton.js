import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

const CustomButton = ({width, title, onPress, disabled}) => {
  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{
          backgroundColor: '#0d6efd',
          padding: 12,
          borderRadius: 10,
          width: width,
          marginVertical: 4,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Define default props
CustomButton.defaultProps = {
  width: '50%',
};
const styles = StyleSheet.create({});

export default CustomButton;
