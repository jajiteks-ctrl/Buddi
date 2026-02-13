import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

const Home = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [error, setError] = useState(null);

    // ---------- NAVIGATION ----------
    const goToDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    // ---------- CART ----------
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

    // ---------- WISHLIST ----------
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

    // ---------- FETCH DATA ----------
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/products/category-wise/"
                );

                setCategories(res.data);

                if (res.data.length > 0) {
                    setSelectedCategory(res.data[0]); // default first category
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

        fetchCategories();
        fetchWishlist();
    }, [token]);

    const quotes = [
        "Shop Smart. Shop Online.",
        "Big Deals. Best Prices.",
        "Discover More. Pay Less.",
        "Everything You Need, Just a Click Away.",
    ]

    const [index, setIndex] = useState(0)

    useEffect(() => {

        const interval = setInterval(() => {
            setIndex((index + 1) % quotes.length)

        }, 3000)
        return () => clearInterval(interval)
    })

    if (error) return <p className="error-message">{error}</p>;

    return (
        <>

            <div className="home-container">

            </div>

            <p className="quote-para">{quotes[index]}</p>
            <h1 className="trend">- Trending now – grab yours today -</h1>

            <div className="products-container">
                {/* ----------- CATEGORIES ----------- */}
                <div className="categories-panel">
                    <h3>Categories</h3>
                    <ul className="cat-cont">
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat)}
                                className={selectedCategory?.id === cat.id ? "selected" : ""}
                            >
                                {cat.name}

                            </li>
                        ))}
                    </ul>
                </div>

                {/* ----------- PRODUCTS ----------- */}
                <div className="products-panel">
                    {selectedCategory ? (
                        selectedCategory.products.length > 0 ? (
                            <>
                                <div className="products-list">
                                    {selectedCategory.products.slice(0, 6).map((prod) => (
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

                                {/* ----------- SEE ALL ----------- */}
                                {selectedCategory.products.length > 6 && (
                                    <div className="see-all-container">
                                        <button
                                            className="see-all-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/products?category=${selectedCategory.id}`
                                                )
                                            }
                                        >
                                            See all products →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>No products in this category</p>
                        )
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
