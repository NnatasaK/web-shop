import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = { id: user.id, username: user.username, role: user.role };
    console.log("Authenticated User:", req.user);
    next();
  });
};

// Middleware for role-based access control
export const authorizeRole = (role) => {
  return (req, res, next) => {
    console.log("User Role:", req.user.role);
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};

// Inactivity timeout
export const inactivityTimeout = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const { lastActivity, username, role } = decoded;

    const currentTime = Date.now();

    // Check if more than 5 minutes have passed
    const inactivityLimit = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (currentTime - lastActivity > inactivityLimit) {
      return res
        .status(440)
        .json({ message: "Session timed out due to inactivity." });
    }

    const refreshedToken = jwt.sign(
      { username, role, lastActivity: currentTime },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", refreshedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });

    next();
  });
};
