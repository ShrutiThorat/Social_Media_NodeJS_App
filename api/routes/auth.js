const express = require('express')
const { register, login, logout } = require('../controllers/auth')

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)

module.exports = router
