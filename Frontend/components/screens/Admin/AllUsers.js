import React, {useContext, useState, useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import Layout from '../../Layout/Layout';
import {appContext} from '../../Context/AppState';
import {createContext} from 'react';
import BallIndicatorComponent from '../../Indicators/BallIndicatorComponent';
import {TouchableOpacity} from 'react-native';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const AllUsers = () => {
  //getting data from global states
  const context = useContext(appContext);
  const {auth} = context;
  const [users, setAllUsers] = useState([]);
  const [loader, setLoader] = useState(true);

  const navigation = useNavigation();

  //getAllCategories
  let getAllUsers = async () => {
    try {
      const response = await fetch('http://192.168.43.78:3000/getAllUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
      });
      const data = await response.json();
      //   alert('running');
      //   console.log(data);
      setAllUsers(data?.users);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: error.message,
        position: 'top',
      });
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllUsers();
    }
  }, [auth]);

  const [adminLoader, setAdminLoader] = useState(false);
  let handleAdminAccess = async id => {
    setAdminLoader(true);
    try {
      const response = await fetch('http://192.168.43.78:3000/adminAccess', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
        body: JSON.stringify({id}),
      });
      const data = await response.json();
      if (data?.success) {
        alert(data?.message);
        getAllUsers();
        navigation.navigate('TotalAdmins');
      }
    } catch (error) {
      console.log(error);
      alert(error?.message);
    } finally {
      setAdminLoader(false);
    }
  };
  return (
    <Layout>
      {loader ? (
        <BallIndicatorComponent title={'Loading Users'} />
      ) : (
        <View>
          <Toast />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: 'black',
              fontWeight: 'bold',
              fontStyle: 'italic',
              textDecorationLine: 'underline',
            }}>
            All Users
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: 'green',
              fontSize: 18,
              paddingBottom: 10,
            }}>
            Total Users : <Text style={{color: 'red'}}> {users.length}</Text>
          </Text>
          <ScrollView style={{height: '85%'}}>
            {users.length > 0 ? (
              users.map(user => (
                <View
                  key={user._id}
                  style={{
                    backgroundColor: '#ffffff',
                    marginVertical: 20,
                    alignItems: 'center',
                    paddingBottom: 10,
                  }}>
                  <View style={{marginVertical: 10}}>
                    <Image
                      source={{uri: user.profilePic.url}}
                      style={{width: 300, height: 150}}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      Name : <Text style={styles.textChild}>{user.name}</Text>
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      Email : <Text style={styles.textChild}>{user.email}</Text>
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      Address :{' '}
                      <Text style={styles.textChild}>{user.address}</Text>
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      City : <Text style={styles.textChild}>{user.city}</Text>
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      Country :{' '}
                      <Text style={styles.textChild}>{user.country}</Text>
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      Contact :{' '}
                      <Text style={styles.textChild}>{user.phone}</Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAdminAccess(user._id)}
                    style={{
                      backgroundColor: 'red',
                      width: '80%',
                      padding: 10,
                      borderRadius: 15,
                      marginTop: 5,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                      }}>
                      {adminLoader ? (
                        <BallIndicator color="yellow" />
                      ) : (
                        'Give It Admin Access.'
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No User Found</Text>
            )}
          </ScrollView>
        </View>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  textChild: {
    fontWeight: 'normal',
    color: 'green',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default AllUsers;
