const orders = window.orders;
const clients = window.clients;
const products = window.products;

const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
const orderForm = document.getElementById('orderForm');
const btnNewOrder = document.getElementById('btn-new-order');
const productsList = document.getElementById('productsList');
const btnAddProduct = document.getElementById('btnAddProduct');

function createProductRow(productId = '', quantity = 1) {
  const div = document.createElement('div');
  div.classList.add('d-flex', 'mb-2', 'gap-2', 'align-items-center');

  const select = document.createElement('select');
  select.name = 'productId';
  select.classList.add('form-select');
  select.required = true;
  products.forEach(p => {
    const option = document.createElement('option');
    option.value = p._id;
    option.textContent = p.name;
    if (p._id === productId) option.selected = true;
    select.appendChild(option);
  });

  const inputQty = document.createElement('input');
  inputQty.type = 'number';
  inputQty.name = 'quantity';
  inputQty.classList.add('form-control');
  inputQty.min = 1;
  inputQty.value = quantity;

  const btnRemove = document.createElement('button');
  btnRemove.type = 'button';
  btnRemove.classList.add('btn', 'btn-danger');
  btnRemove.textContent = 'X';
  btnRemove.onclick = () => div.remove();

  div.appendChild(select);
  div.appendChild(inputQty);
  div.appendChild(btnRemove);

  return div;
}

btnAddProduct.addEventListener('click', () => {
  productsList.appendChild(createProductRow());
});

btnNewOrder.addEventListener('click', () => {
  // Elimina cualquier backdrop si quedó visible
  document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

  // Cierra otros modales
  const ordersModalInstance = bootstrap.Modal.getInstance(document.getElementById('ordersModal'));
  if (ordersModalInstance) ordersModalInstance.hide();

  orderForm.reset();
  productsList.innerHTML = '';
  orderForm.querySelector('#orderId').value = '';
  orderModal.show();
});

// Función cancelar orden
document.querySelectorAll('.btn-cancel').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cancelar esta orden?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        await Swal.fire({
          title: 'Cancelado',
          text: 'La orden ha sido cancelada',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        location.reload();
      } else {
        await Swal.fire({
          title: 'Error',
          text: 'Error al cancelar la orden',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al procesar la solicitud',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
});

// Función editar orden
document.querySelectorAll('.btn-edit').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // 🔧 Cierra el modal de órdenes si está abierto
    const ordersModalInstance = bootstrap.Modal.getInstance(document.getElementById('ordersModal'));
    if (ordersModalInstance) ordersModalInstance.hide();

    const id = e.target.dataset.id;
    const order = orders.find(o => o._id === id);
    if (!order) return alert('Orden no encontrada');

    orderForm.reset();
    productsList.innerHTML = '';
    orderForm.querySelector('#orderId').value = order._id;
    orderForm.querySelector('#clienteId').value = order.clienteId?._id || '';
    orderForm.querySelector('#estado').value = order.estado;

    order.products.forEach(p => {
      productsList.appendChild(createProductRow(p.productId?._id, p.quantity));
    });

    orderModal.show();
  });
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const clienteId = orderForm.querySelector('#clienteId').value;
  const estado = orderForm.querySelector('#estado').value;

  const productsPayload = [];
  productsList.querySelectorAll('div').forEach(div => {
    const productId = div.querySelector('select[name="productId"]').value;
    const quantity = div.querySelector('input[name="quantity"]').value;
    if (productId && quantity) {
      productsPayload.push({
        productId,
        quantity: Number(quantity)
      });
    }
  });

  const payload = { clienteId, estado, products: productsPayload };

  // 🔍 DEBUG: Mostramos el contenido antes de enviar
  console.log("Payload a enviar:", JSON.stringify(payload, null, 2));

  const id = orderForm.querySelector('#orderId').value;
  const url = id ? `/orders/${id}` : '/orders';
  const method = id ? 'PUT' : 'POST';

  try {
    const result = await Swal.fire({
      title: '¿Guardar orden?',
      text: '¿Deseas continuar con el guardado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      await Swal.fire({
        title: '¡Éxito!',
        text: 'Orden guardada con éxito',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      location.reload();
    } else {
      await Swal.fire({
        title: 'Error',
        text: 'Error al guardar la orden',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  } catch (error) {
    await Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al guardar la orden',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
});

// 🔁 Cierra automáticamente otros modales al abrir orderModal
document.getElementById('orderModal').addEventListener('show.bs.modal', () => {
  const modals = document.querySelectorAll('.modal.show');
  modals.forEach(modalEl => {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance && modalEl.id !== 'orderModal') {
      modalInstance.hide();
    }
  });
});
