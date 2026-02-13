import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./product.css";

const Products = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // ✅ READ CATEGORY ID FROM URL
  const searchParams = new URLSearchParams(location.search);
  const categoryIdFromUrl = Number(searchParams.get("category"));

  const goToDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/cart/add/",
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product added to cart successfully");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        const res = await axios.get("http://127.0.0.1:8000/wishlist/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const item = res.data.find((i) => i.product === productId);
        if (item) {
          await axios.delete(
            `http://127.0.0.1:8000/wishlist/delete/${item.id}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(
          "http://127.0.0.1:8000/wishlist/add/",
          { product_id: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/products/category-wise/"
        );

        const matchedCategory = res.data.find(
          (cat) => cat.id === categoryIdFromUrl
        );

        if (matchedCategory) {
          setSelectedCategory(matchedCategory);
        } else if (res.data.length > 0) {
          setSelectedCategory(res.data[0]);
        }
      } catch (err) {
        setError("Session expired. Please login again.");
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/wishlist/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data.map((item) => item.product));
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategoryProducts();
    fetchWishlist();
  }, [categoryIdFromUrl, token]);

  const searchFilter = (e) => {
    setSearch(e.target.value);
  };

  const filteredProducts = selectedCategory?.products.filter((prod) =>
    prod.name.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="products-container">
      <div className="products-panel">
        <input
          type="search"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={searchFilter}
        />

        <h1 className="new-arrival">
          {selectedCategory?.name || "Products"}
        </h1>

        {selectedCategory ? (
          filteredProducts.length > 0 ? (
            <div className="products-list">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="product-card">
                  <div
                    className="heart-con"
                    onClick={() => toggleWishlist(prod.id)}
                  >
                    {wishlist.includes(prod.id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </div>

                  <h3
                    className="prod-name"
                    onClick={() => goToDetails(prod.id)}
                  >
                    -{prod.name}-
                  </h3>

                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="prod-image"
                    onClick={() => goToDetails(prod.id)}
                  />

                  <div className="ratings-con">
                    <FaStar className="star" />
                    <span className="num">{Number(prod.ratings)}</span>
                  </div>

                  <p className="prod-desc">{prod.description}</p>
                  <p className="prod-price">MRP: {prod.price} /-</p>

                  <button
                    className="add-cart"
                    onClick={() => addToCart(prod.id)}
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No matching products found</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Products;
