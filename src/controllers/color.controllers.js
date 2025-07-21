import asyncHandler from '../helpers/asyncHandler.js';
import { colorServices } from '../services/index.js';

// @Post create new color
export const createColor = asyncHandler(async (req, res, next) => {
    return colorServices.createNewColor(req, res, next);
});

// @Get get all colors
export const getAllColors = asyncHandler(async (req, res, next) => {
    return colorServices.getAllColors(req, res, next);
});
// @Get get detailed color
export const getDetailedColor = asyncHandler(async (req, res, next) => {
    return colorServices.getDetailedColor(req, res, next);
});

// @Patch update color
export const updateColor = asyncHandler(async (req, res, next) => {
    return colorServices.updateColor(req, res, next);
});
