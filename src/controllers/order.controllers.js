import asyncHandler from '../helpers/asyncHandler.js';
import { orderServices } from '../services/index.js';

export const createOrder = asyncHandler(async (req, res, next) => {
    return await orderServices.createOrder(req, res, next);
});
export const getAllOrdersByUser = asyncHandler(async (req, res, next) => {
    return await orderServices.getAllOrdersByUser(req, res, next);
});
export const getAllOrders = asyncHandler(async (req, res, next) => {
    return await orderServices.getAllOrders(req, res, next);
});
export const getDetailedOrder = asyncHandler(async (req, res, next) => {
    return await orderServices.getDetailedOrder(req, res, next);
});
export const cancelOrder = asyncHandler(async (req, res, next) => {
    return await orderServices.cancelOrder(req, res, next);
});
export const confirmOrder = asyncHandler(async (req, res, next) => {
    return await orderServices.confirmOrder(req, res, next);
});
export const shippingOrder = asyncHandler(async (req, res, next) => {
    return await orderServices.shippingOrder(req, res, next);
});
export const finishOrder = asyncHandler(async (req, res, next) => {
    return await orderServices.finishOrder(req, res, next);
});
export const deliverOrder = asyncHandler(async (req, res, next) => {
    return await orderServices.deliverOrder(req, res, next);
});
