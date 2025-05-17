import { Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import { ProductsProvider } from "./context/ProductsContext";
import Header from './components/Header';
function App() {
  return (
    <ProductsProvider>
      <Header />
      {/* Main Content */}
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </ProductsProvider>
  );
}

export default App;