import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
const { id } = useParams(); //get products from URL
const [product, setProduct] = useState(null);
const [error, setError] = useState(null); 
const { addToCart } = useCart(); //Destructure addToCart from CartContext

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details.");
        }
        const data = await response.json();
        setProduct(data); 
      } catch (error) {
        setError(error.message); 
      }
    };

    fetchProduct();
  }, [id]);

//handle Add to Cart button
  const handleAddToCart = () => {
    if(product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.thumbnail,
      });

//showing Toast notification
      toast.success(`${product.title} added to your cart.!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

//Handle Error or Load state

  if (error) {
    return <div className="text-center mt-5">Error: {error}</div>;
  }
  if (!product) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="img-fluid rounded p-2 border border-black shadow mb-5 bg-body-tertiary rounded"
          />
        </div>
        <div className="col-md-6">
          <h1 className="display-4">{product.title}</h1>
          <p className="lead">{product.description}</p>
          <h4 className="text-success">${product.price}</h4>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Rating:</strong> {product.rating} ★
          </p>
          <p>
            <strong>Stock:</strong> {product.stock} units available
          </p>

          {/* product reviews */}

          <h3 className="mt-5">Customer Reviews:</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <ul className="list-group">
              {product.reviews.map((review, index) => (
                <li className="list-group-item list-group-item-action list-group-item-light" key={index}>
                  <strong>{review.reviewerName}:</strong> {review.comment}
                  <br />
                  <small className="text-muted">Rating: {review.rating} ★ | {new Date(review.date).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ):
          (
            <p>No review for the Product, be the first to review the Product.</p>
          )}
          <br />
          <button 
            className="btn btn-primary btn-md"
            onClick={handleAddToCart}
            >
            Add to Cart</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
