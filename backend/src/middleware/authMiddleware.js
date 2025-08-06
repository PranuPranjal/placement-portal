const jwt = require('jsonwebtoken');

// Generic authentication - just validates token
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Student-specific authentication
exports.authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (decoded.role !== 'student') return res.status(403).json({ error: "Forbidden" });
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

exports.authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (decoded.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
