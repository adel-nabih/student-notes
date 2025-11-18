import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const adminMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user to the request
      req.user = await User.findById(decoded.id).select('-password');

      // --- THE NEW PART ---
      // Check if user is an admin
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ msg: 'Forbidden: Admin access only' });
      }
      // ---------------------

    } catch (error) {
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

export default adminMiddleware;