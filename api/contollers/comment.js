const db = require('./connect')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const getComments = (req, res) => {
  const q =
    'SELECT c.*, u.id AS userId, name, profilePic FROM comments c JOIN users u ON (u.id = c.userId) WHERE c.postId=? ORDER BY c.createdAt DESC'

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err)
    else return res.status(200).json(data)
  })
}

const addComments = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('not logged in')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('token not valid')

    const q =
      'INSERT INTO comments(description, createdAt, userId, postId) VALUES (?)'

    const values = [
      req.body.desc,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userInfo.id,
      req.body.postId,
    ]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      else return res.status(200).json('Comment has been created')
    })
  })
}

module.exports = { getComments, addComments }
