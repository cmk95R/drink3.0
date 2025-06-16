

//Función agregar producto

document
.getElementById("formAgregarProducto")
.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const res = await fetch("/stock/add", {
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
                window.location.href = "/stock";
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

    const editModal = document.getElementById('editProductModal');

    // Al abrir el modal de edición
    editModal.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;

      // Extraer los datos del botón
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const stock = button.getAttribute('data-stock');
      const category = button.getAttribute('data-category');
      const description = button.getAttribute('data-description');
      const image = button.getAttribute('data-image');
      const isAvailable = button.getAttribute('data-isavailable') === 'true';

      // Rellenar el formulario del modal
      document.getElementById('editName').value = name || '';
      document.getElementById('editStock').value = stock || '';
      document.getElementById('editCategory').value = category || '';
      document.getElementById('editDescription').value = description || '';

      // Mostrar imagen actual
      const currentImageContainer = document.getElementById('currentImageContainer');
      if (image) {
        const imageUrl = image.startsWith('http') ? image : `/uploads/${image}`;
        currentImageContainer.innerHTML = `<img src="${imageUrl}" alt="Imagen actual" class="img-fluid rounded">`;
      } else {
        currentImageContainer.innerHTML = 'Sin imagen';
      }

      // Checkbox de disponibilidad
      document.getElementById('editIsAvailable').checked = isAvailable;

      // Actualizar acción del formulario (IMPORTANTE: quitar "/edit" y poner sólo /stock/:id)
      const form = document.getElementById('editProductForm');
      form.action = `/stock/edit/${id}?_method=PUT`;
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

  // Carga CSV
document.getElementById("csvUploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];

    if (!file) {
        Swal.fire({
            icon: "warning",
            title: "Archivo requerido",
            text: "Por favor selecciona un archivo CSV antes de enviar.",
        });
        return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
        const res = await fetch("/stock/upload-csv", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "CSV cargado",
                text: data.message || "Productos cargados correctamente",
                confirmButtonText: "Aceptar",
            }).then(() => {
                window.location.href = "/stock";
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message || "Error al cargar el archivo CSV",
            });
        }
    } catch (error) {
        console.error("Error al subir CSV:", error);
        Swal.fire({
            icon: "error",
            title: "Error de red",
            text: "No se pudo conectar con el servidor",
        });
    }
});
