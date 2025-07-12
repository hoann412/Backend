import asyncHandler from '../helpers/asyncHandler.js';
import { authServices } from '../services/index.js';

// @Register
export const register = asyncHandler(async (req, res, next) => {
    return await authServices.register(req, res, next);
});
// @Login
export const login = asyncHandler(async (req, res, next) => {
    return await authServices.login(req, res, next);
});
// @send mail Verify
export const sendMailVerify = asyncHandler(async (req, res, next) => {
    return await authServices.sendMailverifyAccount(req, res, next);
});
export const sendMailResetPassword = asyncHandler(async (req, res, next) => {
    return await authServices.sendMailForgotPassword(req, res, next);
});
// @Verify
export const verifyEmail = asyncHandler(async (req, res, next) => {
    return await authServices.verifyEmail(req, res, next);
});
