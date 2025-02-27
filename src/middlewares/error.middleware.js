const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  const message = err.message || 'Internal Server Error'
  const status = err.status || 500

  res.status(status).json({ message })
}

module.exports = errorHandler
