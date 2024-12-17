import React, {useState, useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import Layout from '../../Layout/Layout';
import {appContext} from '../../Context/AppState';
import {useContext} from 'react';
import BallIndicatorComponent from '../../Indicators/BallIndicatorComponent';

const TotalAdmins = () => {
  //getting data from global states
  const context = useContext(appContext);
  const {auth} = context;
  const [totalAdmins, setTotalAdmins] = useState([]);
  const [loader, setLoader] = useState(true);

  //getAllCategories
  let getAllAdmins = async () => {
    try {
      const response = await fetch('http://192.168.43.78:3000/getAllAdmins', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
      });
      const data = await response.json();
      //   alert('running');
      //   console.log(data);
      setTotalAdmins(data?.admins);
    } catch (error) {
      alert(error?.message);
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllAdmins();
    }
  }, [auth]);
  return (
    <Layout>
      <View>
        {loader ? (
          <BallIndicatorComponent title={'Loading Admins'} />
        ) : totalAdmins?.length > 0 ? (
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'black',
                fontSize: 18,
                fontStyle: 'italic',
                marginTop: 5,
              }}>
              Total Admins :{' '}
              <Text style={{color: 'green'}}>{totalAdmins?.length}</Text>
            </Text>
            <ScrollView
              style={{
                height: '90%',
                // borderColor: 'red',
                // borderWidth: 2,
                marginTop: 5,
              }}>
              {totalAdmins.map(user => (
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
                      resizeMode="contain"
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
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Text>Admins Not Found</Text>
        )}
      </View>
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

export default TotalAdmins;
