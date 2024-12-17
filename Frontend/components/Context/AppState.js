import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';

export const appContext = createContext();

const AppState = props => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });

  let getAuth = async () => {
    const userData = await AsyncStorage.getItem('user');
    const tokenData = await AsyncStorage.getItem('token');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setAuth(prevAuth => ({
        ...prevAuth,
        user: parsedUser,
      }));
    }

    if (tokenData) {
      // Assuming token is a string, no need to parse
      const parsedtoken = JSON.parse(tokenData);
      setAuth(prevAuth => ({
        ...prevAuth,
        token: parsedtoken,
      }));
    }
  };

  useEffect(() => {
    getAuth();
  }, []);
  return (
    <appContext.Provider value={{auth, setAuth}}>
      {props.children}
    </appContext.Provider>
  );
};
export default AppState;
