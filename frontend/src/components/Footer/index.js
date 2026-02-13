
import React from "react";
import "./index.css"; // Import CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h2>CompanyName</h2>
          <p>
            We provide high-quality products and excellent customer service.
            Your satisfaction is our priority.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: support@company.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Street, City, Country</p>
        </div>

        {/* Social Media */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><img src="https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png" alt="Facebook"/></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/24/ffffff/twitter.png" alt="Twitter"/></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png" alt="Instagram"/></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/24/ffffff/linkedin.png" alt="LinkedIn"/></a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        &copy; 2026 Jabilielthuri. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
