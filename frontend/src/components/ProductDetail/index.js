import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./index.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `http://127.0.0.1:8000/products/${id}/`
      );
      setProduct(res.data);
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p className="loading">Loading...</p>;

  return (
    <div className="single-product-page">
      <div className="single-product-wrapper">

        {/* IMAGE */}
        <div className="single-product-right">
          <img src={product.image} alt={product.name} />
        </div>

        {/* CONTENT */}
        <div className="single-product-left">
          <h1 className="product-name">{product.name}</h1>

          <p className="short-desc">
            Carefully crafted product designed to deliver quality, reliability,
            and long-lasting performance for everyday use.
          </p>

          <div className="rating">
            Ratings :<FaStar />
            <span>{product.ratings}</span>
          </div>

          <p className="price">₹ {product.price}</p>

          <div className="features">
            <p>✔ Premium quality materials | ✔ Designed for daily use</p>
            <p>✔ Quality tested & verified | ✔ Suitable for all occasions</p>
          </div>

          <div className="trust-box">
            <p className="stock">🔥 Limited stock available</p>
            <p className="trust">✅ 100% Original Product</p>
            <p className="secure">🔒 Secure & trusted checkout</p>
          </div>

          <div className="actions">
            <button className="add-cart-btn">Add to Cart</button>
            <button className="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </div>

      {/* EXTRA INFO */}
      {/* EXTRA INFO */}
{/* EXTRA INFO */}
<div className="extra-info">

  <div className="extra-info-grid">

    {/* LEFT COLUMN */}
    <div className="extra-left">

      <div className="info-section">
        <h2>Categories</h2>
        <div className="category-list">
          <span className="category-item">Electronics</span>
          <span className="category-item">Accessories</span>
          <span className="category-item">Trending</span>
          <span className="category-item">Best Sellers</span>
        </div>
      </div>

      <div className="info-section">
        <h2>Delivery Information</h2>
        <ul className="info-list">
          <li>🚚 Free delivery in 3–5 business days</li>
          <li>📦 Cash on Delivery available</li>
          <li>🌍 Shipping across India</li>
        </ul>
      </div>

    </div>

    {/* RIGHT COLUMN */}
    <div className="extra-right">

      <div className="info-section">
        <h2>Return Policy</h2>
        <ul className="info-list">
          <li>🔄 7-day easy return</li>
          <li>✅ Product must be unused</li>
          <li>💳 Refund within 3–5 working days</li>
        </ul>
      </div>

      <div className="info-section highlight-box">
        <h2>Need Help?</h2>
        <p className="info-para">📞 Customer support available 24/7</p>
        <p className="info-para">💬 Chat with our support team anytime</p>
      </div>

    </div>

  </div>
</div>


    </div>
  );
};

export default ProductDetail;
