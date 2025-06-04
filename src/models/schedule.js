import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['regular', 'special'],
    required: true
  },
  day: {
    type: String,
    required: function() { return this.type === 'regular'; }
  },
  order: {
    type: Number,
    required: function() { return this.type === 'regular'; }
  },
  date: {
    type: Date,
    required: function() { return this.type === 'special'; }
  },
  description: {
    type: String,
    required: function() { return this.type === 'special'; }
  },
  open: {
    type: String,
    required: true
  },
  close: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Schedule', ScheduleSchema);