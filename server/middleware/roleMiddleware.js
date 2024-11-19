const jwt = require("jsonwebtoken");

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    });
  };
};

module.exports = authorizeRoles;