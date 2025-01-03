import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
  const { CategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://dummyjson.com/products/category/${CategoryName.toLowerCase()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Data..!");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [CategoryName]);

  // Handle Add to Cart button click
    const handleAddToCart = (product) => {
      addToCart(product); // Add product to cart
  
      // Show toast notification after adding to cart
      toast.success(`${product.title} added to your cart!`, {
        position: "top-center",
        autoClose: 3000, // Duration for the toast
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

  return (
    <div className="container">
      <h2 className="text-center">
        Products in {CategoryName.charAt(0).toUpperCase() + CategoryName.slice(1)}
      </h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : products.length > 0 ? (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-3" key={product.id}>
              <div className="card">
                <img
                  src={product.thumbnail}
                  className="card-img-top"
                  alt={product.title}
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">${product.price}</p>
                  <p className="card-text text-truncate">{product.description}</p>
                  {/* Use Link for View Product */}
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-primary"
                  >
                    View Product
                  </Link>
                  <button 
                    className="btn btn-outline-primary px-3 mx-5"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          No products found for this category.
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Category;
