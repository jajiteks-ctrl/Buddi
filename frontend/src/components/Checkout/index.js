import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Checkout = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // fetch cart items (read-only)
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/cart/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchCart();
    }, [token]);

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (!address.trim()) {
            setError("Delivery address is required");
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                "http://127.0.0.1:8000/checkout/",
                { address },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate("/orders");
        } catch (err) {
            setError(err.response?.data?.error || "Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <div className="checkout-layout">
                {/* LEFT – Address */}
                <div className="checkout-card">
                    <h3>Delivery Address</h3>

                    {error && <p className="error">{error}</p>}

                    <textarea
                        placeholder="Enter full delivery address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                {/* RIGHT – Order Summary */}
                <div className="checkout-card">
                    <h3>Order Summary</h3>

                    {cartItems.map((item) => (
                        <div key={item.id} className="summary-item">
                            <span>
                                {item.product_name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}

                    <hr />

                    <div className="summary-total">
                        <strong>Total</strong>
                        <strong>₹{totalAmount}</strong>
                    </div>

                    <button
                        className="place-order-btn"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
