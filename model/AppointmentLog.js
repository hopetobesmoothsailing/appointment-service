const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    user_id: String,
    doctor_id: String,
    slot: String,
    alert_count: Number,
    created_at: String
})

module.exports = mongoose.model('AppointmentLogs', logSchema, 'appointment_logs');