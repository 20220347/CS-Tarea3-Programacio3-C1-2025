const express = require('express');
const app = express();
const path = require('path');
const productosRoutes = require('./routes/productos');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
