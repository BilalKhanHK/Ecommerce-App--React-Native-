import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Layout from '../Layout/Layout';
// import {UserData} from './../../data/UserData';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import BallIndicatorComponent from '../Indicators/BallIndicatorComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Account = ({navigation}) => {
  //getting Data from Global States
  const context = useContext(appContext);
  const {auth} = context;

  const [UserData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserData(auth?.user);
    setLoading(false);
  }, [auth?.user]);

  let [data, setData] = useState(null);

  useEffect(() => {
    let token = AsyncStorage.getItem('token');
    setData(token);
  }, []);

  return (
    <Layout>
      {loading ? (
        <BallIndicatorComponent />
      ) : (
        <View>
          {/* <Text style={{padding: 30}}>{JSON.stringify(data)}</Text> */}
          <View style={{alignItems: 'center', marginTop: 18}}>
            {UserData?.profilePic?.url ? (
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
            <Text style={{marginTop: 5, color: 'black', fontSize: 17}}>
              Hi <Text style={{color: 'green'}}>{UserData?.name}</Text>
              <Text style={{color: 'red', fontSize: 23}}> ✔</Text>
            </Text>
            <Text style={{color: 'black'}}>email : {UserData?.email}</Text>
            <Text style={{color: 'black'}}>contact : {UserData?.phone}</Text>
          </View>
          <View style={{backgroundColor: '#ffffff', marginTop: 20}}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontWeight: 'bold',
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  width: '90%',
                  textAlign: 'center',
                  paddingVertical: 15,
                }}>
                Account Setting
              </Text>
            </View>
            <View style={{padding: 23}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Profile', {id: UserData._id})
                }
                style={{
                  flexDirection: 'row',
                  marginVertical: 5,
                  alignItems: 'center',
                }}>
                <AntDesign name="edit" size={25} color={'black'} />
                <Text style={{marginLeft: 8, color: 'black'}}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('MyOrders', {id: UserData._id})
                }
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <AntDesign name="bars" size={25} color={'black'} />
                <Text style={{marginLeft: 8, color: 'black'}}>My Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color={'black'}
                />
                <Text style={{marginLeft: 8, color: 'black'}}>
                  Notifications
                </Text>
              </TouchableOpacity>
              {auth?.user?.isAdmin && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Dashboard', {id: UserData._id})
                  }
                  style={{
                    flexDirection: 'row',
                    marginVertical: 10,
                    alignItems: 'center',
                  }}>
                  <AntDesign name="windows" size={25} color={'black'} />
                  <Text style={{marginLeft: 8, color: 'black'}}>
                    Admin Panel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default Account;
