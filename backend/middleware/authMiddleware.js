import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(' ')[1];

      //  Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get the user from the token's ID
      // We attach the user to the 'req' object so our controllers can use it
      req.user = await User.findById(decoded.id).select('-password');

      // Continue to the next function (the controller)
      next();

    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

export default authMiddleware;