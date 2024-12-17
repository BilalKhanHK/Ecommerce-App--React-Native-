import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Layout from '../Layout/Layout';
import {CartData} from '../../data/CartData';
import CartItem from '../Cart/CartItem';
import LoaderKit from 'react-native-loader-kit';
import {CartContext} from '../Context/CartState';
import {useContext} from 'react';

const Cart = ({navigation}) => {
  const context = useContext(CartContext);
  const {cartItems, clearCart, totalPrice} = context;

  //handleClearCart
  let handleClearCart = () => {
    clearCart();
  };

  return (
    <Layout>
      {cartItems.length > 0 ? (
        <>
          <CartItem />
          <View style={{backgroundColor: 'lightgray', marginTop: 7}}>
            <View
              style={{
                marginVertical: 7,
                marginHorizontal: 20,
              }}>
              <View style={styles.calculationStyling}>
                <Text style={styles.textColor}>Price</Text>
                <Text style={styles.textColor}>{totalPrice}$</Text>
              </View>
              <View style={styles.calculationStyling}>
                <Text style={styles.textColor}>Tax</Text>
                <Text style={styles.textColor}>5$</Text>
              </View>
              <View style={styles.calculationStyling}>
                <Text style={styles.textColor}>Shipping</Text>
                <Text style={styles.textColor}>20$</Text>
              </View>
              <View style={styles.grandTotal}>
                <Text style={styles.textColor}>GrandTotal</Text>
                <Text style={styles.textColor}>
                  {Number(totalPrice + 5 + 20)}$
                </Text>
              </View>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Checkout')}
              style={{
                backgroundColor: 'black',
                marginTop: 17,
                padding: 10,
                width: '89%',
                borderRadius: 50,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 17,
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                }}>
                Checkout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleClearCart()}
              style={{
                backgroundColor: 'red',
                marginTop: 17,
                padding: 10,
                width: '89%',
                borderRadius: 50,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 17,
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                }}>
                Clear Cart
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text>{JSON.stringify(cartData)}</Text> */}
        </>
      ) : (
        <Text style={styles.heading}>You Do not have any item in Cart.</Text>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  calculationStyling: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 3,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
    marginHorizontal: 20,
    backgroundColor: '#FBFCFC',
    padding: 6,
  },
  textColor: {
    color: 'black',
  },
});

export default Cart;
