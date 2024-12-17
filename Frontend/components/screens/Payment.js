import React, {useEffect, useState} from 'react';
import {Button, Text, Keyboard} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Layout from '../Layout/Layout';
import {
  StripeProvider,
  CardField,
  useStripe,
} from '@stripe/stripe-react-native';
import {TouchableOpacity, Alert} from 'react-native';
import CustomButton from './../CustomComponents/CustomButton';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import {CartContext} from '../Context/CartState';
import {BallIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Payment = () => {
  const {confirmPayment} = useStripe();
  const [cardDetails, setCardDetails] = useState({});

  //gettign data from global states
  const context = useContext(appContext);
  const {auth, setAuth} = context;

  //getting data from cartcontext
  const cartcontext = useContext(CartContext);
  const {totalPrice, cartItems, quantityBasedProduct, clearCart} = cartcontext;
  const navigation = useNavigation();

  const [loader, setLoader] = useState(false);

  const [form, setForm] = useState({
    shippingInfo: {
      address: '',
      city: '',
      country: '',
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
    paymentMethod: 'ONLINE',
    tax: 5,
    shippingCharges: 20,
    totalAmount: Number(totalPrice + 25),
  });

  useEffect(() => {
    if (auth?.user) {
      setForm(prevForm => ({
        ...prevForm,
        shippingInfo: {
          address: auth.user.address || '',
          city: auth.user.city || '',
          country: auth.user.country || '',
        },
      }));
    }
  }, [auth?.user]);

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

  //function to create Order
  let handleOrder = async () => {
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
      console.log(data);
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
    }
  };

  //handlePayPress function
  const handlePayPress = async () => {
    Keyboard.dismiss();
    if (!cardDetails?.complete) {
      Alert.alert(
        'Incomplete Card Details',
        'Please fill in all required fields.',
      );
      return;
    }
    setLoader(true);
    try {
      // 1. Call your backend to create a PaymentIntent
      const response = await fetch('http://192.168.43.78:3000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
        body: JSON.stringify({totalAmount: Number(totalPrice + 25)}),
      });

      const {client_secret, success, message} = await response.json();
      // console.log(client_secret);

      if (!success) {
        Alert.alert('Error', message);
        return;
      }

      // 2. Confirm the payment with the CardField details
      const {paymentIntent, error} = await confirmPayment(client_secret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          card: cardDetails,
          billingDetails: {
            name: auth?.user?.name,
            email: auth?.user?.email,
            address: {
              line1: auth?.user?.address,
              city: auth?.user?.city,
              country: 'US',
            },
          },
        },
      });
      // console.log(cardDetails);
      if (error) {
        Alert.alert('Payment failed', error.message);
        console.log(error);
      } else if (paymentIntent) {
        await handleOrder();
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Payment error',
        'An error occurred while processing the payment.',
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <Layout>
      <Text
        style={{
          color: 'green',
          textAlign: 'center',
          fontSize: 20,
          fontStyle: 'italic',
          fontWeight: 'bold',
        }}>
        Online Payment acepted here
      </Text>
      {/* <Text>{JSON.stringify(form)}</Text> */}
      <Text
        style={{
          textAlign: 'center',
          color: 'black',
          fontWeight: 'bold',
          fontStyle: 'italic',
          marginTop: 10,
        }}>
        Total Amount :{' '}
        <Text style={{color: 'green', fontSize: 20}}>
          {Number(totalPrice + 25)}$
        </Text>
      </Text>
      <View>
        <View>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontStyle: 'italic',
              fontWeight: 'bold',
              marginTop: 15,
            }}>
            Enter Your Card Details here
          </Text>
          <CardField
            postalCodeEnabled={true}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 100,
              marginVertical: 10,
            }}
            onCardChange={cardDetails => {
              setCardDetails(cardDetails);
            }}
            onFocus={focusedField => {
              console.log('focusField', focusedField);
            }}
          />
          <View style={{alignItems: 'center'}}>
            {loader ? (
              <View
                style={{
                  height: 150,
                  backgroundColor: 'green',
                  width: 300,
                  borderRadius: 20,
                  justifyContent: 'center',
                }}>
                <BallIndicator color="red" />
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  width: '80%',
                  alignItems: 'center',
                  backgroundColor: '#0d6efd',
                  padding: 15,
                  borderRadius: 20,
                }}
                onPress={handlePayPress}
                disabled={!cardDetails?.complete}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
                  Pay
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default Payment;
