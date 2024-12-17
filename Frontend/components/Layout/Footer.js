import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CartContext} from '../Context/CartState';
import {BallIndicator, BarIndicator} from 'react-native-indicators';

const Footer = () => {
  const route = useRoute();
  const navigation = useNavigation();

  //getting data from global states
  const context = useContext(appContext);
  const {auth, setAuth} = context;
  //getting data from cartContext
  const cartcontext = useContext(CartContext);
  const {clearCart} = cartcontext;
  const [loader, setLoader] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{alignItems: 'center'}}
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <AntDesign
          name="home"
          size={28}
          color={route.name === 'Home' ? 'blue' : 'black'}
        />
        <Text
          style={[
            {fontSize: 13, fontWeight: 'bold'},
            route.name == 'Home' && styles.active,
          ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center'}}
        onPress={() => {
          navigation.navigate('Notifications');
        }}>
        <AntDesign
          name="bells"
          size={25}
          color={route.name === 'Notifications' ? 'blue' : 'black'}
        />
        <Text
          style={[
            {fontSize: 13, fontWeight: 'bold'},
            route.name == 'Notifications' && styles.active,
          ]}>
          Notification
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{alignItems: 'center'}}
        onPress={() => {
          navigation.navigate('Account');
        }}>
        <MaterialCommunityIcons
          name="account"
          size={28}
          color={route.name === 'Account' ? 'blue' : 'black'}
        />
        <Text
          style={[
            {fontSize: 13, fontWeight: 'bold'},
            route.name == 'Account' && styles.active,
          ]}>
          Account
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{alignItems: 'center'}}
        onPress={() => {
          navigation.navigate('Cart');
        }}>
        <MaterialCommunityIcons
          name="cart"
          size={28}
          color={route.name === 'Cart' ? 'blue' : 'black'}
        />
        <Text
          style={[
            {fontSize: 13, fontWeight: 'bold'},
            route.name == 'Cart' && styles.active,
          ]}>
          Cart
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{alignItems: 'center'}}
        onPress={async () => {
          setLoader(true);
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          setAuth({user: null, token: null});
          clearCart();
          navigation.navigate('Login');
          setLoader(false);
          alert('Your are successfully Logout.');
        }}>
        {loader ? (
          <BallIndicator color="red" size={35} />
        ) : (
          <View>
            <AntDesign name="logout" size={25} color="black" />
            <Text style={{fontSize: 13, fontWeight: 'bold'}}>Logout</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  active: {
    color: 'blue',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginBottom: 2,
  },
});

export default Footer;
