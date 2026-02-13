
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import "./index.css";

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    setToken(null);
    navigate("/login");
  };

  // 🔥 keeps navbar in sync after login
  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  return (
    <nav className="navbar-container">
      <img src="https://res.cloudinary.com/dxjkmsp0u/image/upload/v1770555516/ChatGPT_Image_Feb_8__2026__06_25_16_PM-removebg-preview_y6x7ig.png" className="logo" alt="" />
      
      <GiHamburgerMenu
        className="hamb"
        size={24}
        onClick={() => setMenuOpen(!menuOpen)}
      />

      <div className={`nav-element-container ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-links">Home</Link>

        {!token ? (
          <>
            <Link to="/register" className="nav-links">Register</Link>
            <Link to="/login" className="nav-links">Login</Link>
          </>
        ) : (
          <>
            <Link to="/products" className="nav-links">Products</Link>
            <Link to="/cart" className="nav-links">🛒</Link>
            <Link to="/wishlist" className="nav-links">🖤</Link>

            <Link to="/profile" className="nav-links">Profile</Link>
            <button className="nav-links" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


