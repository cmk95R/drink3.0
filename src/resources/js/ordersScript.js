// Accedemos a los datos inyectados en window
const orders = window.orders;
const clients = window.clients;
const products = window.products;

const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
const orderForm = document.getElementById('orderForm');
const btnNewOrder = document.getElementById('btn-new-order');
const productsList = document.getElementById('productsList');
const btnAddProduct = document.getElementById('btnAddProduct');

// Función para crear un bloque de producto + cantidad
function createProductRow(productId = '', quantity = 1) {
  const div = document.createElement('div');
  div.classList.add('d-flex', 'mb-2', 'gap-2', 'align-items-center');

  const select = document.createElement('select');
  select.name = 'products[][productId]';
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
  inputQty.name = 'products[][quantity]';
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
  orderForm.reset();
  productsList.innerHTML = '';
  orderForm.querySelector('#orderId').value = '';
  orderModal.show();
});

// Editar orden - cargar datos en modal
document.querySelectorAll('.btn-edit').forEach(btn => {
  btn.addEventListener('click', (e) => {
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

// Cancelar orden (solo confirm y luego enviar petición)
document.querySelectorAll('.btn-cancel').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    if (!confirm('¿Seguro que desea cancelar esta orden?')) return;
    try {
      const res = await fetch(`/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        alert('Orden cancelada');
        location.reload();
      } else {
        alert('Error al cancelar la orden');
      }
    } catch (error) {
      alert('Error al cancelar la orden');
    }
  });
});

// Enviar formulario crear/editar
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(orderForm);
  // Construir payload compatible
  const clienteId = formData.get('clienteId');
  const estado = formData.get('estado');

  const productsPayload = [];
  const productIds = formData.getAll('products[][productId]');
  const quantities = formData.getAll('products[][quantity]');
  for (let i = 0; i < productIds.length; i++) {
    if (productIds[i] && quantities[i]) {
      productsPayload.push({
        productId: productIds[i],
        quantity: Number(quantities[i])
      });
    }
  }

  const payload = { clienteId, estado, products: productsPayload };

  const id = formData.get('orderId');
  const url = id ? `/orders/${id}` : '/orders';
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Orden guardada con éxito');
      location.reload();
    } else {
      alert('Error al guardar la orden');
    }
  } catch (error) {
    alert('Error al guardar la orden');
  }
});
