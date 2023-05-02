const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    id: String,
    name: String,
    spec: String,
    slots: Array
});

module.exports = mongoose.model('Doctors', doctorSchema, 'doctors');