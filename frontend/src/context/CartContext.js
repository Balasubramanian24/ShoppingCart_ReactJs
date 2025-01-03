import { createContext, useState, useContext } from "react";
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

  const prepareCartForBackend = (cartItems) => {
    return cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));
  };

  // Sync cart with backend
  const syncCartWithBackend = async (updatedCart) => {
    if (!userId) {
      console.error("User ID is missing. Cannot sync cart.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/cart/update", {
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
    let updatedCart;
    // Calculate updatedCart explicitly
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      updatedCart = existingItem
        ? prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevItems, { ...product, quantity: 1 }];
      return updatedCart;
    });
    // Sync with backend after updatedCart is prepared
    try {
      await syncCartWithBackend(prepareCartForBackend(updatedCart));
      alert("Cart updated successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to update cart");
    }
  };
  
  
    // Remove item from cart
    const removeFromCart = async (id) => {
      let updatedCart;
      setCartItems((prevItems) => {
        updatedCart = prevItems.filter((item) => item.id !== id)
        return updatedCart;
      })

      // Sync with backend after updatedCart is prepared
      try {
        await syncCartWithBackend(prepareCartForBackend(updatedCart));
        alert("Cart updated successfully");
      } catch (error) {
        console.log(error);
        alert("Failed to update cart");
      }
    }

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
