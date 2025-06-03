import { useProducts } from "../context/ProductsContext";
import { useState } from "react";
const categories = ["All items", "Drinks", "Fruit", "Bakery"];

export default function SearchPage() {
  const [clicked, setClicked] = useState(null); // track last clicke product
  const { products, addToCart, favorites, toggleFavorites } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All items");

  const filtered =
    selectedCategory === "All items"
      ? products
      : products.filter(
          (p) => p.type.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2 ml-10">Trending Items</h1>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-4 ml-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-full shadow-md border transition duration-200 ${
              selectedCategory === c
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-8 lg:px-16 py-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="border p-3 rounded shadow-md flex flex-col md:flex-row"
          >
            {/* Image (Left Half for md+, Top for sm) */}
            <img
              src={p.img}
              alt={p.name}
              className="h-32 w-full md:w-1/2 object-cover rounded"
            />

            {/* Details (Right Half for md+, Bottom for sm) */}
            <div className="flex flex-col justify-between md:w-1/2 md:pl-3 mt-3 md:mt-0">
              <div>
                <h2 className="font-semibold text-base">{p.name}</h2>
                <p className="text-sm text-gray-600">
                  {p.description.length > 50
                    ? p.description.slice(0, 50) + "..."
                    : p.description}
                </p>

                {/* Stock Status */}
                <p
                  className={`mt-16 text-xs font-semibold inline-block px-2 py-1 rounded ${
                    p.available >= 10
                      ? "bg-green-600 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {p.available >= 10 ? "Available" : `Only ${p.available} left`}
                </p>
              </div>

              {/* Bottom Row: Price & Icons */}
              <div className="flex justify-between items-center mt-2">
                <p className="font-bold">{p.price}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (p.available > 0) {
                        addToCart(p);
                        setClicked(p.id);
                        setTimeout(() => setClicked(null), 800); // reset
                      }
                    }}
                    className={`text-green-600 text-lg transition duration-200 ${
                      p.available === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title={p.available === 0 ? "Out of Stock" : "Add to Cart"}
                    disabled={p.available === 0}
                  >
                    {clicked === p.id ? "✅" : "🛒"}
                  </button>
                  <button
                    onClick={() => toggleFavorites(p)}
                    className="text-pink-500 text-xl"
                    title="Add to Favorites"
                  >
                    {favorites.some((fav) => fav.id === p.id) ? "❤️" : "♡"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
