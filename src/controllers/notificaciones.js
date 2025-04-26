export const enviarNotificacion = (req, res) => {
  const { tipo, mensaje } = req.body;

  // Lógica para guardar o procesar la notificación
  if (tipo === 'success') {
      res.json({ status: 'success', message: mensaje });
  } else {
      res.json({ status: 'error', message: mensaje });
  }
};