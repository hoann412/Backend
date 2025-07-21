import Joi from 'joi';

const tagSchema = {
    createTag: Joi.object({
        name: Joi.string().min(2).max(50).required().messages({
            'string.base': 'Tên thẻ phải là chuỗi ký tự.',
            'string.empty': 'Tên thẻ không được bỏ trống.',
            'string.min': 'Tên thẻ phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên thẻ phải nhỏ hơn {#limit} ký tự.',
            'any.required': 'Tên thẻ là bắt buộc.',
        }),
    }),
    updateTag: Joi.object({
        name: Joi.string().min(2).max(50).messages({
            'string.base': 'Tên thẻ phải là chuỗi ký tự.',
            'string.empty': 'Tên thẻ không được bỏ trống.',
            'string.min': 'Tên thẻ phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên thẻ phải nhỏ hơn hoặc bằng {#limit} ký tự.',
        }),
    }),
};

export default tagSchema;
