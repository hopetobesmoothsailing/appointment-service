const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/appointment_doctor').then(() => {
    console.log('mongodb connected')
});
const conn = mongoose.connection;
conn.on('connected', () => console.log('mongodb connected successfully'));
conn.on('disconnected', () => console.log('mongodb disconnected'));
conn.on('error', () => console.error.bind(console, 'connection error:'));
module.exports = conn;