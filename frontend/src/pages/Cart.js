import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const { cartItems, setCartItems, removeFromCart } = useCart(); 
  const { userId } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartitems = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        if (res.data && Array.isArray(res.data.cart)) {
          setCartItems(res.data.cart);
        } else {
          console.log("Invalid cart data", res.data);
        }
      } catch (error) {
        console.log('Failed to fetch cart items:', error.message);
      }
    }
    fetchCartitems();
  }, [userId, setCartItems]); 

  //quantity increase & decrease function
  const updateQuantity = async (id, delta) => {
    if(!userId) {
      console.error("UserId not found, check User logged in");
      return;
    }

    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            const updatedQuantity = item.quantity + delta;
            
            if (delta === -1) {
              if (updatedQuantity > 0) {
                toast.error("Quantity decreased..", {
                  position: "top-right",
                  autoClose: 2000,
                  theme: "dark"
                });
              } else {
                toast.warn("Product removed from cart", {
                  position: "top-right",
                  autoClose: 2000,
                });
              }
            }

            if (delta === 1) {
              toast.success("Quantity increased..", {
                position: "top-right",
                autoClose: 2000,
              });
            }
  
            return {
              ...item,
              quantity: Math.max(0, updatedQuantity),
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); 
    });

    try {
      const updatedQuantity = cartItems.find((item) => item.id === id)?.quantity + delta;
  
      const payload = {
        userId,
        productId: id,
        quantity: updatedQuantity,
      };

      const res = await axios.put('http://localhost:5000/api/cart/update-cart', payload);
  
      if (res.data && res.data.cart) {
        console.log("Cart updated:", res.data.cart);
      } else {
        console.log("Failed to update cart in backend:", res.data);
      }
    } catch (error) {
      console.error("Error updating quantity:", error.message);
    }

  };

  //calculate total items and total cost
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price, 0  
  );

  //Navigate to payment section
  const proceedToPayment = () => {
    navigate("/payment", { state: { totalCost } });
  }

  return (
    <div className="container mt-5 pb-5">
      <ToastContainer />
        <h1 className="text-center mb-4">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="mb-3">Your cart is empty.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Go Back to Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="text-center">ID</th>
                    <th scope="col">Item</th>
                    <th scope="col" className="text-center">Quantity</th>
                    <th scope="col" className="text-center">Unit Price</th>
                    <th scope="col" className="text-center">Total Price</th>
                    <th scope="col" className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center">{item.id}</td>
                      <td>{item.title}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm ms-2"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </td>
                      <td className="text-center">${item.price}</td>
                      <td className="text-center">
                        ${(item.quantity && item.price)
                          ? (item.quantity * item.price).toFixed(2)
                          : '0.00'}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
                <h5>Total Items: <span className="fw-bold">{totalItems}</span></h5>
              </div>
              <div className="col-12 col-md-6 text-center text-md-end">
                <h5>Total Cost: <span className="fw-bold">${totalCost.toFixed(2)}</span></h5>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button className="btn btn-success btn-lg" onClick={proceedToPayment}>
                Proceed to Payment
              </button>
            </div>
          </>
        )}
    </div>
  );
};

export default Cart;
