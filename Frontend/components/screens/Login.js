import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Layout from '../Layout/Layout';
import InputBox from '../Form/InputBox';
import Toast from 'react-native-toast-message';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import BallIndicatorComponent from '../Indicators/BallIndicatorComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';

const Login = ({navigation}) => {
  let imageUri =
    'https://www.pngall.com/wp-content/uploads/15/Login-Transparent.png';

  const [form, setForm] = useState({
    email: 'muhammadbilall987456@gmail.com',
    password: '12345',
  });

  const [showIndicator, setShowIndicator] = useState(false);

  //fetching global data from context
  const context = useContext(appContext);
  const {auth, setAuth} = context;

  //login function
  let handleLogin = async () => {
    setShowIndicator(true);
    try {
      const response = await fetch('http://192.168.43.78:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      console.log(data);
      if (data?.success === 2) {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: data?.message,
          position: 'top',
          text2Style: {fontSize: 14, color: 'green'},
        });

        //setting data in asyncStorage and in Global state
        await AsyncStorage.setItem('user', JSON.stringify(data?.user));
        await AsyncStorage.setItem('token', JSON.stringify(data?.token));
        setAuth({...auth, user: data?.user, token: data?.token});

        setTimeout(() => {
          navigation.navigate('Home');
          // navigation.navigate('AllUsers');
        }, 300);
      } else if (data?.success === 1) {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: 'Invalid Credentials',
          position: 'top',
          text2Style: {fontSize: 14, color: 'green'},
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
      setShowIndicator(false);
    }
  };
  return (
    <View>
      <Toast />
      {showIndicator ? (
        <BallIndicatorComponent title={'Logging'} color={'red'} />
      ) : (
        <View
          style={{
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={{uri: imageUri}} style={{width: 200, height: 200}} />
          <InputBox
            autoComplete={'email'}
            placeholder={'Enter your Email'}
            value={form.email}
            name="email"
            form={form}
            setForm={setForm}
          />
          <InputBox
            placeholder={'Enter your Password'}
            value={form.password}
            name="password"
            secureTextEntry={true}
            form={form}
            setForm={setForm}
          />
          {/* <Text>{JSON.stringify(form)}</Text> */}
          <TouchableOpacity
            onPress={() => handleLogin()}
            disabled={form.password === '' || form.email === ''}
            style={[
              {
                backgroundColor: 'black',
                width: '55%',
                padding: 12,
                borderRadius: 15,
                marginVertical: 10,
              },
            ]}>
            <Text
              style={[
                {color: 'white', textAlign: 'center'},
                (form.password === '' || form.email === '') &&
                  styles.validationStyle,
              ]}>
              Login
            </Text>
          </TouchableOpacity>
          {(!form.password || !form.email) && (
            <Text style={{color: 'red', textAlign: 'center'}}>
              Please fill all fields
            </Text>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text style={{color: 'green', fontWeight: 'bold'}}>
              Not a register user?{' '}
              <Text style={{color: 'red', fontSize: 20}}>Signin</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdatePassword')}
            style={{
              backgroundColor: '#0d6efd',
              padding: 12,
              borderRadius: 10,
              width: '50%',
              marginVertical: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}>
              Forget Password
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  validationStyle: {
    textDecorationLine: 'line-through',
    fontSize: 17,
  },
});

export default Login;
