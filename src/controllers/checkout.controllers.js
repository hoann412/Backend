import asyncHandler from '../helpers/asyncHandler.js';
import { checkoutService } from '../services/index.js';

export const createPaymentUrlWithVNpay = asyncHandler(async (req, res, next) => {
    return await checkoutService.createPaymentUrlWithVNpay(req, res, next);
});
export const vnpayReturn = asyncHandler(async (req, res, next) => {
    return await checkoutService.vnpayReturn(req, res, next);
});
export const vnpayIPN = asyncHandler(async (req, res, next) => {
    return await checkoutService.vnpayIpn(req, res, next);
});
