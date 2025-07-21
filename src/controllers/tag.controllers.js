import asyncHandler from '../helpers/asyncHandler.js';
import { tagServices } from '../services/index.js';
export const createTag = asyncHandler(async (req, res, next) => {
    return tagServices.createNewTag(req, res, next);
});

// @Get get Tag
export const getDetailedTag = asyncHandler(async (req, res, next) => {
    return tagServices.getDetailedTag(req, res, next);
});
// @Get get all Tag
export const getAllTag = asyncHandler(async (req, res, next) => {
    return tagServices.getAllTag(req, res, next);
});

// @Patch update Tag
export const updateTag = asyncHandler(async (req, res, next) => {
    return tagServices.updateTag(req, res, next);
});
