import { createContext, useContext, useEffect, useState } from "react";
import { fetchProductsByCategory } from "../api/products";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorites = (product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id); // remove
      } else {
        return [...prev, product]; // add
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSearchTerm("");
    fetchProductsByCategory(category)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  const addToCart = (product) => {
    const latestProduct = products.find((p) => p.id === product.id);
    if (!latestProduct) return;

    if (latestProduct.available <= 0) {
      alert("You cannot add more than available stock");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);

    // 1. Update cart
    setCart((prevCart) => {
      return existingItem
        ? prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
    });

    // 2. Update available stock
    setProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.id === product.id
          ? { ...item, available: item.available - 1 }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    const itemToRemove = cart.find((item) => item.id === id);
    if (itemToRemove) {
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id
            ? { ...prod, available: prod.available + itemToRemove.quantity }
            : prod
        )
      );
    }

    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    const product = products.find((p) => p.id === id);
    const cartItem = cart.find((c) => c.id === id);

    if (!product || !cartItem) return;

    const quantityDiff = newQuantity - cartItem.quantity;

    if (quantityDiff > 0 && product.available < quantityDiff) {
      alert("You cannot add more than available stock");
      return;
    }

    // 1. Update cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // 2. Update product availability
    setProducts((prevProducts) =>
      prevProducts.map((prod) =>
        prod.id === id
          ? { ...prod, available: prod.available - quantityDiff }
          : prod
      )
    );
  };

  const filteredProducts = products.filter((product) => {
  const term = searchTerm.toLowerCase();
  return (
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );
});

  return (
    <ProductsContext.Provider
      value={{
        products: filteredProducts,
        cart,
        setCart,
        category,
        setCategory,
        addToCart,
        removeFromCart,
        updateQuantity,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        favorites,
        toggleFavorites,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
