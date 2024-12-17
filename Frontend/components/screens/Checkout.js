import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Layout from '../Layout/Layout';
import {CartContext} from '../Context/CartState';
import {useContext} from 'react';
import Toast from 'react-native-toast-message';
import {appContext} from '../Context/AppState';
import BallIndicatorComponent from '../Indicators/BallIndicatorComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Checkout = ({navigation}) => {
  //getting data from cart context
  const context = useContext(CartContext);
  const {totalPrice, cartItems, quantityBasedProduct, clearCart} = context;

  //getting data from appcontext
  const appcontext = useContext(appContext);
  const {auth, setAuth} = appcontext;

  const [showIndicator, setShowIndicator] = useState(false);
  const [form, setForm] = useState({
    shippingInfo: {
      address: auth?.user?.address,
      city: auth?.user?.city,
      country: auth?.user?.country,
    },
    orderItems: [
      {
        name: '',
        price: 0,
        quantity: 0,
        image: '',
        product: '',
      },
    ],
    tax: 5,
    shippingCharges: 20,
    totalAmount: Number(totalPrice + 25),
  });
  let handleOrder = async () => {
    setShowIndicator(true);
    try {
      const response = await fetch('http://192.168.43.78:3000/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data?.success) {
        alert(data?.message);
        clearCart();
        //setting data in asyncStorage and in Global state
        setAuth(prevAuth => ({
          ...prevAuth,
          user: data?.user,
        }));
        await AsyncStorage.setItem('user', JSON.stringify(data?.user));
        //navigate user to My Orders Page.
        navigation.navigate('MyOrders');
      }
    } catch (error) {
      alert(error?.message);
      console.log(error);
    } finally {
      setShowIndicator(false);
    }
  };

  //handle payment on Cash on Delivery
  let handleCOD = () => {
    handleOrder();
  };
  let handleOnline = () => {
    navigation.navigate('Payment');
  };

  useEffect(() => {
    if (quantityBasedProduct.length > 0) {
      setForm(prevForm => ({
        ...prevForm,
        orderItems: quantityBasedProduct.map(value => ({
          name: value.name,
          price: value.price,
          quantity: value.quantity,
          image: value.images[0].url,
          product: value._id,
        })),
      }));
    }
  }, [quantityBasedProduct]);

  return (
    <Layout>
      {/* <ScrollView style={{height: '30%'}}>
        <Text
          style={{
            padding: 20,
          }}>
          {JSON.stringify(form)}
        </Text>
      </ScrollView> */}
      {showIndicator ? (
        <BallIndicatorComponent title={'Creating Order'} />
      ) : (
        <View
          style={{
            height: '90%',
            // height: '50%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <Toast />
            <Text
              style={{
                color: 'black',
                fontSize: 28,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Payment Options
            </Text>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginHorizontal: 35,
                marginVertical: 10,
              }}>
              <Text style={{color: 'black', fontSize: 22}}>Total Amount :</Text>
              <Text style={{color: 'green', fontSize: 18, fontStyle: 'italic'}}>
                {Number(totalPrice + 25)}$
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#FFFFFE',
              width: '90%',
              paddingVertical: 20,
              paddingHorizontal: 30,
              marginTop: 10,
              borderRadius: 7,
            }}>
            <Text>Select Your Payment Mode</Text>
            <TouchableOpacity
              style={styles.btnDesign}
              onPress={() => handleCOD()}>
              <Text style={styles.textDesign}>Cash On Delievery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnDesign}
              onPress={() => handleOnline()}>
              <Text style={styles.textDesign}>
                Online (CREDIT | DEBIT CARD)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  btnDesign: {
    backgroundColor: 'black',
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  textDesign: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Checkout;
