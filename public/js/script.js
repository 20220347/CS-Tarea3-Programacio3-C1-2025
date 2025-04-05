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

let idProductoEliminar = null;

function cargarProductos() {
  fetch('/api/productos')
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrarProductos();
    });
}

// 1. Mostrar los productos como tarjetas
function mostrarProductos() {
  lista.innerHTML = '';
  productos.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col';

    const imagen = p.imagen || 'https://via.placeholder.com/300x200';
    col.innerHTML = `
      <div class="card">
        <!-- Imagen -->
        <img src="${imagen}" class="card-img-top" alt="${p.nombre}">

        <!-- Header con el título -->
        <div class="card-header">
          <h5 class="mb-0 text-primary">${p.nombre}</h5>
        </div>

        <!-- Body con descripción, cantidad, precio -->
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

// 2. Enviar datos (Agregar o Editar)
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




cargarProductos();
