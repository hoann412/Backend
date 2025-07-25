import { statsService } from '../services/index.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '../helpers/response.js';

export const totalStats = asyncHandler(async (req, res, next) => {
    const stats = await statsService.totalStats(req, res, next);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: stats,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const orderByDayStats = asyncHandler(async (req, res, next) => {
    const stats = await statsService.orderByDayStats(req, res, next);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: stats,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const orderByMonthStats = asyncHandler(async (req, res, next) => {
    const stats = await statsService.orderByMonthStats(req, res, next);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: stats,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const orderByYearStats = asyncHandler(async (req, res, next) => {
    const stats = await statsService.orderByYearStats(req, res, next);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: stats,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const orderByDateRangeStats = asyncHandler(async (req, res, next) => {
    const stats = await statsService.orderByDateRangeStats(req, res, next);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: stats,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const getProductStats = asyncHandler(async (req, res, next) => {
    const stats = await statsService.getProductStats(req, res, next);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: stats,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
export const getTop5Buyers = asyncHandler(async (req, res, next) => {
    const stats = await statsService.findTop5Buyers(req, res, next);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: stats,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
