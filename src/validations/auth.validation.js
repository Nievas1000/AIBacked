const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(7, 'Phone number is too short'),
  role: z.enum(['admin', 'receptionist', 'doctor']),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

module.exports = { registerSchema, loginSchema }
