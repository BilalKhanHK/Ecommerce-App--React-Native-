import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView, Modal} from 'react-native';
import Layout from '../Layout/Layout';
import InputBox from '../Form/InputBox';
import CustomButton from '../CustomComponents/CustomButton';
import Toast from 'react-native-toast-message';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';

const CreateCategory = () => {
  const [form, setForm] = useState({
    category: '',
  });

  const [loading, setLoading] = useState(false);
  //getting data form Global states
  const context = useContext(appContext);
  const {auth} = context;

  //handleCreateCategory
  let handleCreateCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.43.78:3000/createCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: 'Category created successfully',
          position: 'top',
          text2Style: {color: 'black', fontSize: 20},
        });
        getAllCategories();
        setForm({category: ''});
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
      setLoading(false);
    }
  };

  const [allCategories, setAllCategories] = useState([]);
  const [allCategoriesLoader, setAllCategoriesLoader] = useState(true);

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
      setAllCategories(data?.categories);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: error.message,
        position: 'top',
      });
      console.log(error);
    } finally {
      setAllCategoriesLoader(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllCategories();
    }
  }, [auth]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [updatedCategoryId, setUpdatedCategoryId] = useState(null);
  const [updateLoader, setUpdateLoader] = useState(false);

  //handleUpdate
  let handleUpdate = async id => {
    setUpdateLoader(true);
    try {
      const response = await fetch(
        `http://192.168.43.78:3000/updateCategory/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': auth?.token,
          },
          body: JSON.stringify({category: form.category}),
        },
      );
      const data = await response.json();
      if (data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: 'Category updated successfully',
          position: 'top',
          text2Style: {color: 'black', fontSize: 20},
        });
        getAllCategories();
        setModalVisible(false);
        setForm({category: ''});
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

  const [deleteLoading, setDeleteLoading] = useState({});
  //handleDelete
  let handleDelete = async id => {
    setDeleteLoading(prev => ({...prev, [id]: true}));
    try {
      const response = await fetch(
        `http://192.168.43.78:3000/deleteCategory/${id}`,
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
        getAllCategories();
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

  return (
    <Layout>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <Toast />

        {/* Modal Starts here  */}
        <Modal visible={isModalVisible} transparent={true}>
          <View
            style={{
              //   position: 'ablsoute',
              //   top: '30%',
              marginTop: 60,
              alignItems: 'center',
            }}>
            <ScrollView
              style={{
                height: '50%',
                borderColor: 'black',
                borderWidth: 1,
                width: '90%',
                backgroundColor: '#FFFFFF',
                borderRadius: 5,
              }}>
              <View>
                <View style={{marginTop: 40}}>
                  <InputBox
                    placeholder={'Enter category'}
                    value={form.category}
                    name="category"
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
                        'Update Category'
                      )
                    }
                    onPress={() => handleUpdate(updatedCategoryId)}
                    disabled={!form.category}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* Modal ends here  */}

        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: 'bold',
            marginVertical: 10,
          }}>
          Create Category
        </Text>
        <InputBox
          placeholder={'Enter category'}
          value={form.category}
          name="category"
          form={form}
          setForm={setForm}
        />

        <CustomButton
          title={
            loading ? (
              <BarIndicator count={6} size={25} color="red" />
            ) : (
              'Create Category'
            )
          }
          width={220}
          onPress={() => handleCreateCategory()}
          disabled={!form.category}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          height: '65%',
          marginTop: 20,
        }}>
        <View
          style={{
            alignItems: 'center',
            paddingTop: 20,
            paddingBottom: 30,
            height: '100%',
          }}>
          {allCategoriesLoader ? (
            <View>
              <BallIndicator />
              <Text
                style={{
                  color: 'green',
                  fontSize: 18,
                  marginTop: 10,
                  fontStyle: 'italic',
                }}>
                Loading Categories....
              </Text>
            </View>
          ) : allCategories?.length > 0 ? (
            allCategories.map((category, index) => (
              <View
                key={index}
                style={{
                  marginVertical: 5,
                  backgroundColor: '#FFFFFF',
                  width: '90%',
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: 'black', padding: 15, fontSize: 16}}>
                  {category.category.length > 15 ? (
                    <Text>
                      {category.category.substring(0, 20)}
                      <Text
                        style={{
                          color: 'green',
                          fontWeight: 'bold',
                          fontSize: 25,
                        }}>
                        ....
                      </Text>
                    </Text>
                  ) : (
                    category.category
                  )}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginRight: 20,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                      setForm({category: category.category});
                      setUpdatedCategoryId(category._id);
                    }}>
                    <AntDesign
                      name="edit"
                      size={24}
                      color="#0d6efd"
                      style={{marginRight: 20}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(category._id)}>
                    {deleteLoading[category._id] ? (
                      <BallIndicator color="red" size={24} count={8} />
                    ) : (
                      <AntDesign name="delete" size={24} color="red" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text
              style={{
                backgroundColor: '#FFFFFF',
                color: 'black',
                width: '90%',
                borderRadius: 20,
                padding: 15,
                textAlign: 'center',
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}>
              No category exists
            </Text>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default CreateCategory;
