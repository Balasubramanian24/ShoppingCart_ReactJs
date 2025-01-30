import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

// Create the context
const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { userId } = useUser();

  //load cart from local storage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);

   //sync with backend if user is logged in

    if(userId && storedCart.length > 0) {
      syncCartWithBackend(storedCart).catch((error) => 
        console.error('Error syncing cart on load:', error)
      );
    }
  }, [userId]);

  //save cart for localstorage
  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Sync cart with backend
  const syncCartWithBackend = async (updatedCart) => {
    if (!userId) {
      console.error("User ID is missing. Cannot sync cart.");
      return;
    }
    try {
      const response = await axios.post( `${import.meta.env.REACT_APP_API_URL}/api/cart/update`, {
        userId,
        cart: updatedCart,
      });
      console.log("Cart synced:", response.data.cart);
      return response.data.cart;
    } catch (error) {
      console.error("Error syncing cart:", error.response?.data || error.message);
      throw error;
    }
  };

  // Add item to cart
  const addToCart = async (product) => {
    const updatedCart = cartItems.some(item => item.id === product.id)
        ? cartItems.map(item => item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        : [...cartItems, { ...product, quantity: 1 }];

    setCartItems(updatedCart); 
    saveCartToLocalStorage(updatedCart);

    // Sync with backend
    try {
        const backendCart = prepareCartForBackend(updatedCart);
        await syncCartWithBackend(backendCart);
    } catch (error) {
        console.error("Failed to sync cart with backend", error);
    }
  };
  
  // Remove item from cart
  const removeFromCart = async (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  
    // Sync with backend
    try {
      const backendCart = prepareCartForBackend(updatedCart);
      await syncCartWithBackend(backendCart);
    } catch (error) {
      console.error("Failed to sync with backend", error);
    }
  };


  //Prepare cart for backend
  const prepareCartForBackend = (cart) => {
    return cart
      .filter(item => item.id && item.quantity > 0)
      .map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
