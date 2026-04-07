const jwt = require("jsonwebtoken");

const JWT_SECRET = "bookzen_secret_2024";

const protect = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const role = req.body.role || req.query.role;

      // ✅ If token exists → verify user
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        // ✅ Role check (safe)
        if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }

        return next();
      }

      // ✅ If no token → fallback role check
      if (role && allowedRoles.length && allowedRoles.includes(role)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  };
};

module.exports = protect;