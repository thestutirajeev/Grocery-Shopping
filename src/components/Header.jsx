import { useProducts } from "../context/ProductsContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

export default function Header() {
  const [query, setQuery] = useState("");
  const { cart, favorites, searchTerm, setSearchTerm } = useProducts();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchTerm(value); // Update the search term in context
  };

  useEffect(() => {
    if (searchTerm === "") {
      setQuery("");
    }
  }, [searchTerm]);

  return (
    <div className="flex items-center justify-between px-6 py-7  m-8">
      {/* Left Logo */}
      <h1 className="text-xl font-bold">GROCERIES</h1>

      {/* Middle Search Bar */}
      <div className="flex-1 mx-4 ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-lg"
          />
          <span className="absolute left-3 top-2.5 text-gray-500"></span>
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex space-x-4 items-center">
        <button className="relative">
          ❤️
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {favorites.length}
            </span>
          )}
        </button>

        {/* Avatar Button with Emoji */}
        <button className="rounded-full bg-gray-300 w-8 h-8 flex items-center justify-center text-lg">
          🙍‍♂️
        </button>

        <Link to="/checkout" className="relative">
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1 rounded-full">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
