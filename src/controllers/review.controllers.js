import asyncHandler from '../helpers/asyncHandler.js';
import { reviewServices } from '../services/index.js';

// @Post create new review
export const createReview = asyncHandler(async (req, res, next) => {
    return reviewServices.createReview(req, res, next);
});

// @Get get all reviews
export const getAllAdminReviews = asyncHandler(async (req, res, next) => {
    return reviewServices.getAllReviews(req, res, next);
});

// @Get get all review by product id
export const getAllReviewsProduct = asyncHandler(async (req, res, next) => {
    return reviewServices.getAllReviewsProduct(req, res, next);
});

export const getAllRatingProduct = asyncHandler(async (req, res, next) => {
    return reviewServices.useGetAllReviewStar(req, res, next);
});
export const activeReview = asyncHandler(async (req, res, next) => {
    return reviewServices.activeReview(req, res, next);
});
export const hiddenReview = asyncHandler(async (req, res, next) => {
    return reviewServices.hiddenReview(req, res, next);
});
