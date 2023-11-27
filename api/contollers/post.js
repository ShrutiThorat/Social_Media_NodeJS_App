const db = require('./connect')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const getPost = (req, res) => {
  const userId = req.query.userId
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('not logged in')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('token not valid')

    const q =
      userId !== 'undefined'
        ? 'SELECT p.*, u.id AS userId, name, profilePic FROM posts p JOIN users u ON (p.userId = u.id) WHERE P.userId = ?'
        : 'SELECT p.*, u.id AS userId, name, profilePic FROM posts p JOIN users u ON (p.userId = u.id) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ?'

    // OR p.userId = ?

    const values = userId !== 'undefined' ? [userId] : [userInfo.id]

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err)
      else return res.status(200).json(data)
    })
  })
}

const addPost = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('not logged in')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('token not valid')

    const q =
      'INSERT INTO posts(description, img, createdAt, userId) VALUES (?)'

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userInfo.id,
    ]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      else return res.status(200).json('Post has been created')
    })
  })
}

module.exports = { getPost, addPost }
