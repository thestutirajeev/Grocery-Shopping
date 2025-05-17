// src/api/products.js

export const fetchProductsByCategory = async (category = "all") => {
  const url = `https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s?category=${category}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return []; // return empty array on failure
  }
};
