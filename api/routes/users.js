const express = require('express')
const { getUser, updateUser } = require('../controllers/user')

const router = express.Router()

router.get('/find/:userId', getUser)
router.put('/', updateUser)

module.exports = router
