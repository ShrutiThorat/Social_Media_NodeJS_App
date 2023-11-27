const express = require('express')
const { getPost, addPost } = require('../controllers/post')

const router = express.Router()

router.get('/', getPost)
router.post('/', addPost)

module.exports = router
