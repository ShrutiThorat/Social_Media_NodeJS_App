const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const multer = require('multer')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')
const likeRoute = require('./routes/likes')
const relationshipRoute = require('./routes/relationships')
const storiesRoute = require('./routes/stories')

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:8800/api/',
  })
)
app.use(cookieParser())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'D:/NodeJS/social-app/client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ' - ' + file.originalname)
  },
})
const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file
  res.status(200).json(file.filename)
})

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)
app.use('/api/likes', likeRoute)
app.use('/api/relationships', relationshipRoute)
app.use('/api/stories', storiesRoute)

app.listen(8800, () => {
  console.log('api working')
})
