// Array inicial de métodos de pago
let paymentMethods = [];

// Función para cargar los métodos de pago desde localStorage
function loadFromLocalStorage() {
    const storedMethods = localStorage.getItem('paymentMethods');
    if (storedMethods) {
        paymentMethods = JSON.parse(storedMethods);
    }
}

// Función para guardar los métodos de pago en localStorage
function saveToLocalStorage() {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
}

// Función para mostrar los métodos de pago
function loadPaymentMethods() {
    const paymentMethodsDiv = document.getElementById('payment-methods');
    paymentMethodsDiv.innerHTML = ''; // Limpiar contenido previo

    paymentMethods.forEach(method => {
        const methodDiv = document.createElement('div');
        methodDiv.classList.add('payment-method');
        methodDiv.innerHTML = `
            <p>Número de Tarjeta: ${method.numero_tarjeta}</p>
            <p>Fecha de Expiración: ${method.fecha_expiracion}</p>
            <button onclick="editPaymentMethod(${method.id})">Editar</button>
            <button onclick="deletePaymentMethod(${method.id})">Eliminar</button>
        `;
        paymentMethodsDiv.appendChild(methodDiv);
    });
}

// Función para agregar un nuevo método de pago
function addPaymentMethod() {
    document.getElementById('payment-form').style.display = 'block';
    clearForm();
}

// Función para editar un método de pago
function editPaymentMethod(id) {
    const method = paymentMethods.find(m => m.id === id);
    if (method) {
        document.getElementById('payment-form').style.display = 'block';
        document.getElementById('card-number').value = method.numero_tarjeta;
        document.getElementById('card-expery').value = method.fecha_expiracion;
        document.getElementById('card-cvv').value = method.cvv;
        document.getElementById('save-payment-method').setAttribute('data-id', id);
    }
}

// Validaciones dinámicas para los inputs
const cardNumberInput = document.getElementById('card-number');
const cardExpiryInput = document.getElementById('card-expery');
const cardCVVInput = document.getElementById('card-cvv');

// Limitar el número de tarjeta a 16 caracteres y solo números
cardNumberInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 16); // Solo números, máximo 16 dígitos
});

// Cambiar el tipo de input para fecha de expiración
cardExpiryInput.addEventListener('focus', function () {
    this.type = 'month'; // Cambia dinámicamente a tipo "month"
});

// Limitar el CVV a 3 caracteres y solo números
cardCVVInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 3); // Solo números, máximo 3 dígitos
});

// Función para guardar o actualizar un método de pago
document.getElementById('save-payment-method').addEventListener('click', function() {
    const id = this.getAttribute('data-id');
    const cardNumber = cardNumberInput.value;
    const cardExpiry = cardExpiryInput.value;
    const cardCVV = cardCVVInput.value;

    // Validar número de tarjeta
    if (cardNumber.length !== 16) {
        alert('El número de tarjeta debe tener exactamente 16 dígitos.');
        return;
    }

    // Validar fecha de expiración
    if (!cardExpiry) {
        alert('Por favor, selecciona una fecha de expiración válida.');
        return;
    }

    // Validar CVV
    if (cardCVV.length !== 3) {
        alert('El CVV debe tener exactamente 3 dígitos.');
        return;
    }

    if (id) {
        // Actualizar método de pago existente
        const method = paymentMethods.find(m => m.id == id);
        if (method) {
            method.numero_tarjeta = cardNumber;
            method.fecha_expiracion = cardExpiry;
            method.cvv = cardCVV;
        }
    } else {
        // Agregar nuevo método de pago
        const newId = paymentMethods.length ? paymentMethods[paymentMethods.length - 1].id + 1 : 1;
        paymentMethods.push({
            id: newId,
            numero_tarjeta: cardNumber,
            fecha_expiracion: cardExpiry,
            cvv: cardCVV
        });
    }

    saveToLocalStorage(); // Guardar cambios en localStorage
    loadPaymentMethods();
    document.getElementById('payment-form').style.display = 'none';
    clearForm();
});

// Función para eliminar un método de pago
function deletePaymentMethod(id) {
    paymentMethods = paymentMethods.filter(method => method.id !== id);
    saveToLocalStorage(); // Guardar cambios en localStorage
    loadPaymentMethods();
}

// Función para limpiar el formulario
function clearForm() {
    cardNumberInput.value = '';
    cardExpiryInput.value = '';
    cardCVVInput.value = '';
    document.getElementById('save-payment-method').removeAttribute('data-id');
}

// Función para cancelar la edición/agregar
document.getElementById('cancel-payment').addEventListener('click', function() {
    document.getElementById('payment-form').style.display = 'none';
    clearForm();
});

// Cargar métodos de pago al iniciar
document.getElementById('add-payment-method').addEventListener('click', addPaymentMethod);

// Cargar métodos desde localStorage al iniciar la página
window.onload = function() {
    loadFromLocalStorage(); // Recuperar datos del localStorage
    loadPaymentMethods();   // Mostrar los métodos de pago
};
