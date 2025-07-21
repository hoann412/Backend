import { BadRequestError } from '../../errors/customError.js';
import Tag from '../../models/tag.js';
import validator from '../validator.js';
import { TagSchema } from './index.js';

export const createTagValidation = async (req, res, next) => {
    const { name } = req.body;

    const checkUniqueName = await Tag.findOne({ name }).select('_id').lean();

    if (checkUniqueName) {
        next(new BadRequestError('Tên thẻ đã tồn tại!'));
    }

    return validator(TagSchema.createTag, req.body, next);
};

export const updateTagValidation = async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const checkUniqueName = await Tag.findOne({ name }).select('_id').lean();

    if (checkUniqueName && id !== checkUniqueName._id.toString()) {
        next(new BadRequestError('Tên thẻ đã tồn tại!'));
    }

    return validator(TagSchema.updateTag, req.body, next);
};
