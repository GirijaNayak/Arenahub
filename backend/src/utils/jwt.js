import jwt from 'jsonwebtoken';
export const signToken = user => jwt.sign({ id:user.id, email:user.email, name:user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
export const verifyToken = token => jwt.verify(token, process.env.JWT_SECRET);
