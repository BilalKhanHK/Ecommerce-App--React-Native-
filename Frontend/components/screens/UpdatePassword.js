import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import InputBox from '../Form/InputBox';
import Toast from 'react-native-toast-message';
import {BarIndicator} from 'react-native-indicators';
import {useNavigation} from '@react-navigation/native';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';

const UpdatePassword = () => {
  const [form, setForm] = useState({
    newPassword: '',
    securityQuestion: '',
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  //getting data form Global states
  const context = useContext(appContext);
  const {auth} = context;

  let handleUpdatePassword = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.43.78:3000/UpdatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: data?.message,
          position: 'top',
        });
        setForm({newPassword: '', securityQuestion: ''});
        setTimeout(() => {
          navigation.navigate('Login');
        }, 500);
      } else if (!data?.success) {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: data?.message,
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: error.message,
        position: 'top',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View
        style={{
          height: '80%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Toast />
        <InputBox
          placeholder={'Enter your Security Question'}
          value={form.securityQuestion}
          name="securityQuestion"
          form={form}
          setForm={setForm}
        />
        <InputBox
          placeholder={'Enter your New Password'}
          value={form.newPassword}
          name="newPassword"
          form={form}
          setForm={setForm}
        />
        <TouchableOpacity
          disabled={!form.newPassword || !form.securityQuestion}
          onPress={() => handleUpdatePassword()}
          style={[
            {
              backgroundColor: '#0d6efd',
              padding: 12,
              borderRadius: 10,
              width: '50%',
              marginVertical: 10,
            },
          ]}>
          {loading ? (
            <BarIndicator
              count={6}
              size={25}
              color="red"
              style={{padding: 10}}
            />
          ) : (
            <Text
              style={[
                {
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                },
                (!form.newPassword || !form.securityQuestion) &&
                  styles.validationStyle,
              ]}>
              Update Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  validationStyle: {
    textDecorationLine: 'line-through',
    fontSize: 17,
    textDecorationColor: 'black',
  },
});

export default UpdatePassword;
