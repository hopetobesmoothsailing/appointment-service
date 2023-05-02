const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    phone: String,
    name: String
});

module.exports = mongoose.model('Users', userSchema, 'users');