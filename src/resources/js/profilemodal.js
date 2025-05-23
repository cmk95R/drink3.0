const form = document.getElementById("changePasswordForm");
const successModal = document.getElementById("successModal");
const errorBox = document.getElementById("errorBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita la recarga de la página

  const formData = new FormData(form);
  const response = await fetch("/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmNewPassword: formData.get("confirmPassword"), // <- CAMBIADO AQUÍ
    }),
  });

  const result = await response.json();

  if (result.success) {
    successModal.style.display = "flex"; // Muestra el modal
    errorBox.style.display = "none";     // Oculta mensajes de error
  } else {
    errorBox.textContent = result.message;
    errorBox.style.display = "block";    // Muestra el mensaje de error
  }
});

function closeModal() {
  successModal.style.display = "none"; // Oculta el modal
}


