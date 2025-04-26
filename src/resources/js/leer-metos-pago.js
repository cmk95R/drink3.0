// Función para leer los métodos de pago del localStorage y mostrar un mensaje o los métodos existentes
function mostrarMetodosPago() {
    const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods')) || [];

    const modalBody = document.querySelector('#exampleModal .modal-body');
    modalBody.innerHTML = ''; // Limpiar el contenido previo

    if (paymentMethods.length === 0) {
        modalBody.innerHTML = `
            <p>No tienes ningún método de pago almacenado. </p>
            <li>
                <button onclick="window.location.href = '/api/profile?section=mediosPago'" class="btn btn-primary">
                    Añadir método de pago
                </button>
            </li>
        `;
    } else {
        // Crear un formulario para encapsular los checkboxes y métodos
        const form = document.createElement('form');
        form.id = "payment-methods-form";
        paymentMethods.forEach((method, index) => {
            const methodDiv = document.createElement('div');
            methodDiv.classList.add('payment-method', 'd-flex', 'align-items-center', 'mb-3');

            // Crear el checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `payment-method-${index}`;
            checkbox.name = 'selectedPaymentMethod';
            checkbox.value = index; // El índice se puede usar para identificar el método seleccionado
            checkbox.classList.add('form-check-input', 'me-2');

            // Información del método de pago
            const info = document.createElement('div');
            info.innerHTML = `
                <p class="mb-0"><strong>Número de Tarjeta:</strong> ${method.numero_tarjeta}</p>
                <p class="mb-0"><strong>Fecha de Expiración:</strong> ${method.fecha_expiracion}</p>
            `;

            // Añadir el checkbox y la información al contenedor del método
            methodDiv.appendChild(checkbox);
            methodDiv.appendChild(info);

            // Añadir el contenedor al formulario
            form.appendChild(methodDiv);
        });

        // Agregar el formulario al modal
        modalBody.appendChild(form);
    }
}

// Cargar los métodos de pago al abrir el modal
document.getElementById('exampleModal').addEventListener('show.bs.modal', mostrarMetodosPago);


