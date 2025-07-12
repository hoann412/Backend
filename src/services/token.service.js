import jwt from 'jsonwebtoken';
import Token from '../models/token.js';

export const generateToken = (user, key, expires) => {
    const payload = user;
    const secretKey = key;
    return jwt.sign(payload, secretKey, { expiresIn: expires || '300d' });
};
export const saveToken = async (token, userId, type) => {
    return await Token.create({ token, user: userId, type });
};
