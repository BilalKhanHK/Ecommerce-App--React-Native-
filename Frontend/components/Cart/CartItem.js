import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {CartContext} from '../Context/CartState';
import {useContext} from 'react';
import {BallIndicator, BarIndicator} from 'react-native-indicators';

const CartItem = ({}) => {
  //gettign data form cartcontext
  const context = useContext(CartContext);
  const {
    removeFromCart,
    cartItems,
    updateItemQuantity,
    totalPrice,
    setTotalPrice,
    setQuantityBasedProduct,
  } = context;

  const [productQuantities, setProductQuantities] = useState([]);

  // Function to count product quantities
  const countProductQuantities = () => {
    const quantities = {};
    cartItems.forEach(item => {
      if (item && item._id) {
        if (quantities[item._id]) {
          quantities[item._id].quantity += item.quantity || 1;
        } else {
          quantities[item._id] = {...item, quantity: item.quantity || 1};
        }
      }
    });
    setProductQuantities(Object.values(quantities));
    setQuantityBasedProduct(Object.values(quantities));
  };

  useEffect(() => {
    countProductQuantities();
  }, [cartItems]);

  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let total = 0;
    productQuantities.forEach(item => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);
  });

  return (
    // borderColor: 'red', borderWidth: 2
    <ScrollView style={{height: '45%'}}>
      {/* <Text style={styles.heading}>
        You have {totalItems} Items in your Cart.
      </Text> */}
      {productQuantities?.map(value => {
        return (
          <View
            style={{backgroundColor: '#FBFCFC', marginTop: 13}}
            key={value._id}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 4,
              }}>
              <View>
                <Image
                  source={{uri: value.images[0].url}}
                  style={styles.image}
                  resizeMode="stretch"
                />
              </View>
              <View style={{width: '40%'}}>
                <Text style={{color: 'black'}}>{value.name}</Text>
                <Text style={{color: 'black'}}>Price: {value.price}$</Text>
                <Text style={{color: 'black'}}>Quantity: {value.quantity}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  // borderColor: 'red',
                  // borderWidth: 2,
                  width: '30%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (value.quantity > 1) {
                      updateItemQuantity(value._id, value.quantity - 1);
                    }
                  }}
                  style={{
                    backgroundColor: 'blue',
                    padding: 5,
                    width: '35%',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>-</Text>
                </TouchableOpacity>
                <Text style={{marginHorizontal: 14}}>{value.quantity}</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (value.quantity < 10) {
                      updateItemQuantity(value._id, value.quantity + 1);
                    } else {
                      alert('You cannot add more than 10 items.');
                    }
                  }}
                  style={{
                    backgroundColor: 'blue',
                    padding: 5,
                    width: '35%',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => removeFromCart(value._id)}
                style={{
                  backgroundColor: 'red',
                  width: '60%',
                  borderRadius: 10,
                  padding: 6,
                  marginBottom: 8,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Remove from Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 100,
  },
  heading: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});

export default CartItem;
