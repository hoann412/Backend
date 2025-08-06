import { BadRequestError } from '../../errors/customError.js';
import category from '../../models/category.js';
import validator from '../validator.js';
import { categorySchema } from './index.js';

export const createCategoryValidation = async (req, res, next) => {
    const { name } = req.body;

    const checkUniqueName = await category.findOne({ name }).select('_id').lean();

    if (checkUniqueName) {
        next(new BadRequestError('Tên danh mục đã tồn tại!'));
    }

    return validator(categorySchema.createCategory, req.body, next);
};

export const updateCategoryValidation = async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const checkUniqueName = await category.findOne({ name }).select('_id').lean();

    if (checkUniqueName && id !== checkUniqueName._id.toString()) {
        next(new BadRequestError('Tên danh mục đã tồn tại!'));
    }

    return validator(categorySchema.updateCategory, req.body, next);
};
