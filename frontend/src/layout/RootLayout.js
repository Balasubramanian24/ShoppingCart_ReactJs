import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import cart from '../assest/images/cart.svg';
import { FaRegAddressCard, FaPhoneAlt, FaEnvelope, FaInfoCircle, FaUser } from 'react-icons/fa';
import './RootLayout.css';

export default function RootLayout() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    //Logout function
    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('login');
    };

    // search function
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://dummyjson.com/products')
        .then((response) => response.json())
        .then((data) => setProducts(data.products))
        .catch((error) => console.error('Error fetching Products:', error));
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate (`/products?query=${query}`);
            setSuggestions([]);
        }
    };  

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if(value.trim() && products.length > 0) {
            const filteredSuggestions = products
            .filter((product) =>
                product.title.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 5);
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.title);
        navigate(`/products?query=${suggestion.title}`);
        setSuggestions([]);
    };

    return (
        <div className="root-layout d-flex flex-column min-vh-100">
            <header className="p-2 text-primary bg-primary border border-primary">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                    <h1><NavLink to="/" className="nav-link px-5 text-white">ShopEasy</NavLink></h1>
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><NavLink to="/" className="nav-link px-2 text-white">Home</NavLink></li>
                        <li><NavLink to="products" className="nav-link px-2 text-white">Products</NavLink></li>
                        <li className="nav-item dropdown">
                            <a href="#"
                               className="nav-link px-2 text-white dropdown-toggle"
                               id="categoryDropdown"
                               role="button"
                               data-bs-toggle="dropdown"
                               aria-expanded="false">
                                Category
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                                <li><NavLink to="/category/beauty" className="dropdown-item">Beauty</NavLink></li>
                                <li><NavLink to="/category/furniture" className="dropdown-item">Furniture</NavLink></li>
                                <li><NavLink to="/category/fragrances" className="dropdown-item">Fragrances</NavLink></li>
                                <li><NavLink to="/category/groceries" className="dropdown-item">Groceries</NavLink></li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to="cart" className="nav-link px-2 text-white">Cart
                                <img src={cart} alt="cart icon" className="px-1"/>
                            </NavLink>
                        </li>
                        <li><NavLink to="help" className="nav-link px-2 text-white">Help</NavLink></li>
                    </ul>
                    <div className="d-flex align-items-center">
                        <form 
                            className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" 
                            role="search"
                            onSubmit={handleSearchSubmit}
                        >               
                            <input 
                                type="search" 
                                className="form-control form-control-dark text-bg-white" 
                                placeholder="Search your products" 
                                aria-label="Search"
                                value={query}
                                onChange={handleSearchChange}
                            />
                            {suggestions.length > 0 && (
                                <ul className="dropdown-menu show">
                                    {suggestions.map((suggestion) => (
                                        <li
                                            key={suggestion.id}
                                            className="dropdown-item"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </form>
                        <div className="text-end">
                            { username ? (
                                <>
                                    <span className="text-white me-2">{username}</span>
                                    <button type="button" className="btn btn-outline-light me-2" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type="button" className="btn btn-outline-light mb-2 mb-lg-0 me-lg-2" onClick={() => navigate("/login")}>
                                        Login
                                    </button>
                                    <button type="button" className="btn btn-warning" onClick={() => navigate("/signup")}>
                                        Sign-up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {/* <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
    <form
        className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 w-100"
        role="search"
        onSubmit={handleSearchSubmit}
    >
        <div className="position-relative">
            <input
                type="search"
                className="form-control form-control-dark text-bg-white"
                placeholder="Search your products"
                aria-label="Search"
                value={query}
                onChange={handleSearchChange}
            />
            {suggestions.length > 0 && (
                <ul className="dropdown-menu show position-absolute w-100">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            className="dropdown-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </form>
    <div className="text-center text-lg-end mt-2 mt-lg-0">
        {username ? (
            <div className="d-flex align-items-center justify-content-center justify-content-lg-end">
                <span className="text-white me-2">{username}</span>
                <button
                    type="button"
                    className="btn btn-outline-light me-2"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        ) : (
            <div className="d-flex flex-column flex-lg-row align-items-center">
                <button
                    type="button"
                    className="btn btn-outline-light mb-2 mb-lg-0 me-lg-2"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
                <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => navigate("/signup")}
                >
                    Sign-up
                </button>
            </div>
        )}
    </div>
</div> */}

                </div>
            </header>
            <main className="flex-grow-1">
            <Outlet />
            </main>
            <footer className="p-2 text-primary bg-primary border border-primary">
                <div className="d-flex flex-wrap justify-content-between align-items-start">
                    <div className="col-md-3 text-white">
                        <h5>ShopEasy</h5>
                        <p className="text-white">© 2025 Shopeasy, Inc</p>
                    </div>
                    <div className="col-md-3">
                        <h5 className="text-white">About</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link text-white">
                                    <FaInfoCircle className="icon" /> About Us
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="help" className="nav-link text-white">
                                    <FaUser className="icon" /> Careers
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h5 className="text-white">Help</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <NavLink to="help" className="nav-link text-white">
                                    <FaPhoneAlt className="icon" /> Customer Support
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="help" className="nav-link text-white">
                                    <FaRegAddressCard className="icon" /> Contact Us
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="consumer-policy" className="nav-link text-white">
                                    <FaInfoCircle className="icon" /> Consumer Policy
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h5 className="text-white">Address</h5>
                        <address className="text-white">
                            No: 1, Pondy - Chennai ECR Road, Pondy <br />
                            PIN Code: 12345 <br />
                            Mobile No: 8765432190
                        </address>
                        <NavLink to="shopeasy@gmail.com" className="nav-link text-white">
                            <FaEnvelope className="icon" /> Email Us
                        </NavLink>
                    </div>
                </div>
            </footer>
        </div>
    );
}