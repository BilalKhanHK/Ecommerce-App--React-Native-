import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Signin from './components/screens/Signin';
import ProductDetails from './components/screens/ProductDetails';
import Cart from './components/screens/Cart';
import Checkout from './components/screens/Checkout';
import Payment from './components/screens/Payment';
import Account from './components/screens/Account';
import Notifications from './components/screens/Account/Notifications';
import Profile from './components/screens/Account/Profile';
import MyOrders from './components/screens/Account/MyOrders';
import Dashboard from './components/screens/Admin/Dashboard';
import AppState from './components/Context/AppState';
import UpdatePassword from './components/screens/UpdatePassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BallIndicatorComponent from './components/Indicators/BallIndicatorComponent';
import CreateCategory from './components/Products/CreateCategory';
import AllProducts from './components/Products/AllProducts';
import CreateProduct from './components/Products/CreateProduct';
import AllUsers from './components/screens/Admin/AllUsers';
import Comment from './components/screens/Comment';
import {CartState} from './components/Context/CartState';
import AllOrders from './components/screens/Admin/AllOrders';
import SearchProducts from './components/screens/SearchProducts';
import TotalAdmins from './components/screens/Admin/TotalAdmins';
import {StripeProvider} from '@stripe/stripe-react-native';

const App = () => {
  const Stack = createNativeStackNavigator();

  const [token, setToken] = useState(null);
  const [loading, isLoading] = useState(true);

  let getToken = async () => {
    let data = await AsyncStorage.getItem('token');
    setToken(data);
    isLoading(false);
  };

  useEffect(() => {
    getToken();
  }, []);

  let key =
    'pk_test_51Pp8zKP7GojuwLX9MsGvc9pgJI3VzVsBYBerEEBFSVkZS6Wb65sqz28speN01CiOc44M45VrzaB6OP80f03vlWCq00upEC61so';
  return (
    <StripeProvider publishableKey={key}>
      <CartState>
        <AppState>
          {loading ? (
            <BallIndicatorComponent />
          ) : (
            <NavigationContainer>
              <Stack.Navigator initialRouteName={token ? 'Home' : 'Login'}>
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Signin"
                  component={Signin}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="ProductDetails"
                  component={ProductDetails}
                />
                <Stack.Screen name="Cart" component={Cart} />
                <Stack.Screen name="Checkout" component={Checkout} />
                <Stack.Screen name="Payment" component={Payment} />
                <Stack.Screen name="Account" component={Account} />
                <Stack.Screen name="Notifications" component={Notifications} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="MyOrders" component={MyOrders} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen
                  name="UpdatePassword"
                  component={UpdatePassword}
                />
                <Stack.Screen
                  name="CreateCategory"
                  component={CreateCategory}
                />
                <Stack.Screen name="AllProducts" component={AllProducts} />
                <Stack.Screen name="CreateProduct" component={CreateProduct} />
                <Stack.Screen name="AllUsers" component={AllUsers} />
                <Stack.Screen name="Comment" component={Comment} />
                <Stack.Screen name="AllOrders" component={AllOrders} />
                <Stack.Screen
                  name="SearchProducts"
                  component={SearchProducts}
                />
                <Stack.Screen name="TotalAdmins" component={TotalAdmins} />
              </Stack.Navigator>
            </NavigationContainer>
          )}
        </AppState>
      </CartState>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
