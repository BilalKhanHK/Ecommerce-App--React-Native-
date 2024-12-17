import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Layout from '../Layout/Layout';
import InputBox from '../Form/InputBox';
import {launchImageLibrary} from 'react-native-image-picker';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import BallIndicatorComponent from '../Indicators/BallIndicatorComponent';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Categories from './../Category/Categories';

const CreateProduct = ({navigation}) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(null);

  //accessing global states from context
  const context = useContext(appContext);
  const {auth} = context;

  const [showIndicator, setShowIndicator] = useState(false);

  // Image picker function
  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        setImageUrl(response.assets[0]);
      }
    });
  };
  //registration Function
  let handleCreateProduct = async () => {
    setShowIndicator(true);
    try {
      //setting Data
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('stock', form.stock);
      formData.append('category', value);

      // Append image if selected
      if (imageUrl) {
        formData.append('file', {
          uri: imageUrl.uri,
          type: imageUrl.type,
          name: imageUrl.fileName,
        });
      }
      const response = await fetch('http://192.168.43.78:3000/createProduct', {
        method: 'POST',
        headers: {
          'auth-token': auth?.token,
        },
        body: formData,
      });
      const data = await response.json();
      // console.log(data);
      if (data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: data?.message,
          position: 'top',
          text2Style: {fontSize: 14, color: 'green'},
        });
        navigation.navigate('AllProducts');
        setForm({
          name: '',
          price: '',
          description: '',
          stock: '',
        });
        setImageUrl(null);
        setValue(null);
      } else if (!data?.success) {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: data?.message,
          position: 'top',
          text2Style: {fontSize: 14, color: 'red'},
        });
        console.log(data);
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
      setShowIndicator(false);
    }
  };
  const ValidtionCondition =
    !form.name ||
    !form.price ||
    !form.description ||
    !form.stock ||
    !value ||
    !imageUrl;

  //getAllCategories
  let getAllCategories = async () => {
    try {
      const response = await fetch(
        'http://192.168.43.78:3000/getAllCategories',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': auth?.token,
          },
        },
      );
      const data = await response.json();
      //   alert('running');
      //   console.log(data);
      if (data?.success) {
        const formattedItems = data.categories.map(category => ({
          label: category.category,
          value: category._id,
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: error.message,
        position: 'top',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllCategories();
    }
  }, [auth, imageUrl]);

  return (
    <Layout>
      <View style={{marginTop: 20}}>
        {showIndicator ? (
          <BallIndicatorComponent title={'Creating Product'} />
        ) : (
          <View>
            {items?.length > 0 && (
              <View style={{alignItems: 'center', marginBottom: 10}}>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder="Select Category"
                  containerStyle={{width: '80%'}}
                />
              </View>
            )}
            <ScrollView
              style={{
                // marginBottom: 150,
                height: '78%',
              }}>
              <Toast />
              {/* <Text>{JSON.stringify(items)}</Text> */}

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 13,
                }}>
                {imageUrl ? (
                  <Image
                    source={{uri: imageUrl?.uri}}
                    style={{width: 300, height: 130, borderRadius: 20}}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      borderColor: 'black',
                      borderWidth: 1,
                      width: 300,
                      height: 130,
                    }}></View>
                )}
                <TouchableOpacity
                  onPress={handleChoosePhoto}
                  style={{
                    backgroundColor: '#0d6efd',
                    padding: 12,
                    borderRadius: 10,
                    width: '78%',
                    marginVertical: 10,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    {imageUrl ? 'Update Photo' : 'Upload Photo'}
                  </Text>
                </TouchableOpacity>
                <InputBox
                  placeholder={'Enter Product Name'}
                  value={form.name}
                  name="name"
                  form={form}
                  setForm={setForm}
                />
                <InputBox
                  placeholder={'Enter Product Price'}
                  keyboardType={'numeric'}
                  value={form.price}
                  name="price"
                  form={form}
                  setForm={setForm}
                />

                <InputBox
                  placeholder={'Enter Product Stock'}
                  keyboardType={'numeric'}
                  value={form.stock}
                  name="stock"
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

                <TouchableOpacity
                  onPress={handleCreateProduct}
                  disabled={ValidtionCondition}
                  style={[
                    {
                      backgroundColor: 'black',
                      width: '55%',
                      padding: 12,
                      borderRadius: 15,
                      marginVertical: 10,
                    },
                  ]}>
                  <Text
                    style={[
                      {color: 'white', textAlign: 'center'},
                      ValidtionCondition && styles.validationStyle,
                    ]}>
                    Create Product
                  </Text>
                </TouchableOpacity>
                {ValidtionCondition && (
                  <Text style={{color: 'red', textAlign: 'center'}}>
                    Please fill all fields
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default CreateProduct;
