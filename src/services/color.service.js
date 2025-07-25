import Color from '../models/color.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '../helpers/response.js';
import handleQuery from '../utils/handleQuery.js';

// @Post create new color
export const createNewColor = async (req, res, next) => {
    // Check if a color with the same name already exists
    const existingColor = await Color.findOne({ name: req.body.name.toLowerCase() });
    const existingColorUpperCase = await Color.findOne({ name: req.body.name });
    req.body.name = req.body.name.toLowerCase();


    if (existingColor ||existingColorUpperCase) {
        return res.status(StatusCodes.CONFLICT).json(
            customResponse({
                data: null,
                message: 'Tên màu đã tồn tại',
                status: StatusCodes.CONFLICT,
                success: false,
            }),
        );
    }


    const color = await Color.create(req.body);

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: color,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
            success: true,
        }),
    );
};

// @Get get all color
export const getAllColors = async (req, res, next) => {
    const { data, page, todalDocs, totalPages } = await handleQuery(req, Color);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                colors: data,
                page,
                todalDocs,
                totalPages,
            },
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @Get get detailed color
export const getDetailedColor = async (req, res, next) => {
    const color = await Color.findById(req.params.id).lean();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: color,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// @Post update color
export const updateColor = async (req, res, next) => {
    const newColor = await Color.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
    });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newColor,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
