document.addEventListener("DOMContentLoaded", mostrarHistorial);

function mostrarHistorial() {
  const historialContainer = document.getElementById("historial-container");
  historialContainer.innerHTML = ""; // Limpiar el contenido inicial

  // Obtener el historial de compras desde localStorage
  const historial = JSON.parse(localStorage.getItem("historial")) || [];

  // Comprobar si el historial está vacío
  if (historial.length === 0) {
    historialContainer.innerHTML = "<h2> Mis pedidos </h2> <p>No hay compras en el historial.</p>";
    return;
  }

  // Iterar sobre cada compra en el historial y mostrarla
  historial.forEach((compra, index) => {
    const compraElement = document.createElement("div");
    compraElement.classList.add("compra");

    // Agregar la fecha de la compra
    const fechaCompra = document.createElement("h3");
    fechaCompra.innerText = `Compra realizada el: ${compra.fecha}`;
    compraElement.appendChild(fechaCompra);

    // Crear una lista para los productos de la compra
    const productosLista = document.createElement("ul");
    productosLista.classList.add("productos-lista");

    // Iterar sobre los productos de cada compra
    compra.productos.forEach((producto, productoIndex) => {
      const productoItem = document.createElement("li");
      productoItem.classList.add("producto-item");

      productoItem.innerHTML = `
        <img src="${producto.image}" alt="${producto.nombre}" class="producto-imagen">
        <div class="producto-detalles">
          <p><strong>Nombre:</strong> ${producto.nombre}</p>
          <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
          <p><strong>Precio Unitario:</strong> $${producto.valor}</p>
          <p><strong>Total:</strong> $${(producto.cantidad * producto.valor).toFixed(2)}</p>
        </div>
      `;

      // Crear botón de "Cancelar pedido"
      const cancelarBtn = document.createElement("button");
      cancelarBtn.innerText = "Cancelar Pedido";
      cancelarBtn.classList.add("cancelar-btn");
      cancelarBtn.setAttribute("data-bs-toggle", "modal");
      cancelarBtn.setAttribute("data-bs-target", "#exampleModal");

      // Pasar indices al modal
      cancelarBtn.addEventListener("click", () => mostrarModal(index, productoIndex));

      productoItem.appendChild(cancelarBtn);
      productosLista.appendChild(productoItem);
    });

    compraElement.appendChild(productosLista);
    historialContainer.appendChild(compraElement);
  });
}

// Función para mostrar el modal con los índices de la compra y el producto
function mostrarModal(compraIndex, productoIndex) {
  const confirmarBtn = document.querySelector(".btn-cancelar");

  // Actualizar el evento del botón "Confirmar" en el modal
  confirmarBtn.onclick = () => cancelarPedido(compraIndex, productoIndex);
}

// Función para cancelar un pedido (eliminar producto del historial)
function cancelarPedido(compraIndex, productoIndex) {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];

  // Eliminar el producto de la compra
  historial[compraIndex].productos.splice(productoIndex, 1);

  // Si no quedan productos en esa compra, eliminar la compra completa
  if (historial[compraIndex].productos.length === 0) {
    historial.splice(compraIndex, 1);
  }

  // Guardar el nuevo historial actualizado en localStorage
  localStorage.setItem("historial", JSON.stringify(historial));

  // Ocultar el modal y volver a mostrar el historial actualizado
  const modal = document.querySelector("#exampleModal");
  const bootstrapModal = bootstrap.Modal.getInstance(modal);
  bootstrapModal.hide();

  mostrarHistorial();
}
