# 🛒 Grocery Shopping Webpage

A responsive grocery shopping web application built with React, implementing a complete shopping experience with offers, category-based filtering, cart management, and checkout functionality.

## 🔗 Live Demo

**[Visit the live app on Vercel](https://grocery-shopping-self.vercel.app/)**

---

## Features

### **Search Results Page**
- Fetches products from the given API based on selected category (`fruit`, `drinks`, `bakery`, or `all`).
- Users can:
  - Browse products by category.
  - Search products using a search bar.
  - View product details including name, image, and stock availability.
  - Add products to cart. 🛒
  - Mark them as favorite.❤️

### **Checkout Page**
- Displays all items added to the cart.
- Allows users to:
  - Modify item quantities.
  - Remove items from the cart.
  - See stock warnings (e.g., "Only 3 left").
  - View live price summary: **Subtotal**, **Discount**, and **Total**.

### **Offers (Auto-applied based on cart)**
1. **Buy 6 Coca-Cola cans → Get 1 free**
2. **Buy 3 croissants → Get 1 free coffee**

- Offer items are added automatically.
- Offers are removed if the triggering quantity condition is no longer met.

### **Cart Persistence**
- Cart state is maintained when navigating between pages.
- Items and offers remain intact when switching between Search and Checkout pages.

### **Responsive Design**
- Fully responsive across:
  - Desktop
  - Tablet
  - Mobile devices

---

## 📦 Tech Stack

- **React**
- **Tailwind CSS**
- **Vercel (for hosting)**
- **Fetch API**

---

## Setup Instructions (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/thestutirajeev/grocery-shopping.git
cd grocery-shopping
```

### 2. Install Dependencies

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom
```

### 3. Run the App Locally

```bash
npm run dev
```

