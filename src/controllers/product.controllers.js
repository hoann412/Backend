import { productService } from '../services/index.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '../helpers/response.js';

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await productService.getAllProducts(req.query);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const getBestSellingProducts = asyncHandler(async (req, res) => {
    const products = await productService.getBestSellingProducts();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const getDiscountProducts = asyncHandler(async (req, res) => {
    const products = await productService.getDiscountProducts();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const getProductById = asyncHandler(async (req, res) => {
    const products = await productService.getProductById(req.params.id);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const getProductByIdForAdmin = asyncHandler(async (req, res) => {
    const products = await productService.getProductByIdForAdmin(req.params.id);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
    return await productService.getRelatedProducts(req, res);
});

export const createProduct = asyncHandler(async (req, res) => {
    const pro = await productService.createProduct(req.body, req.files);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: pro,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});

export const updateProduct = asyncHandler(async (req, res) => {
    let { variantString, oldImageUrlRefs, ...productNew } = req.body;
    console.log(req.body, 'productNew');
    oldImageUrlRefs = oldImageUrlRefs ? JSON.parse(oldImageUrlRefs) : [];
    const variants = variantString ? JSON.parse(variantString) : [];
    const productId = req.params.id;
    const files = req.files;
    const pro = await productService.updateProduct(productId, oldImageUrlRefs, files, variants, productNew);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: pro,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});

// @PATCH: hiddenProduct
export const hiddenProduct = asyncHandler(async (req, res, next) => {
    return await productService.hiddenProduct(req, res, next);
});
// @PATCH: showProduct
export const showProduct = asyncHandler(async (req, res, next) => {
    return await productService.showProduct(req, res, next);
});
