import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user._id, name: user.name, email: user.email };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
