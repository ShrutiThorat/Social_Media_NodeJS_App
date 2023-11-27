const db = require('./connect')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = (req, res) => {
  //CHECK USER IF EXISTS
  const q = 'SELECT * FROM users WHERE username = ?'

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length) return res.status(404).json('User already exists')

    //HASH THE PASSWORD
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)

    //CREATE NEW USER
    const q = 'INSERT INTO users(username, email, password, name) VALUES (?)'
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      else res.status(200).json('User has been created')
    })
  })
}

const login = (req, res) => {
  const q = 'SELECT * FROM users WHERE username=?'

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length === 0) return res.status(404).json('User not exists')

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0]?.password
    )

    if (!checkPassword)
      return res.status(400).json('Wrong username or password')

    const token = jwt.sign({ id: data[0].id }, 'secretkey')
    const { password, ...others } = data[0]
    return res
      .cookie('accessToken', token, {
        httpOnly: true,
      })
      .status(200)
      .json(others)
  })
}

const logout = (req, res) => {
  res
    .clearCookie('accessToken', {
      secure: true,
      sameSite: 'none',
    })
    .status(200)
    .json('User has been logged out')
}

module.exports = {
  login,
  logout,
  register,
}
