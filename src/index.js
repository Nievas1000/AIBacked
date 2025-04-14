const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const errorHandler = require('./middlewares/error.middleware')
const corsOptionsDelegate = require('./middlewares/cors.middleware')

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptionsDelegate));
app.use(helmet())
app.use(morgan('dev'))

app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/clinics', require('./routes/clinics.route'))
app.use('/api/doctors', require('./routes/doctors.route'))
app.use('/api/patients', require('./routes/patients.route'))
app.use('/api/appointments', require('./routes/appointments.route'))
app.use('/api/chat', require('./routes/chat.route'))
app.use('/api/faqs', require('./routes/faqs.route'))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
