const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.route')
const errorHandler = require('./middlewares/error.middleware')

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
