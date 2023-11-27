const express = require('express')
const {
  getRelationships,
  addRelationship,
  deleteRelationship,
} = require('../controllers/relationship')

const router = express.Router()

router.get('/', getRelationships)
router.post('/', addRelationship)
router.delete('/', deleteRelationship)

module.exports = router
