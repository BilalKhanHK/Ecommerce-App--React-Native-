import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import {BallIndicator} from 'react-native-indicators';
import {CartContext} from '../Context/CartState';

const ProductsCard = () => {
  const navigation = useNavigation();

  //getting data form Global states
  const context = useContext(appContext);
  const {auth} = context;

  const cartContext = useContext(CartContext);
  const {addToCart} = cartContext;

  const [allProducts, setAllProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState({
    allProducts: true,
  });

  //getAllProducts
  let getAllProducts = async () => {
    try {
      const response = await fetch('http://192.168.43.78:3000/getAllProducts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAllProducts(data?.products);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: error.message,
        position: 'top',
      });
      console.log(error);
    } finally {
      setLoader({allProducts: false});
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllProducts();
    }
  }, [auth]);

  return (
    <View>
      {/* <Text>{JSON.stringify(allProducts)}</Text> */}
      {loader.allProducts ? (
        <View
          style={{
            alignItems: 'center',
            marginTop: 30,
          }}>
          <BallIndicator />
          <Text
            style={{
              color: 'green',
              fontSize: 18,
              marginTop: 30,
              fontStyle: 'italic',
            }}>
            Loading Products....
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{height: '100%', marginBottom: 0}}
          showsVerticalScrollIndicator={false}>
          {allProducts?.length > 0 ? (
            allProducts.map(product => (
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
                      Stock :
                      <Text style={styles.textChild}> {product.stock}</Text>
                    </Text>
                    <Text style={styles.textContainer}>
                      Price :
                      <Text style={styles.textChild}> {product.price}$</Text>
                    </Text>
                    <Text style={styles.textContainer}>
                      Rating :
                      <Text style={styles.textChild}>
                        {''} {product.averageRating}
                      </Text>
                    </Text>
                    <Text style={styles.textContainer}>
                      Total Reviews :
                      <Text style={styles.textChild}>
                        {' '}
                        {product.numReviews}{' '}
                      </Text>
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
            ))
          ) : (
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  backgroundColor: '#FFFFFF',
                  color: 'black',
                  width: 300,
                  borderRadius: 20,
                  padding: 15,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  marginTop: 30,
                }}>
                No Product Found....
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
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

export default ProductsCard;
