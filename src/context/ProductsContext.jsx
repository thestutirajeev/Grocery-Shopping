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

    const existingItem = cart.find((item) => item.id === product.id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    // Special rule for Coca-Cola (ID: 642)
    if (product.id === 642) {
      const totalNeededStock = newQuantity + Math.floor(newQuantity / 6);
      if (totalNeededStock > latestProduct.available) {
        alert("Not enough stock to apply free item offer for Coca-Cola.");
        return;
      }
    }

    // Special rule for Croissant (ID: 532) → triggers free Coffee (ID: 641)
    if (product.id === 532) {
      const freeCoffeeCount = Math.floor(newQuantity / 3);
      const coffeeProduct = products.find((p) => p.id === 641);
      if (coffeeProduct && coffeeProduct.available < freeCoffeeCount) {
        alert(`Not enough Coffee stock to apply free item offer.`);
      }
    }

    // Normal stock check
    if (latestProduct.available <= 0) {
      alert("You cannot add more than available stock");
      return;
    }

    // Update cart
    setCart((prevCart) => {
      return existingItem
        ? prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
    });

    // Update global stock of the main product
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

    // Special rule for Coca-Cola (ID: 642)
    if (id === 642) {
      const totalNeededStock = newQuantity + Math.floor(newQuantity / 6);
      if (totalNeededStock > product.available + cartItem.quantity) {
        alert("Not enough stock to apply free item offer for Coca-Cola.");
        return;
      }
    }

    // Special rule for Croissant (ID: 532) → triggers free Coffee (ID: 641)
    if (id === 532) {
      const freeCoffeeCount = Math.floor(newQuantity / 3);
      const coffeeProduct = products.find((p) => p.id === 641);
      if (coffeeProduct && coffeeProduct.available < freeCoffeeCount) {
        alert(
          `Not enough Coffee stock to apply free item offer. Only ${coffeeProduct.available} Coffee(s) available.`
        );
        return;
      }
    }

    if (quantityDiff > 0 && product.available < quantityDiff) {
      alert("You cannot add more than available stock");
      return;
    }

    // Update cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // Update product availability
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
