let productoEditandoId = null;
let productos = [];

// Referencias a modales y elementos
const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista-productos');
const modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
const modalVer = new bootstrap.Modal(document.getElementById('modalVer'));
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
const detalleProducto = document.getElementById('detalleProducto');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
const buscador = document.getElementById('buscador');

let idProductoEliminar = null;

// Cargar productos desde el backend
function cargarProductos() {
  fetch('/api/productos')
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrarProductos(); // Mostrar todos inicialmente
    });
}

// Mostrar productos (permite pasar un arreglo filtrado)
function mostrarProductos(productosMostrar = productos) {
  lista.innerHTML = '';
  productosMostrar.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col';
    const imagen = p.imagen || 'https://via.placeholder.com/300x200';

    col.innerHTML = `
      <div class="card">
        <!-- Header con el nombre -->
        <div class="card-header">
          <h5 class="mb-0 text-primary">${p.nombre}</h5>
        </div>
        <!-- Imagen -->
        <img src="${imagen}" class="card-img-top" alt="${p.nombre}">
        <!-- Body con descripción, cantidad y precio -->
        <div class="card-body">
          <p class="text-secondary">${p.descripcion || ''}</p>
          <hr class="hr-custom">
          <p class="mb-1"><strong>Cantidad:</strong> ${p.cantidad}</p>
          <p class="mb-1"><strong>Precio:</strong> $${p.precio}</p>
        </div>
        <!-- Footer con botones de acción -->
        <div class="card-footer">
          <hr class="hr-custom">
          <div class="d-flex justify-content-around">
            <button class="btn btn-outline-primary btn-sm" onclick="verProducto(${p.id})">
              <i class="bi bi-eye"></i> Ver
            </button>
            <button class="btn btn-outline-warning btn-sm" onclick="cargarEdicion(${p.id})">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminacion(${p.id})">
              <i class="bi bi-trash"></i> Borrar
            </button>
          </div>
        </div>
      </div>
    `;
    lista.appendChild(col);
  });
}

// Función para filtrar productos según el término de búsqueda
function filtrarProductos() {
  const termino = buscador.value.toLowerCase();
  const productosFiltrados = productos.filter(p => {
    return p.nombre.toLowerCase().includes(termino) ||
           (p.descripcion && p.descripcion.toLowerCase().includes(termino));
  });
  mostrarProductos(productosFiltrados);
}

// Asignar el evento al campo de búsqueda
buscador.addEventListener('input', filtrarProductos);

// Funciones CRUD existentes

// Agregar o actualizar un producto
formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const producto = {
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    cantidad: parseInt(document.getElementById('cantidad').value),
    precio: parseFloat(document.getElementById('precio').value),
    imagen: document.getElementById('imagen').value
  };

  if (productoEditandoId) {
    // Actualizar producto
    fetch(`/api/productos/${productoEditandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    }).then(() => {
      productoEditandoId = null;
      formulario.reset();
      modalFormulario.hide();
      cargarProductos();
    });
  } else {
    // Agregar nuevo producto
    fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    }).then(() => {
      formulario.reset();
      modalFormulario.hide();
      cargarProductos();
    });
  }
});

// Ver detalles del producto en un modal
function verProducto(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    detalleProducto.innerHTML = `
      <img src="${producto.imagen || 'https://via.placeholder.com/300x200'}" class="img-fluid mb-3" alt="${producto.nombre}">
      <h5>${producto.nombre}</h5>
      <p><strong>Descripción:</strong> ${producto.descripcion}</p>
      <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
    `;
    modalVer.show();
  }
}

// Cargar datos en el formulario para editar
function cargarEdicion(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('cantidad').value = producto.cantidad;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('imagen').value = producto.imagen;
    productoEditandoId = id;
    modalFormulario.show();
  }
}

// Confirmar eliminación
function confirmarEliminacion(id) {
  idProductoEliminar = id;
  modalEliminar.show();
}

// Eliminar producto
btnConfirmarEliminar.addEventListener('click', () => {
  if (idProductoEliminar) {
    fetch(`/api/productos/${idProductoEliminar}`, { method: 'DELETE' })
      .then(() => {
        modalEliminar.hide();
        idProductoEliminar = null;
        cargarProductos();
      });
  }
});

cargarProductos();
