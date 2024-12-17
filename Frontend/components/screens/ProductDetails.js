import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Layout from '../Layout/Layout';
import BallIndicatorComponent from '../Indicators/BallIndicatorComponent';
import CustomButton from '../CustomComponents/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {CartContext} from '../Context/CartState';
import {useContext} from 'react';

const ProductDetails = ({route}) => {
  const {product} = route.params;
  const [pDetails, setPDetails] = useState(1);
  const [qty, setQty] = useState(1);
  const [showIndicator, setShowIndicator] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (product) {
      setShowIndicator(false);
    }
  }, [product]);

  //gettign data form cartcontext
  const context = useContext(CartContext);
  const {updateItemQuantity, addToCart} = context;

  return (
    <Layout>
      {showIndicator ? (
        <BallIndicatorComponent />
      ) : (
        <View>
          {/* <Text>{JSON.stringify(product)}</Text> */}
          <View
            style={{
              alignItems: 'center',
              height: '35%',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: product.images[0].url}}
              style={{width: '100%', height: '100%'}}
              resizeMode="stretch"
            />
          </View>
          <ScrollView
            style={{
              backgroundColor: '#FFFFFE',
              paddingHorizontal: 15,
              paddingTop: 10,
              height: '60%',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 15,
                paddingBottom: 8,
              }}>
              {product.name}
            </Text>
            <Text style={styles.textStyle}>
              Description :{'  '}
              <Text style={styles.childText}>{product.description}</Text>
            </Text>
            <Text style={styles.textStyle}>
              Rating :{'  '}
              <Text style={styles.childText}>{product.averageRating}</Text>
            </Text>
            <Text style={styles.textStyle}>
              Total Reviews :{'  '}
              <Text style={styles.childText}>{product.numReviews}</Text>
            </Text>
            <Text style={styles.textStyle}>
              Stock : <Text style={styles.childText}>{product.stock}</Text>
            </Text>
            <Text style={styles.textStyle}>
              Price : <Text style={styles.childText}>{product.price}$</Text>
            </Text>
            <View
              style={{
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 20,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  addToCart(product);
                  alert('Product Added to Cart.');
                }}
                style={{
                  backgroundColor: 'black',
                  padding: 10,
                  borderRadius: 5,
                  width: '80%',
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  {product.stock > 0 ? 'Add to Cart' : 'Out Of Stock'}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{alignItems: 'center', marginTop: 10, marginBottom: 20}}>
              <CustomButton
                title={'See All Comments'}
                width={250}
                onPress={() =>
                  navigation.navigate('Comment', {id: product._id})
                }
              />
            </View>
          </ScrollView>
        </View>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
    paddingTop: 8,
  },
  childText: {
    color: 'green',
    fontWeight: 'normal',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default ProductDetails;
