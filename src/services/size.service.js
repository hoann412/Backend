import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '../helpers/response.js';
import Size from '../models/size.js';
import handleQuery from '../utils/handleQuery.js';

// @Post create new size
export const createNewSize = async (req, res, next) => {
    const size = await Size.create(req.body);

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: size,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @Get get all size
export const getAllSizes = async (req, res, next) => {
    const { data, page, totalDocs, totalPages } = await handleQuery(req, Size);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                sizes: data,
                page,
                totalDocs,
                totalPages,
            },
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @Get get detailed size
export const getDetailedSize = async (req, res, next) => {
    const size = await Size.findById(req.params.id).lean();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: size,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @Post update color
export const updateSize = async (req, res, next) => {
    const newSize = await Size.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
    });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newSize,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
