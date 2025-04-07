const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/productos.json');

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feature/agregar-producto
=======
>>>>>>> feature/editar-producto
function leerProductos() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function guardarProductos(productos) {
  fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
}

router.get('/', (req, res) => {
  res.json(leerProductos());
});

router.post('/', (req, res) => {
  const productos = leerProductos();
  const nuevoProducto = req.body;
  nuevoProducto.id = Date.now();
  productos.push(nuevoProducto);
  guardarProductos(productos);
  res.status(201).json(nuevoProducto);
});

router.put('/:id', (req, res) => {
  let productos = leerProductos();
  const id = parseInt(req.params.id);
  productos = productos.map(p => p.id === id ? { ...p, ...req.body } : p);
  guardarProductos(productos);
  res.json({ mensaje: 'Producto actualizado' });
});

router.delete('/:id', (req, res) => {
  let productos = leerProductos();
  const id = parseInt(req.params.id);
  productos = productos.filter(p => p.id !== id);
  guardarProductos(productos);
  res.json({ mensaje: 'Producto eliminado' });
});
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> main
=======
>>>>>>> feature/agregar-producto
=======
>>>>>>> feature/editar-producto

module.exports = router;
