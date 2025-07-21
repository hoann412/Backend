import { BadRequestError } from '../../errors/customError.js';
import Color from '../../models/color.js';
import validator from '../validator.js';
import { colorSchema } from './index.js';

export const createColorValidation = async (req, res, next) => {
    const { name } = req.body;

    const checkUniqueName = await Color.findOne({ name }).select('_id').lean();

    if (checkUniqueName) {
        next(new BadRequestError('Tên màu đã tồn tại!'));
    }

    return validator(colorSchema.createColor, req.body, next);
};

export const updateColorValidation = async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const checkUniqueName = await Color.findOne({ name }).select('_id').lean();

    if (checkUniqueName && id !== checkUniqueName._id.toString()) {
        next(new BadRequestError('Tên màu đã tồn tại!'));
    }

    return validator(colorSchema.updateColor, req.body, next);
};
