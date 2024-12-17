import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const OrderItem = ({order}) => {
  let date = new Date(order.createdAt);
  const readableDate = date.toLocaleDateString();
  const readableTime = date.toLocaleTimeString();

  const [expanded, setExpanded] = useState(false);
  const limit = 2;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  useEffect(() => {
    if (order?.deliveredAt) {
      let delieveryDate = new Date(order?.deliveredAt);
      const readabledelieveryDate = delieveryDate.toLocaleDateString();
      setDeliveryDate(readabledelieveryDate);
      const readabledelieveryTime = delieveryDate.toLocaleTimeString();
      setDeliveryTime(readabledelieveryTime);
    }
  }, [order?.deliveredAt]);

  return (
    <View
      style={{
        padding: 14,
        marginTop: 20,
        backgroundColor: '#FFFFFE',
      }}>
      <View
        style={{
          borderBottomColor: 'black',
          // borderBottomWidth: 1,
          // paddingBottom: 10,
        }}>
        <View
          style={{
            borderBottomColor: '#D9376E',
            borderBottomWidth: 2,
            paddingBottom: 3,
          }}>
          <Text style={styles.textDesign2}>
            Order ID : <Text style={{color: '#D9376E'}}>{order._id}</Text>
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.textDesign2}>Date: {readableDate}</Text>
            <Text style={styles.textDesign2}>Time: {readableTime}</Text>
          </View>
        </View>
        <Text style={styles.textDesign}>
          PaymentMethod :{' '}
          {order.paymentMethod === 'COD' ? (
            <Text style={styles.textChild}>Cash On Delivery</Text>
          ) : (
            <Text style={styles.textChild}>{order.paymentMethod}</Text>
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 2,
          }}>
          <Text style={styles.textDesign}>
            Total Tax : <Text style={styles.textChild}>{order.tax}$</Text>
          </Text>
          <Text style={styles.textDesign}>
            Shipping Charges :{' '}
            <Text style={styles.textChild}>{order.shippingCharges}$</Text>
          </Text>
        </View>
        <Text style={styles.textDesign}>
          Total Amount :{' '}
          <Text style={styles.textChild}>{order.totalAmount}$</Text>
        </Text>
        <Text style={styles.textDesign}>
          Address :{' '}
          <Text style={styles.textChild}>{order.shippingInfo.address}</Text>
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 2,
            marginBottom: 10,
          }}>
          <Text style={styles.textDesign}>
            City :{' '}
            <Text style={styles.textChild}>{order.shippingInfo.city}</Text>
          </Text>
          <Text style={styles.textDesign}>
            Country :{' '}
            <Text style={styles.textChild}>{order.shippingInfo.country}</Text>
          </Text>
        </View>
      </View>
      <ScrollView>
        <View>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 18,
              color: 'black',
              fontStyle: 'italic',
            }}>
            Your Order Items
          </Text>
          {(expanded
            ? order?.orderItems
            : order?.orderItems.slice(0, limit)
          ).map(value => (
            <View
              key={value._id}
              style={{flexDirection: 'row', marginVertical: 6}}>
              <Image
                source={{uri: value.image}}
                style={{height: 100, width: 150}}
              />
              <View style={{marginLeft: 13}}>
                <View>
                  <Text style={styles.textDesign}>Product Name : </Text>
                  <Text
                    style={{
                      color: '#D9376E',
                      textAlign: 'center',
                    }}>
                    {value.name.length > 15 ? (
                      <Text style={{textAlign: 'center'}}>
                        {value.name.substring(0, 15)}....
                      </Text>
                    ) : (
                      value.name
                    )}
                  </Text>
                </View>

                <Text style={styles.textDesign}>
                  Quantity:{' '}
                  <Text style={styles.textChild}>{value.quantity}</Text>
                </Text>
                <Text style={styles.textDesign}>
                  Price : <Text style={styles.textChild}> {value.price}$</Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
        {order.orderItems.length > limit && (
          <TouchableOpacity onPress={toggleExpanded}>
            <Text style={styles.toggleText}>
              {expanded
                ? 'Show Less'
                : `Show All (${order.orderItems.length} items)`}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={{marginTop: 10}}>
        <Text
          style={{
            borderTopColor: 'black',
            borderTopWidth: 0.3,
            color: 'black',
            fontSize: 18,
          }}>
          Order Status :{' '}
          <Text
            style={{
              color: 'green',
              fontSize: 18,
              fontStyle: 'italic',
              textDecorationLine: 'underline',
            }}>
            {order.orderStatus.toUpperCase()}
          </Text>
          {order?.orderStatus === 'delivered' && (
            <View>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                Delievered Date : <Text>{deliveryDate}</Text>
              </Text>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                Delievered Time : <Text>{deliveryTime}</Text>
              </Text>
            </View>
          )}
        </Text>
      </View>
    </View>
  );
};
{
  /* <Text>{JSON.stringify(order)}</Text> */
}

const styles = StyleSheet.create({
  textDesign: {
    color: 'black',
    fontSize: 16,
  },
  textDesign2: {
    color: 'green',
    fontSize: 16,
  },
  textChild: {
    color: 'green',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  toggleText: {
    textAlign: 'center',
    color: '#D9376E',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderItem;
