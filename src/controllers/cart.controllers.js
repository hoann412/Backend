import { cartService } from '../services/index.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '../helpers/response.js';

export const addToCart = asyncHandler(async (req, res) => {
    const cart = await cartService.addToCart(req, res);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: cart,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const removeCartItem = asyncHandler(async (req, res) => {
    await cartService.removeCartItem(req, res);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const removeAllCartItems = asyncHandler(async (req, res) => {
    await cartService.removeAllCartItems(req, res);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const getMyCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getMyCart(req, res);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: cart,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
    await cartService.updateCartItemQuantity(req, res);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
