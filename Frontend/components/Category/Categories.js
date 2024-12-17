import React from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {CategoriesData} from '../../data/CategoryData';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const Categories = () => {
  const navigation = useNavigation();
  return (
    <View style={{paddingVertical: 15, backgroundColor: '#FBFCFC'}}>
      {CategoriesData ? (
        <FlatList
          data={CategoriesData}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    marginHorizontal: 15,
                  }}
                  onPress={() => navigation.navigate('Login')}>
                  <FontAwesome name={item.icon} size={30} color="black" />
                  <Text> {item.name}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Categories;
