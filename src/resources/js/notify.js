//notify.js

// Inicializar Notyf
let notyf = new Notyf({ dismissible: true });

// Función para manejar el clic en "Agregar al carrito"
document.querySelectorAll('.añadir').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();

        // Crear objeto del producto desde los atributos de datos
        const producto = {
            id: this.getAttribute('data-id'),
            nombre: this.getAttribute('data-nombre'),
            valor: parseFloat(this.getAttribute('data-precio'))
        };

        // Llamar a la función de agregar al carrito
        agregarAlCarrito(producto);

        // Notificación de éxito
        notyf.success("Producto agregado exitosamente!");

        // Actualizar ambas vistas del carrito
        cargarCarritoEnModal();
        //cargarCarritoEnContenedor();
    });
});

// Función para cargar productos del carrito en el modal
function cargarCarritoEnModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    const productosCarrito = JSON.parse(localStorage.getItem('bebidas')) || [];
    productosCarrito.forEach((producto, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${producto.nombre}</td>
            <td>$${producto.valor}</td>
            <td>${producto.cantidad}</td>
            <td><button class="btn btn-danger eliminar-item" data-id="${producto.id}">Eliminar</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    // Añadir evento de eliminar para cada botón en el carrito del modal
    document.querySelectorAll('.eliminar-item').forEach(button => {
        button.addEventListener('click', function() {
            const producto = { id: this.getAttribute('data-id') };
            restarAlCarrito(producto);
            cargarCarritoEnModal(); // Refrescar el contenido del modal
        });
    });
}

// Función para cargar el carrito en el contenedor principal
function cargarCarritoEnContenedor() {
    const cartContainer = document.getElementById('cart-container');
    const totalUnidades = document.getElementById('cantidad');
    const totalPrecio = document.getElementById('precio');

    cartContainer.innerHTML = '';

    const productosCarrito = JSON.parse(localStorage.getItem('bebidas')) || [];
    let totalItems = 0;
    let totalCost = 0;

    productosCarrito.forEach((producto) => {
        totalItems += producto.cantidad;
        totalCost += producto.valor * producto.cantidad;

        const itemContainer = document.createElement('div');
        itemContainer.className = 'cart-item';
        itemContainer.innerHTML = `
            <p class="producto-Titulo">${producto.nombre}</p>
            <p class="producto-Precio">Precio: $${producto.valor}</p>
            <p class="producto-Cantidad">Cantidad: ${producto.cantidad}</p>
            <button class="btn btn-danger eliminar-item" data-id="${producto.id}">Eliminar</button>
        `;
        cartContainer.appendChild(itemContainer);
    });

    totalUnidades.textContent = totalItems;
    totalPrecio.textContent = totalCost.toFixed(2);

    // Añadir evento de eliminar para cada botón en el contenedor principal del carrito
    document.querySelectorAll('.eliminar-item').forEach(button => {
        button.addEventListener('click', function() {
            const producto = { id: this.getAttribute('data-id') };
            restarAlCarrito(producto);
            //cargarCarritoEnModal(); // Refrescar el contenido del modal
            cargarCarritoEnContenedor(); // Refrescar el contenido en el contenedor principal
            actualizarNumeroCarrito();
            actualizarVistaCarrito();
        });
    });
}

// Actualizar ambas vistas del carrito cuando se hace clic en el icono del carrito en el header
document.getElementById('cart').addEventListener('click', cargarCarritoEnModal);
document.addEventListener('DOMContentLoaded', cargarCarritoEnContenedor);
