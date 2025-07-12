import asyncHandler from '../helpers/asyncHandler.js';
import { userServices } from '../services/index.js';

// @Get: getAllUsers
export const getAllUsers = asyncHandler(async (req, res, next) => {
    return await userServices.getAllUsers(req, res, next);
});
// @Patch change password
export const changePassword = asyncHandler(async (req, res, next) => {
    return userServices.changePassword(req, res, next);
});
// @Patch forgot password
export const forgotPassword = asyncHandler(async (req, res, next) => {
    return userServices.forgotPassword(req, res, next);
});

// @Get getProfile
export const getProfile = asyncHandler(async (req, res, next) => {
    return userServices.getProfile(req, res, next);
});

// @Patch getProfile
export const updateProfile = asyncHandler(async (req, res, next) => {
    return userServices.updateProfile(req, res, next);
});

// @Get: getWishListByUser
export const getWishListByUser = asyncHandler(async (req, res, next) => {
    return userServices.getWishListByUser(req, res);
});
// @Patch: addWishList
export const addWishList = asyncHandler(async (req, res, next) => {
    return userServices.addWishList(req, res);
});
// @Patch: deleteWishList
export const deleteWishList = asyncHandler(async (req, res, next) => {
    return userServices.deleteWishList(req, res);
});
