import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Layout from './../Layout/Layout';
import {useNavigation} from '@react-navigation/native';
import {CartContext} from '../Context/CartState';
import {useContext} from 'react';

const SearchProducts = ({route}) => {
  const {products} = route.params;
  const navigation = useNavigation();

  //getting data form Global states
  const cartContext = useContext(CartContext);
  const {addToCart} = cartContext;

  return (
    <Layout>
      <Text
        style={{
          textAlign: 'center',
          color: 'black',
          fontSize: 17,
          fontWeight: 'bold',
        }}>
        Your Search Products
      </Text>
      <ScrollView style={{height: '85%'}}>
        {products.map(product => (
          <View
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 7,
              padding: 15,
              marginTop: 10,
              marginBottom: 10,
            }}
            key={product._id}>
            <View style={{flexDirection: 'row', marginHorizontal: 5}}>
              <Image
                source={{uri: product.images[0].url}}
                style={{
                  width: 180,
                  height: 130,
                  // borderColor: 'red',
                  // borderWidth: 1,
                  // borderRadius: 20,
                }}
              />
              <View style={{marginHorizontal: 10, marginTop: 5}}>
                <Text style={styles.textContainer}>
                  Stock :<Text style={styles.textChild}> {product.stock}</Text>
                </Text>
                <Text style={styles.textContainer}>
                  Price :<Text style={styles.textChild}> {product.price}$</Text>
                </Text>
                <Text style={styles.textContainer}>
                  Rating :
                  <Text style={styles.textChild}>
                    {''} {product.averageRating}
                  </Text>
                </Text>
                <Text style={styles.textContainer}>
                  Total Reviews :
                  <Text style={styles.textChild}> {product.numReviews} </Text>
                </Text>
                <View
                  style={
                    {
                      // alignItems: 'center',
                      // justifyContent: 'center',
                      // flexDirection: 'row',
                    }
                  }>
                  <Text style={styles.textContainer}>Category :</Text>
                  <View style={{marginTop: 4}}>
                    {product?.category?.category ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 16,
                          color: 'green',
                          fontWeight: 'bold',
                          textDecorationLine: 'underline',
                        }}>
                        {product?.category?.category.length > 15 ? (
                          <Text>
                            {product?.category?.category.substring(0, 15)}
                            ....
                          </Text>
                        ) : (
                          product?.category?.category
                        )}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'red',
                          textAlign: 'center',
                        }}>
                        Category Not Found
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: 'black',
                textDecorationLine: 'underline',
                marginTop: 5,
              }}>
              {product?.name.length > 25 ? (
                <Text>
                  {product?.name.substring(0, 25)}
                  ....
                </Text>
              ) : (
                product?.name
              )}
            </Text>
            <Text style={{color: 'black'}}>
              {product.description.substring(0, 80)}...more
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 30,
                marginTop: 10,
              }}>
              <TouchableOpacity
                style={{width: '40%'}}
                onPress={() => {
                  navigation.navigate('ProductDetails', {product: product});
                }}>
                <Text style={styles.button}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: '40%'}}
                onPress={() => {
                  addToCart(product);
                  // alert('Product Added to Cart.');
                }}>
                <Text style={styles.button}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0d6efd',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    margin: 3,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // contentContainer: {
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  textContainer: {
    color: 'black',
    fontWeight: 'bold',
  },
  textChild: {
    color: 'green',
    fontWeight: 'normal',
  },
});

export default SearchProducts;
