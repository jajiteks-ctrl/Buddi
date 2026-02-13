import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Products from "./components/Products"
import Home from "./components/Home"
import Cart from "./components/Cart"
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import Wishlist from "./components/Wishlist";
import ProductDetail from "./components/ProductDetail";
import Footer from "./components/Footer";
import Profile from "./components/Profile";


function App() {
  return (
   < Router>

     <Navbar/>
     
      <Routes>
        <Route path = "/" element = {<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProtectedRoute>
          <Products />
        </ProtectedRoute>} />
         <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path = "/cart" element = {<ProtectedRoute><Cart/></ProtectedRoute>} />
        <Route path = "/profile" element = {<ProtectedRoute><Profile/></ProtectedRoute>} />
       <Route path = "/checkout" element = {<ProtectedRoute><Checkout/></ProtectedRoute>} />
       <Route path = "/orders" element = {<ProtectedRoute><Orders/></ProtectedRoute>} />
       <Route path = "/wishlist" element = {<ProtectedRoute><Wishlist/></ProtectedRoute>} />
      </Routes>

      <Footer/>
    </Router>
  );
}

export default App;
