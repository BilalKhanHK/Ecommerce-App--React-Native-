import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {appContext} from '../Context/AppState';
import {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import BallIndicatorComponent from '../Indicators/BallIndicatorComponent';
import {BarIndicator} from 'react-native-indicators';

const Header = () => {
  //getting data from global states
  const context = useContext(appContext);
  const {auth} = context;

  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  let handleSearch = async () => {
    Keyboard.dismiss();
    setLoader(true);
    try {
      const response = await fetch(
        `http://192.168.43.78:3000/getProductByKeyword/${searchText}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': auth?.token,
          },
        },
      );
      const data = await response.json();
      console.log(data);
      if (data?.success) {
        setProducts(data?.Product);
        navigation.navigate('SearchProducts', {products: data?.Product});
        setSearchText('');
      } else if (!data?.success) {
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoader(false);
    }
  };
  return (
    <View style={{backgroundColor: '#EEBBC3'}}>
      {loader ? (
        <View
          style={{height: 80, justifyContent: 'center', alignItems: 'centers'}}>
          <BarIndicator count={10} color="red" />
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'black',
              paddingBottom: 2,
            }}>
            Loading....
          </Text>
        </View>
      ) : (
        <View
          style={{
            marginHorizontal: 20,
            borderColor: 'white',
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 40,
            marginVertical: 20,
            borderRadius: 5,
          }}>
          <TextInput
            style={{width: '75%', color: 'black'}}
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <TouchableOpacity
            style={{width: '22%'}}
            onPress={() => handleSearch()}
            disabled={!searchText}>
            <Text
              style={{
                backgroundColor: 'blue',
                color: 'white',
                padding: 10,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Header;
