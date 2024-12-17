import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import InputBox from '../../Form/InputBox';
import Layout from '../../Layout/Layout';
import {appContext} from '../../Context/AppState';
import {useContext} from 'react';
import BallIndicatorComponent from '../../Indicators/BallIndicatorComponent';
import {launchImageLibrary} from 'react-native-image-picker';
import {BarIndicator} from 'react-native-indicators';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}) => {
  const [emptyField, setEmptyField] = useState('');

  //getting Data form Global Variables
  const context = useContext(appContext);
  const {auth, setAuth} = context;

  const [UserData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    country: '',
  });

  useEffect(() => {
    if (auth?.user) {
      setUserData(auth?.user);
      setForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        address: auth.user.address || '',
        city: auth.user.city || '',
        phone: auth.user.phone || '',
        country: auth.user.country || '',
      });
      setLoading(false);
    }
  }, [auth?.user]);

  const ValidtionCondition =
    !form.email ||
    !form.name ||
    !form.address ||
    !form.city ||
    !form.country ||
    !form.phone;

  //to know which field is empty
  let emptyFieldName = () => {
    if (!form.name) {
      setEmptyField('Name');
      return;
    } else if (!form.email) {
      setEmptyField('Email');
      return;
    } else if (!form.address) {
      setEmptyField('Address');
      return;
    } else if (!form.city) {
      setEmptyField('City');
      return;
    } else if (!form.country) {
      setEmptyField('Country');
      return;
    } else if (!form.phone) {
      setEmptyField('Phone');
      return;
    }
  };

  useEffect(() => {
    emptyFieldName();
  }, [form]);

  const [loader, setloader] = useState(false);

  //update Function
  let handleUpdate = async () => {
    setloader(true);
    try {
      const response = await fetch('http://192.168.43.78:3000/UpdateProfile', {
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
        //setting data in asyncStorage and in Global state
        await AsyncStorage.setItem('user', JSON.stringify(data?.user));
        setAuth({...auth, user: data?.user});
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
      setloader(false);
    }
  };

  const [imageUrl, setImageUrl] = useState(null);
  const [runFunction, setRunFunction] = useState(false);
  const [showBarIndicator, setShowBarIndicator] = useState(false);

  // Image picker function
  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        setImageUrl(response.assets[0]);
        setRunFunction(true);
        setShowBarIndicator(true);
      }
    });
  };

  //handleUpdatePicture
  let handleUpdatePicture = async () => {
    try {
      //setting Data
      const formData = new FormData();
      // Append image if selected
      if (imageUrl) {
        formData.append('file', {
          uri: imageUrl.uri,
          type: imageUrl.type,
          name: imageUrl.fileName,
        });
      }
      const response = await fetch(
        'http://192.168.43.78:3000/UpdateProfilePic',
        {
          method: 'PUT',
          headers: {
            'auth-token': auth?.token,
          },
          body: formData,
        },
      );
      const data = await response.json();
      if (data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: 'Profile Picture Updated Successfully',
          position: 'top',
        });
        //setting data in asyncStorage and in Global state
        await AsyncStorage.setItem('user', JSON.stringify(data?.user));
        setAuth({...auth, user: data?.user});
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
      setShowBarIndicator(false);
    }
  };

  useEffect(() => {
    if (runFunction) {
      handleUpdatePicture();
      setRunFunction(false);
    }
  }, [runFunction]);

  return (
    <Layout>
      {loading ? (
        <BallIndicatorComponent />
      ) : loader ? (
        <BallIndicatorComponent title={'Updating Profile'} />
      ) : (
        <ScrollView style={{height: '80%', marginTop: 25, marginBottom: 20}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Text>{JSON.stringify(auth)}</Text> */}
            <Toast />
            {imageUrl ? (
              <Image
                source={{uri: imageUrl.uri}}
                style={{width: 140, height: 140, borderRadius: 80}}
              />
            ) : UserData?.profilePic?.url ? (
              <Image
                source={{uri: UserData?.profilePic.url}}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 80,
                }}
              />
            ) : (
              <Image
                source={{
                  uri: 'https://cdn.vectorstock.com/i/1000v/49/90/loading-icon-on-black-vector-24544990.jpg',
                }}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 80,
                }}
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
              {showBarIndicator ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View>
                    <BarIndicator count={6} size={25} color="red" />
                  </View>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      marginLeft: 10,
                    }}>
                    Updating....
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {imageUrl ? 'Image Updated' : 'Do you want to Update Image'}
                </Text>
              )}
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
            {ValidtionCondition && (
              <Text style={{color: 'red', textAlign: 'center'}}>
                Please fill the{' '}
                <Text style={{color: 'green'}}>{emptyField}</Text> field
              </Text>
            )}
            <TouchableOpacity
              onPress={handleUpdate}
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
                Update Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdatePassword')}
              style={{
                backgroundColor: '#0d6efd',
                padding: 12,
                borderRadius: 10,
                width: '78%',
                marginVertical: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                }}>
                Do you Want to Update Password
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  validationStyle: {
    textDecorationLine: 'line-through',
    fontSize: 17,
  },
});

export default Profile;
