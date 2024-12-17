import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Layout from '../Layout/Layout';
import InputBox from '../Form/InputBox';
import {launchImageLibrary} from 'react-native-image-picker';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import BallIndicatorComponent from '../Indicators/BallIndicatorComponent';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signin = ({navigation}) => {
  let image =
    'https://www.pngall.com/wp-content/uploads/15/Login-Transparent.png';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    phone: '',
    securityQuestion: '',
    country: '',
  });

  const [imageUrl, setImageUrl] = useState(null);

  //accessing global states from context
  const context = useContext(appContext);
  const {auth, setAuth} = context;
  const [showData, setShowData] = useState(null);

  const [showIndicator, setShowIndicator] = useState(false);

  // Image picker function
  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        setImageUrl(response.assets[0]);
      }
    });
  };

  //registration Function
  let handleRegister = async () => {
    setShowIndicator(true);
    try {
      //setting Data
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('phone', form.phone);
      formData.append('securityQuestion', form.securityQuestion);
      formData.append('country', form.country);

      // Append image if selected
      if (imageUrl) {
        formData.append('file', {
          uri: imageUrl.uri,
          type: imageUrl.type,
          name: imageUrl.fileName,
        });
      }
      setShowData(formData);
      const response = await fetch('http://192.168.43.78:3000/register', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        body: formData,
      });
      const data = await response.json();
      // console.log(data);
      if (data?.success === 3) {
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
        }, 300);
      } else if (data?.success === 1) {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: data?.message,
          position: 'top',
          text2Style: {fontSize: 14, color: 'red'},
        });
        console.log(data);
      } else if (data?.success === 2) {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: data?.message,
          position: 'top',
          text2Style: {fontSize: 14, color: 'red'},
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

  const ValidtionCondition =
    !form.password ||
    !form.email ||
    !form.name ||
    !form.address ||
    !form.city ||
    !form.securityQuestion ||
    !form.country ||
    !form.phone ||
    !imageUrl;

  return (
    <View style={{height: '100%'}}>
      {showIndicator ? (
        <BallIndicatorComponent title={'Registering'} />
      ) : (
        <ScrollView style={{marginBottom: 15}}>
          <Toast />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={{uri: image}} style={{width: 150, height: 150}} />
            {imageUrl && (
              <Image
                source={{uri: imageUrl?.uri}}
                style={{width: 300, height: 130, borderRadius: 20}}
                resizeMode="cover"
              />
            )}
            <TouchableOpacity
              onPress={handleChoosePhoto}
              style={{
                backgroundColor: '#0d6efd',
                padding: 12,
                borderRadius: 10,
                width: '78%',
                marginVertical: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {imageUrl ? 'Update Photo' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
            <InputBox
              placeholder={'Enter your Name'}
              value={form.name}
              name="name"
              form={form}
              setForm={setForm}
            />
            <InputBox
              autoComplete={'email'}
              placeholder={'Enter your Email'}
              value={form.email}
              name="email"
              form={form}
              setForm={setForm}
            />
            <InputBox
              placeholder={'Enter your Address'}
              value={form.address}
              name="address"
              form={form}
              setForm={setForm}
            />
            <InputBox
              placeholder={'Enter your City'}
              value={form.city}
              name="city"
              form={form}
              setForm={setForm}
            />
            <InputBox
              placeholder={'Enter your Country'}
              value={form.country}
              name="country"
              form={form}
              setForm={setForm}
            />
            <InputBox
              placeholder={'Enter your Contact Number'}
              value={form.phone}
              name="phone"
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
            <InputBox
              placeholder={'Enter security Question'}
              value={form.securityQuestion}
              name="securityQuestion"
              form={form}
              setForm={setForm}
            />
            {
              <Text
                style={{
                  fontSize: 12,
                  color: 'green',
                  width: '60%',
                  textAlign: 'center',
                }}>
                It will help you when you Forget or Update your Password.
              </Text>
            }
            <TouchableOpacity
              onPress={handleRegister}
              disabled={ValidtionCondition}
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
                  ValidtionCondition && styles.validationStyle,
                ]}>
                Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              {ValidtionCondition && (
                <Text style={{color: 'red', textAlign: 'center'}}>
                  Please fill all fields
                </Text>
              )}
              <Text style={{color: 'green', fontWeight: 'bold'}}>
                Already a register user?{' '}
                <Text style={{color: 'red', fontSize: 20}}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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

export default Signin;
