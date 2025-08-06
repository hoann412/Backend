import { StatusCodes } from 'http-status-codes';
import { shippingService } from '../services/index.js';
import asyncHandler from '../helpers/asyncHandler.js';

export const getProvince = asyncHandler(async (req, res) => {
    const data = await shippingService.getProvince(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const getDistrict = asyncHandler(async (req, res) => {
    const data = await shippingService.getDistrict(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const getWard = asyncHandler(async (req, res) => {
    const data = await shippingService.getWard(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const getService = asyncHandler(async (req, res) => {
    const data = await shippingService.getService(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const calculateShippingFee = asyncHandler(async (req, res) => {
    const data = await shippingService.calculateShippingFee(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const getPickShift = asyncHandler(async (req, res) => {
    const data = await shippingService.getPickShift(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const createOrder = asyncHandler(async (req, res) => {
    const data = await shippingService.createOrder(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});
