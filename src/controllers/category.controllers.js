import asyncHandler from '../helpers/asyncHandler.js';
import { categoryServices } from '../services/index.js';

// @Post create new category
export const createCategory = asyncHandler(async (req, res, next) => {
    return categoryServices.createNewCategory(req, res, next);
});

// @Get get all categories
export const getAllCategories = asyncHandler(async (req, res, next) => {
    return categoryServices.getAllCategories(req, res, next);
});
// @Get get category
export const getDetailedCategory = asyncHandler(async (req, res, next) => {
    return categoryServices.getDetailedCategory(req, res, next);
});

// @Patch update category
export const updateCategory = asyncHandler(async (req, res, next) => {
    return categoryServices.updateCategory(req, res, next);
});
