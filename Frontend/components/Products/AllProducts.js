import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  Modal,
  RefreshControl,
} from 'react-native';
import Layout from '../Layout/Layout';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import Toast from 'react-native-toast-message';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomButton from '../CustomComponents/CustomButton';
import InputBox from '../Form/InputBox';

const AllProducts = ({navigation}) => {
  const [loader, setLoader] = useState({
    allProducts: true,
  });
  const [deleteLoading, setDeleteLoading] = useState({});

  //getting data form Global states
  const context = useContext(appContext);
  const {auth} = context;

  //state variables
  const [allProducts, setAllProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    getAllProducts();
  };

  //deleting Product
  let handleDelete = async id => {
    setDeleteLoading(prev => ({...prev, [id]: true}));
    try {
      const response = await fetch(
        `http://192.168.43.78:3000/deleteProduct/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': auth?.token,
          },
        },
      );
      const data = await response.json();
      if (data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: 'Category deleted successfully',
          position: 'top',
          text2Style: {color: 'black', fontSize: 20},
        });
        getAllProducts();
      } else if (!data?.success) {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: data.message,
          position: 'top',
          text2Style: {color: 'red', fontSize: 20},
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: error.message,
        position: 'top',
      });
      console.log(error);
    } finally {
      setDeleteLoading(prev => ({...prev, [id]: false}));
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [updatedCategoryId, setUpdatedCategoryId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  // handleUpdate
  let handleUpdate = async id => {
    setUpdateLoader(true);
    try {
      const response = await fetch(
        `http://192.168.43.78:3000/updateProduct/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': auth?.token,
          },
          body: JSON.stringify(form),
        },
      );
      const data = await response.json();
      if (data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: 'Product Updated updated successfully',
          position: 'top',
          text2Style: {color: 'black', fontSize: 20},
        });
        getAllProducts();
        setModalVisible(false);
      } else if (!data?.success) {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: data.message,
          position: 'top',
          text2Style: {color: 'red', fontSize: 20},
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: error.message,
        position: 'top',
      });
      console.log(error);
    } finally {
      setUpdateLoader(false);
    }
  };

  return (
    <Layout>
      <Toast />

      {/* Modal Starts here  */}
      <Modal visible={isModalVisible} transparent={true}>
        <View
          style={{
            marginTop: 60,
            alignItems: 'center',
          }}>
          <ScrollView
            style={{
              height: '80%',
              borderColor: 'black',
              borderWidth: 1,
              width: '90%',
              backgroundColor: '#FFFFFF',
              borderRadius: 5,
            }}>
            <View>
              <View style={{marginTop: 40}}>
                <InputBox
                  placeholder={'Enter Product Name'}
                  value={form.name}
                  name="name"
                  form={form}
                  setForm={setForm}
                />
                <InputBox
                  placeholder={'Enter Product Description'}
                  value={form.description}
                  name="description"
                  form={form}
                  setForm={setForm}
                />
                <InputBox
                  placeholder={'Enter Product Price'}
                  keyboardType="numeric"
                  value={form.price}
                  name="price"
                  form={form}
                  setForm={setForm}
                />
                <InputBox
                  placeholder={'Enter Product Stock'}
                  value={form.stock}
                  name="stock"
                  form={form}
                  setForm={setForm}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                  paddingBottom: 20,
                }}>
                <CustomButton
                  width={120}
                  title={'Close Modal'}
                  onPress={() => {
                    setModalVisible(false);
                    setForm({category: ''});
                  }}
                />
                <CustomButton
                  width={150}
                  title={
                    updateLoader ? (
                      <BarIndicator count={6} size={25} color="red" />
                    ) : (
                      'Update Product'
                    )
                  }
                  onPress={() => handleUpdate(updatedCategoryId)}
                  disabled={
                    !form.name ||
                    !form.price ||
                    !form.stock ||
                    !form.description
                  }
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Modal ends here  */}

      <View>
        <Text
          style={{
            fontSize: 18,
            fontStyle: 'italic',
            color: 'green',
            textAlign: 'center',
            padding: 5,
          }}>
          All Products
        </Text>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            padding: 10,
          }}>
          <CustomButton
            title={'Create Products'}
            width={300}
            onPress={() => navigation.navigate('CreateProduct')}
          />
        </View>

        <View style={{marginTop: 5}}>
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
              contentContainerStyle={styles.contentContainer}
              style={{height: '80%'}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  tintColor="#ff0000"
                />
              }
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
                          <Text style={styles.textChild}>
                            {' '}
                            {product.price}$
                          </Text>
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
                                    {product?.category?.category.substring(
                                      0,
                                      15,
                                    )}
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
                      {product?.name.length > 15 ? (
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
                        onPress={() => {
                          navigation.navigate('ProductDetails', {
                            product: product,
                          });
                        }}>
                        <Text style={styles.button}>Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(product._id)}>
                        {deleteLoading[product._id] ? (
                          <BallIndicator color="red" size={24} count={8} />
                        ) : (
                          <AntDesign name="delete" size={24} color="red" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(true);
                          setForm({
                            name: product.name,
                            price: product.price.toString(),
                            stock: product.stock.toString(),
                            description: product.description,
                          });
                          setUpdatedCategoryId(product._id);
                        }}>
                        <AntDesign name="edit" size={24} color="blue" />
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
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    color: 'white',
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 3,
    fontWeight: 'bold',
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    color: 'black',
    fontWeight: 'bold',
  },
  textChild: {
    color: 'green',
    fontWeight: 'normal',
  },
});

export default AllProducts;
