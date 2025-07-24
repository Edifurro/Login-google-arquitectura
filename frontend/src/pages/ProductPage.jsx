import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ProductViewPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el producto');
        }
        const result = await response.json();
        
        if (result.success && result.data) {
          setProduct(result.data);
          // Establecer el primer video como activo si existe
          if (result.data.videos && result.data.videos.length > 0) {
            setActiveVideo(result.data.videos[0]);
          }
        } else {
          throw new Error('Producto no encontrado');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleVideoSelect = (videoUrl) => {
    setActiveVideo(videoUrl);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <Link 
            to="/products" 
            className="mt-4 inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Advertencia: </strong>
          <span className="block sm:inline">Producto no encontrado</span>
          <Link 
            to="/products" 
            className="mt-4 inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/products" 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a productos
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 text-center">{product.titulo}</h1>
          <div className="w-24"></div> {/* Espaciador para centrar el título */}
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Imagen principal del producto */}
            <div className="md:w-1/2 p-8 flex flex-col items-center justify-center">
              {product.imagen ? (
                <div className="relative">
                  <img 
                    src={product.imagen} 
                    alt={product.titulo} 
                    className="w-full max-h-96 object-contain rounded-lg shadow-md"
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {product.existencias > 0 ? 'Disponible' : 'Agotado'}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
                  Imagen no disponible
                </div>
              )}
              
              <div className="mt-8 w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Información del producto</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Código:</p>
                    <p className="font-medium">{product.codigo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Precio:</p>
                    <p className="font-medium text-green-600">${product.precio?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Existencias:</p>
                    <p className="font-medium">{product.existencias}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estado:</p>
                    <p className={`font-medium ${product.existencias > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.existencias > 0 ? 'Disponible' : 'Agotado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Videos del producto */}
            <div className="md:w-1/2 bg-gray-50 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Videos del producto</h2>
              
              {product.videos && product.videos.length > 0 ? (
                <>
                  {/* Reproductor de video principal */}
                  <div className="mb-6">
                    <div className="bg-black rounded-lg overflow-hidden aspect-video">
                      {activeVideo ? (
                        <video 
                          key={activeVideo}
                          controls 
                          className="w-full h-full object-contain"
                          poster={product.imagen}
                        >
                          <source src={activeVideo} type="video/mp4" />
                          Tu navegador no soporta la etiqueta de video.
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 truncate">
                      {activeVideo ? activeVideo.split('/').pop() : 'Seleccione un video'}
                    </div>
                  </div>
                  
                  {/* Grid de videos */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Galería de videos</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {product.videos.map((videoUrl, index) => (
                        <div 
                          key={index}
                          onClick={() => handleVideoSelect(videoUrl)}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${activeVideo === videoUrl ? 'border-blue-500' : 'border-gray-300'}`}
                        >
                          <div className="relative aspect-video">
                            <video 
                              className="w-full h-full object-cover"
                              poster={product.imagen}
                            >
                              <source src={videoUrl} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white bg-black bg-opacity-50 rounded-full p-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="p-2 bg-white">
                            <p className="text-xs text-gray-600 truncate">Video {index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-700">No hay videos disponibles</h3>
                  <p className="mt-1 text-gray-500">Este producto no tiene videos asociados.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Descripción del producto */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.descripcion || 'No hay descripción disponible para este producto.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;