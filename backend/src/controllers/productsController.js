const pool = require('../config/database');

const getProducts = async (req, res) => {
  try {
    // Consulta SQL para obtener productos no eliminados
    const query = `
      SELECT 
        id, status, imagen, codigo, titulo, 
        descripcion, precio, existencias, categoriaID, 
        CreatedDate , videos
      FROM productos 
      WHERE is_deleted = 0
      ORDER BY CreatedDate ASC
    `;
    
    const [products] = await pool.query(query);
    
    const productsParsed = products.map(product => {
      return {
        ...product,
        videos: product.videos ? JSON.parse(product.videos) : []
      };
    });

    res.json({
      success: true,
      count: products.length,
      data: productsParsed
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener los productos' 
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
        id, status, imagen, codigo, titulo, 
        descripcion, precio, existencias, categoriaID, 
        CreatedDate, videos
       FROM productos 
       WHERE id = ? AND is_deleted = 0`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Producto no encontrado' 
      });
    }

    const product = {
      ...rows[0],
      videos: rows[0].videos ? JSON.parse(rows[0].videos) : []
    };

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener el producto' 
    });
  }
};

const updateProduct = async (req, res) => {
  const {
    id,
    status,
    imagen,
    codigo,
    titulo,
    descripcion,
    precio,
    existencias,
    categoriaID,
    videos = []
  } = req.body;

  // Validación básica de campos requeridos
  if (!id || !titulo || !codigo || !descripcion || precio === undefined || existencias === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios'
    });
  }

  try {
    // Verificar si el producto existe
    const [productCheck] = await pool.query(
      'SELECT id FROM productos WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (productCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado o eliminado'
      });
    }

    // Actualizar el producto
    const updateQuery = `
      UPDATE productos 
      SET 
        status = ?,
        imagen = ?,
        codigo = ?,
        titulo = ?,
        descripcion = ?,
        precio = ?,
        existencias = ?,
        categoriaID = ?,
        videos = ?
      WHERE id = ? AND is_deleted = 0
    `;
    
    const videosJson = JSON.stringify(videos);

    const [result] = await pool.query(updateQuery, [
      status || 0,
      imagen || null,
      codigo,
      titulo,
      descripcion,
      precio,
      existencias,
      categoriaID || null,
      videosJson || [],
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se pudo actualizar el producto'
      });
    }

    // Obtener el producto actualizado para devolverlo
    const [updatedProduct] = await pool.query(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: updatedProduct[0]
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  updateProduct
};
