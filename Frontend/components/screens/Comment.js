import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import Layout from '../Layout/Layout';
import {BallIndicator, BarIndicator} from 'react-native-indicators';
import BallIndicatorComponent from '../Indicators/BallIndicatorComponent';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import InputBox from '../Form/InputBox';
import CustomButton from '../CustomComponents/CustomButton';
import Toast from 'react-native-toast-message';

const Comment = ({route}) => {
  const {id} = route.params;
  const [showIndicator, setShowIndicator] = useState(true);
  const [reviews, setReviews] = useState([]);

  //getting data form Global states
  const context = useContext(appContext);
  const {auth} = context;

  //getProduct
  let getProduct = async () => {
    try {
      const response = await fetch(
        `http://192.168.43.78:3000/getProductOnId/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      console.log(data);
      if (data?.success) {
        setReviews(data?.product?.reviews);
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

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  const [form, setForm] = useState({
    rating: '',
    comment: '',
  });

  const [loading, setLoading] = useState(false);
  //handleReview
  let handleReview = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.43.78:3000/updateReviews/${id}`,
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
          text2: 'Review Added successfully.',
          position: 'top',
          text2Style: {color: 'black', fontSize: 20},
        });
        getProduct();
        setForm({comment: '', rating: ''});
      } else if (!data?.success) {
        Toast.show({
          type: 'error',
          text1: 'Hello',
          text2: data?.message,
          position: 'top',
          text2Style: {color: 'black', fontSize: 16},
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

  useEffect(() => {
    let rating = Number(form.rating);
    if (rating > 5) {
      alert('Please give rating from 0 to 5!');
    }
  }, [form.rating]);

  let disableCondition =
    Number(form.rating) > 5 || (form.rating === '' && form.comment === '');

  return (
    <Layout>
      <Toast />
      <ScrollView style={{height: '27%'}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
          }}>
          <InputBox
            placeholder={'Give rating from 0 to 5'}
            keyboardType={'numeric'}
            value={form.rating}
            name="rating"
            form={form}
            setForm={setForm}
          />
          <InputBox
            placeholder={'Please comment here.'}
            value={form.comment}
            name="comment"
            form={form}
            setForm={setForm}
          />
          <CustomButton
            title={
              loading ? (
                <BarIndicator count={6} size={25} color="red" />
              ) : (
                'Give Review'
              )
            }
            width={300}
            onPress={handleReview}
            disabled={disableCondition}
          />
        </View>
      </ScrollView>
      {showIndicator ? (
        <BallIndicatorComponent title={'Loading Comments'} />
      ) : reviews?.length < 1 ? (
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            backgroundColor: '#FFFFFF',
            fontWeight: 'bold',
            padding: 20,
            textAlign: 'center',
            marginTop: 10,
          }}>
          Reviews Not Found for this Product.
        </Text>
      ) : (
        <ScrollView style={{height: '63%'}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 17,
              color: 'green',
              fontStyle: 'italic',
            }}>
            All Comments
          </Text>
          {reviews?.map(comment => (
            <View
              key={comment._id}
              style={{
                backgroundColor: '#FFFFFF',
                marginVertical: 10,
                padding: 10,
              }}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                Comment By :{' '}
                <Text style={{color: 'green'}}>{comment.name}</Text>
              </Text>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                Given Rating :{' '}
                <Text style={{color: 'green'}}>{comment.rating}</Text>
              </Text>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                Text : <Text style={{color: 'gray'}}>{comment.comment}</Text>
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default Comment;
