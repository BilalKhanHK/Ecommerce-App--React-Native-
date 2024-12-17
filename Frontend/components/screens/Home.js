import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
} from 'react-native';
import Layout from '../Layout/Layout';
import Categories from '../Category/Categories';
import Banner from '../Banner/Banner';
import Products from '../Products/Products';
import Header from '../Layout/Header';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const context = useContext(appContext);
  const {auth} = context;

  return (
    <Layout>
      <Header />
      <ScrollView style={{height: '80%'}} showsVerticalScrollIndicator={false}>
        <Categories />
        <Banner />
        <Products />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default Home;
