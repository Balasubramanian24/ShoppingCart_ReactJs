import { Route, createBrowserRouter, 
  createRoutesFromElements, RouterProvider,
} from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

//Pages
import Home from "./pages/Home";
import Category from "./pages/Category"
import ErrorPage from "./pages/ErrorPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Signup from "./auth/signup";
import Login from "./auth/login";
import Payment from "./pages/Payment";
import Help from "./helpSection/Help";


//Layout
import RootLayout from "./layout/RootLayout";
import ProductLayout from "./layout/ProductLayout";
import CategoryLayout from "./layout/CategoryLayout";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="products">
        <Route index element={<ProductLayout />} />
        <Route path=":id" element={<ProductDetails />}/>
      </Route>
      <Route path="category" element={<CategoryLayout />}>
        <Route path=":CategoryName" element={<Category />} />
      </Route>
      <Route path="cart" element={<Cart/>} />
      <Route path="help" element={<Help />} />
      <Route path="signup" element={< Signup/>} />
      <Route path="login" element={<Login/>} />
      <Route path="payment" element={<Payment />} />
      <Route path="*" element={<ErrorPage />} />
    </Route> 
  )
);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <RouterProvider router={router} />
    </Elements>
  )
}

export default App;
