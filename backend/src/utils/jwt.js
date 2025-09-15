import jwt from 'jsonwebtoken';

export function signJWT(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}
