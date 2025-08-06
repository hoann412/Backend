import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/customError.js';
import customResponse from '../helpers/response.js';
import category from '../models/category.js';
import handleQuery from '../utils/handleQuery.js';

// @Post create new category
export const createNewCategory = async (req, res, next) => {
    const newCategory = await category.create(req.body);

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newCategory,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.OK,
            success: true,
        }),
    );
};

// @Get get all categories
export const getAllCategories = async (req, res, next) => {
    const { data, page, totalDocs, totalPages } = await handleQuery(req, category);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                categories: data,
                page,
                totalDocs,
                totalPages,
            },
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
            success: true,
        }),
    );
};

// @Get get detailed category
export const getDetailedCategory = async (req, res, next) => {
    const newCategory = await category.findById(req.params.id).lean();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newCategory,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
            success: true,
        }),
    );
};

// @Patch edit category
export const updateCategory = async (req, res, next) => {
    const foundedCategory = await category.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).lean();

    if (!foundedCategory) {
        throw new BadRequestError('Danh mục không tồn tại!');
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: { category: foundedCategory },
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
            success: true,
        }),
    );
};
