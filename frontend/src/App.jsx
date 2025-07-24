import LoginPage from './pages/login';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProductsPage } from './pages/ProductsPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductEditForm from './pages/ProductPageEdit';
import ProductViewPage from './pages/ProductPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage style={{ padding: "2rem" }} />}
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        {/* Ruta por defecto redirige a /products (protegida) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
         <Route path="/products/edit/:id" element={<ProductEditForm />} />
         <Route path="/product/:id" element={<ProductViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;