import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Layout from '../../Layout/Layout';
import {appContext} from '../../Context/AppState';
import {useContext} from 'react';

const Notifications = () => {
  const context = useContext(appContext);
  const {auth} = context;
  return (
    <Layout>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 20,
          fontStyle: 'italic',
          color: 'black',
        }}>
        Notifications
      </Text>
      {/* <Text>{JSON.stringify(auth?.user?.notifications)}</Text> */}
      <View>
        {auth?.user?.notifications?.length > 0 ? (
          <View>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 20,
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: 10,
                color: 'black',
              }}>
              You have{' '}
              <Text style={{color: 'green'}}>
                {auth?.user?.notifications.length}
              </Text>{' '}
              Notifications.
            </Text>
            <ScrollView
              style={{
                height: '85%',
                // borderColor: 'red',
                // borderWidth: 2,
                marginTop: 5,
              }}>
              {auth?.user?.notifications?.map(value => (
                <Text
                  key={value._id}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: 10,
                    textAlign: 'center',
                    fontStyle: 'italic',
                    borderRadius: 20,
                    marginBottom: 10,
                  }}>
                  {value.message}
                </Text>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: 'black',
              fontWeight: 'bold',
              color: 'green',
              fontStyle: 'italic',
              marginTop: 50,
            }}>
            You have no Notifications.
          </Text>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default Notifications;
