import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Layout from '../../Layout/Layout';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Categories from './../../Category/Categories';

const Dashboard = ({navigation}) => {
  return (
    <Layout>
      <View style={{alignItems: 'center', marginTop: 9}}>
        <View
          style={{
            backgroundColor: 'black',
            width: '90%',
            padding: 15,
            borderRadius: 7,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              textAlign: 'center',
              fontWeight: '600',
            }}>
            Admin Panel
          </Text>
        </View>
      </View>
      <View style={{alignItems: 'center', marginTop: 4}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AllProducts')}
          style={styles.btn}>
          <AntDesign name="edit" size={24} color="black" />
          <Text style={styles.text}>Manage Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('CreateCategory')}>
          <AntDesign name="edit" size={24} color="black" />
          <Text style={styles.text}>Manage Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('AllUsers')}>
          <AntDesign name="user" size={24} color="black" />
          <Text style={styles.text}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AllOrders')}
          style={styles.btn}>
          <AntDesign name="bars" size={24} color="black" />
          <Text style={styles.text}>Manage Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TotalAdmins')}
          style={styles.btn}>
          <AntDesign name="bars" size={24} color="black" />
          <Text style={styles.text}>Manage Admins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <AntDesign name="info" size={24} color="black" />
          <Text style={styles.text}>About App</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: '#fffffe',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 7,
  },
  text: {
    color: 'black',
    marginLeft: 15,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Dashboard;
