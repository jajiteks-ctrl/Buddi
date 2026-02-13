import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import "./index.css";

const Cart = () => {
    const token = localStorage.getItem("token");
    const [cartItem, setCartItem] = useState([]);

    const navigate = useNavigate(); // ✅ added

    // function to refresh cart anytime
    const fetchCart = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/cart/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItem(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // initial fetch
    useEffect(() => {
        const getCart = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/cart/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItem(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getCart();
    }, [token]);

    const cartIncrease = async (productId) => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/cart/add/",
                { product_id: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart();
        } catch (err) {
            console.log(err);
        }
    };

    const cartDecrease = async (productId) => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/cart/decrease/",
                { product_id: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart();
        } catch (err) {
            console.log(err);
        }
    };

    const deleteCart = async (productId) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/remove/${productId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>My Cart</h1>

            {/* ✅ Checkout Button */}
            {cartItem.length > 0 && (
                <div className="checkout-wrapper">
                    <button
                        className="checkout-btn"
                        onClick={() => navigate("/checkout")}
                    >
                        Checkout
                    </button>
                </div>
            )}

            {cartItem.length === 0 && <p>Cart is empty</p>}

            {cartItem.map((item) => (
                <div key={item.id} className="cart-item">
                    <img src={item.image} alt="" className="cart-img" />
                    <h3>{item.product_name}</h3>

                    <p>Price: {item.price}</p>
                    <p>Total: {item.price * item.quantity}</p>

                    <div className="cart-item-actions">
                        <button onClick={() => cartIncrease(item.product_id)}>+</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => cartDecrease(item.product_id)}>-</button>
                    </div>

                    <button onClick={() => deleteCart(item.product_id)} className="del-cart">Delete</button>
                </div>
            ))}
        </div>
    );
};

export default Cart;
