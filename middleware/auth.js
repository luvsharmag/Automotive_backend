import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "yoursecret";

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token from header:", req.headers.authorization);

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // userId will be available as req.user.userId
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default auth;
