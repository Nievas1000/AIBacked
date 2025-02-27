const authService = require('../services/auth.service')
const jwt = require('jsonwebtoken')

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, role, password } = req.body
    const user = await authService.registerUser(name, email, phone, role, password)
    res.status(201).json({ message: 'User registered successfully', user })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await authService.loginUser(email, password)

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000
    })

    res.json({ message: 'Login successful' })
  } catch (error) {
    next(error)
  }
}

exports.logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
}
