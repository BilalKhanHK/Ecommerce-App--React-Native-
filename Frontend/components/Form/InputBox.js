import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const InputBox = ({
  autoComplete,
  placeholder,
  secureTextEntry,
  value,
  name,
  setForm,
  form,
  keyboardType,
}) => {
  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <TextInput
        style={styles.input}
        autoComplete={autoComplete}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={text =>
          setForm({
            ...form,
            [name]: text,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: 'black',
    borderWidth: 1.5,
    width: '80%',
    height: 40,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default InputBox;
