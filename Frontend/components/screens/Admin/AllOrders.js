import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import Layout from '../../Layout/Layout';
import {appContext} from '../../Context/AppState';
import {useContext} from 'react';
import BallIndicatorComponent from '../../Indicators/BallIndicatorComponent';
import AllOrdersAdmin from './AllOrdersAdmin';

const AllOrders = () => {
  //getting data form global states
  const context = useContext(appContext);
  const {auth} = context;

  const [loader, setLoader] = useState(true);
  const [orders, setOrders] = useState([]);

  //getAllOrders
  let getAllOrders = async () => {
    try {
      const response = await fetch('http://192.168.43.78:3000/AllOrders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': auth?.token,
        },
      });
      const data = await response.json();
      //   alert('running');
      //   console.log(data);
      if (data?.success) {
        setOrders(data?.orders);
      } else if (!data?.success) {
        alert(data?.message);
      }
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
  //   useEffect(() => {
  //     getAllOrders();
  //   });

  return (
    <Layout>
      {loader ? (
        <BallIndicatorComponent title={'Loading All Orders'} />
      ) : (
        <ScrollView style={{height: '84%', marginTop: 5}}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontStyle: 'italic',
              color: 'black',
              fontSize: 20,
            }}>
            All Orders
          </Text>
          {orders?.length > 0 ? (
            orders.map(order => (
              <AllOrdersAdmin
                order={order}
                key={order._id}
                getAllOrders={getAllOrders}
              />
            ))
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                marginTop: 60,
                color: 'green',
                fontStyle: 'italic',
              }}>
              No Orders found
            </Text>
          )}
        </ScrollView>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default AllOrders;
