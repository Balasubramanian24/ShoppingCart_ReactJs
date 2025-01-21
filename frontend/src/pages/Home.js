import "bootstrap/dist/js/bootstrap.bundle.min.js";
import electronics from "../assest/images/electronics.jpg"
import mens from "../assest/images/mens.jpg"
import jewellery from "../assest/images/jewellery.jpg"
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

    if(!username) {
      navigate('/login');
    }

    return (
      <div className="home text-center">
        <div className="container mt-5">
          <h1>Hi, {username}</h1>
          <h1 className="mb-4">Welcome to ShopEasy</h1>
          <p className="lead">Your one-stop solution for all your needs.</p>
          <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={electronics} className="d-block w-100" alt="electronic image" />
              </div>
              <div className="carousel-item">
                <img src={mens} className="d-block w-100" alt="mens clothing image" />
              </div>
              <div className="carousel-item">
                <img src={jewellery} className="d-block w-100" alt="jewellery image" />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          <br /><br />
        </div>
      </div>
    );
}
