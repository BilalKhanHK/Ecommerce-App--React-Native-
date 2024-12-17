import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context for the cart
export const CartContext = createContext();

export const CartState = ({children}) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart data from AsyncStorage on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };

    loadCart();
  }, []);

  // Function to update AsyncStorage whenever cartItems changes
  const updateStorage = async newCart => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Failed to update cart in AsyncStorage:', error);
    }
  };

  // Function to add an item to the cart
  const addToCart = item => {
    const updatedCart = [...cartItems, item];
    setCartItems(updatedCart);
    updateStorage(updatedCart);
  };

  // Function to remove an item from the cart
  const removeFromCart = itemId => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart);
    updateStorage(updatedCart);
  };

  // Function to update the quantity of an item in the cart
  const updateItemQuantity = async (itemId, quantity) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === itemId) {
        // If the new quantity is greater than 0, update the quantity
        return {...item, quantity: quantity};
      }
      // Otherwise, return the item as is
      return item;
    });
    setCartItems(updatedCart);
    updateStorage(updatedCart);
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
    updateStorage([]);
  };
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantityBasedProduct, setQuantityBasedProduct] = useState([]);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateItemQuantity,
        totalPrice,
        setTotalPrice,
        quantityBasedProduct,
        setQuantityBasedProduct,
      }}>
      {children}
    </CartContext.Provider>
  );
};
