// requireRole('admin') or requireRole('admin','client')
module.exports = function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (allowed.length === 0) return next()
    if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}
