const db = require('./connect')
const jwt = require('jsonwebtoken')

const getUser = (req, res) => {
  const userId = req.params.userId
  const q = 'SELECT * FROM users WHERE id = ?'

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err)
    // const { password, ...info } = data[0]
    return res.status(200).json(data)
  })
}

const updateUser = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('not logged in')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('token not valid')

    const q =
      'UPDATE users SET name=?, city=?, website=?, profilePic=?, coverPic=? WHERE ID=?'

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.affectedRows > 0) return res.status(200).json('Updated')
        else return res.status(403).json('You can update only your post')
      }
    )
  })
}

module.exports = { getUser, updateUser }
