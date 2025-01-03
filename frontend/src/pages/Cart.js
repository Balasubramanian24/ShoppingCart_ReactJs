import { useCart } from "../context/CartContext"; 
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart(); 

  //calculate total items and total cost
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price, 0  
  );

  return (
    <div className="container mt-5">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">
            Go Back to Shopping
          </Link>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" className="text-center">ID</th>
              <th scope="col">Item</th>
              <th scope="col" className="text-center">Quantity</th>
              <th scope="col" className="text-center">Unit Price</th>
              <th scope="col" className="text-center">Total Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td className="text-center">{item.id}</td>
                <td>{item.title}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-center">${item.price}</td>
                <td className="text-center">
                  ${(item.quantity && item.price)
                    ? (item.quantity * item.price).toFixed(2)
                    : '0.00'}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromCart(item.id)} // Remove from cart
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="d-flex justify-content-between mt-3">
        <h5>Total Items: {totalItems}</h5>
        <h5>Total Cost: ${totalCost.toFixed(2)}</h5>
      </div> 
    </div>
  );
};

export default Cart;
