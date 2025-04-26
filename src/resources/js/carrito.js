document.addEventListener("DOMContentLoaded", () => {
// Selector de todos los botones "Agregar al carrito" y "Eliminar"
const agregarCarritoButtons = document.querySelectorAll(".agregar-carrito");
const eliminarCarritoButtons = document.querySelectorAll(".eliminar-carrito");



agregarCarritoButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
    const productId = event.target.getAttribute("data-id");
    const producto = {
        id: productId,
        image: event.target.getAttribute("data-image"),
        nombre: event.target.getAttribute("data-nombre"),
        valor: parseFloat(event.target.getAttribute("data-precio")),
        cantidad: 1
    };
    agregarAlCarrito(producto);
    });
});

eliminarCarritoButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
    const productId = event.target.getAttribute("data-id");
    const producto = { id: productId };
    restarAlCarrito(producto);
    });
});

actualizarNumeroCarrito();
actualizarVistaCarrito();
});

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
const productosCarrito = JSON.parse(localStorage.getItem("bebidas")) || [];
const index = productosCarrito.findIndex((item) => item.id === producto.id);

if (index !== -1) {
    productosCarrito[index].cantidad += 1;
} else {
    productosCarrito.push({ ...producto, cantidad: 1 });
}

localStorage.setItem("bebidas", JSON.stringify(productosCarrito));
actualizarNumeroCarrito();
actualizarTotales();
actualizarVistaCarrito();
}

// Función para eliminar o restar un producto del carrito
function restarAlCarrito(producto) {
let productosCarrito = JSON.parse(localStorage.getItem("bebidas")) || [];
const index = productosCarrito.findIndex((item) => item.id === producto.id);

if (index !== -1) {
    productosCarrito[index].cantidad -= 1;
    if (productosCarrito[index].cantidad <= 0) {
    productosCarrito.splice(index, 1);
    notyf.error("Producto eliminado");
    }
}

localStorage.setItem("bebidas", JSON.stringify(productosCarrito));
actualizarNumeroCarrito();
actualizarVistaCarrito();
cargarCarritoEnModal();
cargarCarritoEnContenedor();
actualizarTotales();
}
/*
function actualizarVistaCarritoCompleta() {
    actualizarNumeroCarrito();
    actualizarVistaCarrito();
    cargarCarritoEnModal();
    cargarCarritoEnContenedor();
    actualizarTotales();
}
*/
// Función para actualizar el número de productos en el ícono del carrito
function actualizarNumeroCarrito() {
const productosCarrito = JSON.parse(localStorage.getItem("bebidas")) || [];
const cantidadTotal = productosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
document.getElementById("cuenta-carrito").innerText = cantidadTotal;
}

// Función para actualizar la visibilidad de "carrito-vacio"
function actualizarVistaCarrito() {
const productosCarrito = JSON.parse(localStorage.getItem("bebidas")) || [];
const carritoVacio = document.getElementById("carrito-vacio");

if (productosCarrito.length === 0) {
    carritoVacio.style.display = "block";
} else {
    carritoVacio.style.display = "none";
}
}

// Función para actualizar los totales de cantidad y precio en el modal
function actualizarTotales() {
const productos = JSON.parse(localStorage.getItem("bebidas"));
let cantidad = 0;
let precio = 0;

if (productos && productos.length > 0) {
    productos.forEach((producto) => {
    cantidad += producto.cantidad;
    precio += producto.valor * producto.cantidad;
    });
}

document.getElementById("total-cantidad").innerText = cantidad;
document.getElementById("total-precio").innerText = precio.toFixed(2);

if (precio === 0) {
    reiniciarCarrito();
}
}

// Función para cargar los productos del carrito en el modal
function cargarCarritoEnModal() {
const cartItemsContainer = document.getElementById("cart-items");
cartItemsContainer.innerHTML = "";

const productosCarrito = JSON.parse(localStorage.getItem("bebidas")) || [];
productosCarrito.forEach((producto, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${index + 1}</td>
    <td>${producto.nombre}</td>
    <td>$${producto.valor}</td>
    <td>${producto.cantidad}</td>
    <td><button class="btn btn-danger eliminar-item" data-id="${producto.id}">Eliminar</button></td>
    `;
    cartItemsContainer.appendChild(row);
});

actualizarTotales();

document.querySelectorAll(".eliminar-item").forEach((button) => {
    button.addEventListener("click", function () {
    const producto = { id: this.getAttribute("data-id") };
    restarAlCarrito(producto);
    cargarCarritoEnModal();
    });
});
}

// Reiniciar el carrito y mostrar mensaje vacío
function reiniciarCarrito() {
localStorage.removeItem("bebidas");
actualizarNumeroCarrito();
cargarCarritoEnModal();
actualizarVistaCarrito();
}

// Abrir modal y cargar el carrito
document.getElementById("cart").addEventListener("click", cargarCarritoEnModal);
