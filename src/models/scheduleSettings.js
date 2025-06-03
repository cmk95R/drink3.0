import mongoose from "mongoose";

const ScheduleSettingsSchema = new mongoose.Schema({
  orderCutoff: {
    type: String,
    default: '15:00'
  },
  deliveryDays: {
    type: [String],
    default: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  }
}, {
  timestamps: true
});

export default mongoose.model('ScheduleSettings', ScheduleSettingsSchema);