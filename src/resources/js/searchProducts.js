document.addEventListener('DOMContentLoaded', () => {
//Función para filtrar productos
  const searchInput = document.getElementById('form1');
  if (!searchInput) return;

  searchInput.addEventListener('keyup', function () {
    const searchValue = this.value.toLowerCase();
    const productCards = document.querySelectorAll('.row .col');

    productCards.forEach(card => {
      const name = card.getAttribute('data-name');
      if (name && name.includes(searchValue)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
  
    // Arregla el conflicto de modales superpuestos
    const editButtons = document.querySelectorAll('button[data-bs-target="#editProductModal"]');

    editButtons.forEach(button => {
      button.addEventListener('click', function () {
        // Encuentra el modal actual (el de detalle del producto)
        const parentModalEl = button.closest('.modal');
        if (parentModalEl) {
          const parentModal = bootstrap.Modal.getInstance(parentModalEl);
          if (parentModal) {
            parentModal.hide(); // Cierra el modal actual antes de abrir el de edición
          }
        }
      });
    });
    const editModalEl = document.getElementById('editProductModal');
    if (editModalEl) {
      editModalEl.addEventListener('hidden.bs.modal', () => {
        document.body.classList.remove('modal-open');
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      });
    }
  });