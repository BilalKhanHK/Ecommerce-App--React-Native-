import React from 'react';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import Header from './Header';
import Footer from './Footer';

const Layout = ({children}) => {
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View style={{}}>{children}</View>
      <View
        style={{
          display: 'flex',
          borderTopColor: 'light-gray',
          borderTopWidth: 2,
          justifyContent: 'flex-end',
          position: 'absolute',
          bottom: 0,
          paddingTop: 3,
          paddingHorizontal: 10,
          width: '100%',
        }}>
        <Footer />
      </View>
    </>
  );
};

const styles = StyleSheet.create({});

export default Layout;
