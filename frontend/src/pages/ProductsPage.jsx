// src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};



const ProductsPage = () => {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('AUTH_SESSION_TOKEN');
    localStorage.removeItem('AUTH_SESSION_USER');
    navigate('/login');
  };

  const exportToExcel = () => {
    const dataToExport = products.map(product => ({
      ID: product.id,
      Código: product.codigo,
      Título: product.titulo,
      Descripción: product.descripcion,
      Precio: `$${product.precio.toFixed(2)}`,
      Existencias: product.existencias,
      Estado: product.existencias > 0 ? 'Disponible' : 'Agotado',
      Categoría: product.categoriaID,
      'Fecha Creación': new Date(product.CreatedDate).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, "productos.xlsx");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
                <p className="text-sm text-gray-500">{products.length} productos disponibles</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-[200px] bg-gray-200 overflow-hidden">
              {product.imagen && (
                <img 
                  src={product.imagen} 
                  alt={product.titulo}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.titulo}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descripcion}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-blue-600">${product.precio.toFixed(2)}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.existencias > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.existencias > 0 ? 'Disponible' : 'Agotado'}
                </span>
              </div>
              
              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors"
                >
                  Ver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exportamos ambos componentes para usarlos en las rutas
export { ProductsPage };