import Schedule from "../models/schedule.js";
import ScheduleSettings from "../models/scheduleSettings.js";

/**
 * @desc    Renderiza la página principal de horarios
 * @route   GET /horarios
 * @access  Privado
 */
export const renderScheduleMainPage = async (req, res) => {
  try {
    // Obtener horarios regulares (semana)
    const regularSchedules = await Schedule.find({ type: 'regular' }).sort({ order: 1 });
    
    // Obtener horarios especiales (feriados, etc)
    const specialSchedules = await Schedule.find({ type: 'special' })
      .sort({ date: 1 })
      .lean();
      
    // Formatear fechas para vista
    specialSchedules.forEach(schedule => {
      schedule.formattedDate = new Date(schedule.date).toISOString().split('T')[0];
    });
    
    // Obtener configuración
    const settings = await ScheduleSettings.findOne() || new ScheduleSettings();
    
    res.render('horarios', {
      title: 'Gestión de Horarios',
      schedules: {
        regular: regularSchedules,
        special: specialSchedules
      },
      settings: {
        orderCutoff: settings.orderCutoff || '15:00',
        deliveryDays: settings.deliveryDays || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
      }
    });
    
  } catch (error) {
    console.error('Error al cargar horarios:', error);
    req.flash('error_msg', 'Error al cargar los horarios');
    res.redirect('/');
  }
};
