const express = require('express')
const router = express.Router();
const Controller = require('./controller')

router.post('/register_user', Controller.register_user)

router.post('/register_doctor', Controller.register_doctor)

router.post('/signup', Controller.signup)

module.exports = router;