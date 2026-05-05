module.exports = function allowedRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Authorize failed: No req.user found');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log(`Authorize Check: ${req.method} ${req.originalUrl} | User Role: "${req.user.role}" | Allowed Roles: [${roles.join(', ')}]`);

    const userRole = (req.user.role || '').toLowerCase();
    const allowed = roles.map(r => r.toLowerCase());

    if (!allowed.includes(userRole)) {
      console.log(`Authorize Forbidden: User role "${req.user.role}" is not in [${roles.join(', ')}]`);
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
