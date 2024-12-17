import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import Layout from '../../Layout/Layout';
import {OrderData} from '../../../data/OrderData';
import OrderItem from '../../Form/OrderItem';
import {appContext} from '../../Context/AppState';
import {useContext} from 'react';
import BallIndicatorComponent from '../../Indicators/BallIndicatorComponent';
import CustomButton from '../../CustomComponents/CustomButton';

const MyOrders = () => {
  //getting data from global states
  const context = useContext(appContext);
  const {auth} = context;

  const [loader, setLoader] = useState(true);
  const [orders, setOrders] = useState([]);

  //getAllOrders
  let getAllOrders = async () => {
    try {
      const response = await fetch('http://192.168.43.78:3000/getOrders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
      });
      const data = await response.json();
      //   alert('running');
      //   console.log(data);
      setOrders(data?.orders);
    } catch (error) {
      alert(error.message);
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllOrders();
    }
  }, [auth]);
  return (
    <Layout>
      <View style={{alignItems: 'center', padding: 15}}>
        <Text
          style={{
            fontSize: 22,
            color: 'black',
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}>
          My Orders
        </Text>
      </View>
      {loader ? (
        <BallIndicatorComponent title={'Loading Orders'} />
      ) : (
        <View>
          <ScrollView
            style={{
              height: '84%',
            }}>
            {/* <Text style={{padding: 20}}>{JSON.stringify(orders[4])}</Text> */}
            {orders?.length > 0 ? (
              orders.map(order => {
                return <OrderItem key={order._id} order={order} />;
              })
            ) : (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 25,
                    color: 'red',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                    fontStyle: 'italic',
                  }}>
                  You have no orders
                </Text>
                <CustomButton
                  title={'Refresh'}
                  onPress={getAllOrders}
                  width={200}
                />
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* <Text>{JSON.stringify(OrderData)}</Text> */}
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default MyOrders;
