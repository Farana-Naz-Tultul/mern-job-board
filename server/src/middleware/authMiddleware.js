import jwt from "jsonwebtoken"; //Importing JWT

// Middleware to protect routes
const authMiddleware = (req, res, next) => { //Middleware Function, This is an Express middleware.
    //Get the Authorization Header, In HTTP requests, the token is usually sent in the Authorization header.
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided, authorization denied" });
  }
//Extract the Token, .split(" ") splits it into ["Bearer", "sometokenhere"], [1] grabs just the actual token.
  const token = authHeader.split(" ")[1]; // Get token after "Bearer", 

  try {
    //Verify the Token, process.env.JWT_SECRET is the secret key we set in
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request, Now req.user holds info from the token (like user ID).
    next(); // Move on to the next middleware/route
    //If jwt.verify fails (bad token, expired token, wrong secret), we send 401 Unauthorized.
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};
//This makes the middleware available for other files (like job routes).
export default authMiddleware;