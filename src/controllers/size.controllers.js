import asyncHandler from '../helpers/asyncHandler.js';
import { sizeServices } from '../services/index.js';

// @Post create new size
export const createSize = asyncHandler(async (req, res, next) => {
    return sizeServices.createNewSize(req, res, next);
});

// @Get get all sizes
export const getAllSizes = asyncHandler(async (req, res, next) => {
    return sizeServices.getAllSizes(req, res, next);
});
// @Get get size
export const getDetailedSize = asyncHandler(async (req, res, next) => {
    return sizeServices.getDetailedSize(req, res, next);
});

// @Patch update size
export const updateSize = asyncHandler(async (req, res, next) => {
    return sizeServices.updateSize(req, res, next);
});
