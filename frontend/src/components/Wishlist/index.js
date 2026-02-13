import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./index.css";

const Wishlist = () => {
  const token = localStorage.getItem("token");
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);

  const getWishlist = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/wishlist/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist(res.data);
    } catch (err) {
      console.log(err);
      setError("Unable to load wishlist");
    }
  }, [token]);

  useEffect(() => {
    getWishlist();
  }, [getWishlist]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>

      {wishlist.length > 0 ? (
        <div className="wishlist-list">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <img
                src={item.product_image}
                alt={item.product_name}
                className="wishlist-img"
              />

              <h3>{item.product_name}</h3>
              <p>
                <b>₹ {item.product_price}</b>
              </p>

              <button
                className="remove-btn"
                onClick={async () => {
                  await axios.delete(
                    `http://127.0.0.1:8000/wishlist/delete/${item.id}/`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  getWishlist();
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No items in wishlist ❤️</p>
      )}
    </div>
  );
};

export default Wishlist;
