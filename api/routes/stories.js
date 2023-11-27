const express = require('express')
const { getStories, addStory, deleteStory } = require('../controllers/story')

const router = express.Router()

router.get('/', getStories)
router.post('/', addStory)
router.delete('/:id', deleteStory)

module.exports = router
