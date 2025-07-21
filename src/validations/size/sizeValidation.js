import { BadRequestError } from '../../errors/customError.js';
import Size from '../../models/size.js';
import validator from '../validator.js';
import { SizeSchema } from './index.js';

export const createSizeValidation = async (req, res, next) => {
    const { name } = req.body;

    const checkUniqueName = await Size.findOne({ name }).select('_id').lean();

    if (checkUniqueName) {
        next(new BadRequestError('Tên kích thước đã tồn tại!'));
    }

    return validator(SizeSchema.createSize, req.body, next);
};

export const updateSizeValidation = async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;

    const checkUniqueName = await Size.findOne({ name }).select('_id').lean();

    if (checkUniqueName && id !== checkUniqueName._id.toString()) {
        next(new BadRequestError('Tên kích thước đã tồn tại!'));
    }

    return validator(SizeSchema.updateSize, req.body, next);
};
