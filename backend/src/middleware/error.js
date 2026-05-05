module.exports = function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  // Multer file size error
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large' })
  }

  // Multer unexpected or custom file type errors (image/pdf)
  if (err && err.message && err.message.toLowerCase().includes('only image files')) {
    return res.status(400).json({ message: 'Only image files are allowed' })
  }

  if (err && err.message && err.message.toLowerCase().includes('only pdf')) {
    return res.status(400).json({ message: 'Only PDF files are allowed' })
  }

  const status = err.status || err.statusCode || 500
  const message = process.env.NODE_ENV === 'production' && status === 500 
    ? 'Internal Server Error' 
    : (err.message || 'Server Error')

  res.status(status).json({ message })
}
