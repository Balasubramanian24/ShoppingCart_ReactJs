  import { useState, useEffect } from "react";
  import { useCart } from "../context/CartContext";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { Pagination } from "react-bootstrap";
  import { useSearchParams } from "react-router-dom";
  import _ from "lodash";

  const ProductLayout = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [sortOption, setSortOption] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const { addToCart, syncCartWithBackend } = useCart();

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("query") || "";

    useEffect(() => {
      const loadProducts = async () => {
        try {
          const response = await fetch("https://dummyjson.com/products");
          const data = await response.json();
          setProducts(data.products);
          setFilteredProducts(data.products);
        } catch (error) {
          console.error("Error fetching Products:", error);
        }
      };

      loadProducts();
    }, []);

    useEffect(() => {
      console.log("Products:", products);
      console.log("Search Query:", searchQuery);
      
      const debouncedSearch = _.debounce(() => {
        let filtered = products.filter(
          (product) =>
            product.price >= priceRange.min &&
            product.price <= priceRange.max &&
            product.title?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
        );

        if (sortOption) {
          filtered = filtered.sort((a, b) => {
            if (sortOption === "price") return a.price - b.price;
            if (sortOption === "discount") return b.discountPercentage - a.discountPercentage;
            return 0;
          });
        }

        setFilteredProducts(filtered);
      }, 500);

      debouncedSearch(); 

      return () => debouncedSearch.cancel(); 
    }, [priceRange, sortOption, searchQuery, products]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleAddToCart = async (product) => {
      await addToCart(product);
      toast.success(`${product.title} added to your Cart!`, 
      {
        position: "top-center",
        autoClose: 3000,
      });

    };

    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-3 p-3 border border-start-0">
            {/* Filter and Sorting Section */}
            <h4>Filters</h4>
            <div className="mb-3">
              <label>Min Price:</label>
              <input
                type="number"
                className="form-control"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number(e.target.value) })
                }
              />
            </div>
            <div className="mb-3">
              <label>Max Price:</label>
              <input
                type="number"
                className="form-control"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: Number(e.target.value) })
                }
              />
            </div>
            <h4>Sorting</h4>
            <select
              className="form-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">None</option>
              <option value="price">Price: Low to High</option>
              <option value="discount">Discount: High to Low</option>
            </select>
          </div>

          <div className="col-md-9">
            {/* Display Products */}
            <h1 className="text-center mb-4">Products</h1>
            <div className="row">
              {currentProducts.length === 0 ? (
                <div className="col-12 text-center">
                  <h4>No products match your search criteria.</h4>
                </div>
              ) : (
                currentProducts.map((product) => (
                  <div key={product.id} className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={product.thumbnail}
                        className="card-img-top"
                        alt={product.title}
                        style={{ height: "200px", objectFit: "contain" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text text-truncate">{product.description}</p>
                        <p className="card-text">
                          <strong>Price:</strong> ${product.price}
                        </p>
                        <p className="card-text">
                          <strong>Discount:</strong> {product.discountPercentage}%
                        </p>
                        <a
                          href={`/products/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          View Product
                        </a>
                        <button
                          className="btn btn-outline-primary m-3"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Pagination>
              <Pagination.Prev
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              />
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item
                  key={page}
                  active={page + 1 === currentPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              />
            </Pagination>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  };

  export default ProductLayout;
