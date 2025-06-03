

//Función agregar producto

document
.getElementById("formAgregarProducto")
.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const res = await fetch("/products/add", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Producto guardado",
                text: data.message,
                confirmButtonText: "Aceptar",
            }).then(() => {
                window.location.href = "/products";
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message || "Ocurrió un error al guardar el producto",
            });
        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Error de red",
            text: "No se pudo conectar con el servidor",
        });
    }
});



    //Función editar Producto

  const editProductModal = document.getElementById('editProductModal');
  const editProductForm = document.getElementById('editProductForm');

  editProductModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget; // Botón que disparó el modal
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = button.getAttribute('data-price');
    const stock = button.getAttribute('data-stock');
    const category = button.getAttribute('data-category');
    const description = button.getAttribute('data-description');
    const image = button.getAttribute('data-image');
    const isAvailable = button.getAttribute('data-isavailable') === 'true';

    // Setear el action del form para que vaya a /products/edit/:id
    editProductForm.action = `/products/edit/${id}?_method=PUT`;

    // Cargar los valores en los campos
    document.getElementById('editName').value = name;
    document.getElementById('editPrice').value = price;
    document.getElementById('editStock').value = stock;
    document.getElementById('editCategory').value = category;
    document.getElementById('editDescription').value = description;
    document.getElementById('editIsAvailable').checked = isAvailable;

    // Mostrar imagen actual
    const imgContainer = document.getElementById('currentImageContainer');
    if(image){
      imgContainer.innerHTML = `<img src="/uploads/${image}" alt="Imagen actual" width="100" />`;
    } else {
      imgContainer.innerHTML = 'No hay imagen';
    }
  });

  ////////////////Alertas

  //Función editar productos
  
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const editSuccess = getQueryParam('edit');

  if (editSuccess === 'success') {
    Swal.fire({
      icon: 'success',
      title: '¡Producto editado!',
      text: 'El producto se actualizó correctamente.',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      // Opcional: Remover query string para que no aparezca de nuevo si recargas
      const url = new URL(window.location);
      url.searchParams.delete('edit');
      window.history.replaceState({}, document.title, url.toString());
    });
  }

// Función eliminar productos

    document.querySelectorAll('.delete-form').forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault(); // Detener el envío

                Swal.fire({
                    title: '¿Estás seguro?',
                    text: '¡Esta acción eliminará el producto!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        form.submit(); // Enviar el formulario si confirma
                    }
                });
            });
  });
