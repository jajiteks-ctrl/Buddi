import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";

const Orders = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <p className="loading">Loading orders...</p>;

  if (orders.length === 0)
    return <p className="empty">No orders yet</p>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>
              <strong>Order ID:</strong> #{order.id}
            </span>
            <span className="status">{order.status}</span>
          </div>

          <p className="order-address">
            <strong>Delivery Address:</strong> {order.address}
          </p>

          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.product_name}
                  className="order-item-img"
                />

                {/* Product Info */}
                <div className="order-item-info">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <strong>Total: ₹{order.total_amount}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
