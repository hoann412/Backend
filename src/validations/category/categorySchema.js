import Joi from 'joi';

const categorySchema = {
    createCategory: Joi.object({
        name: Joi.string().min(2).max(50).required().messages({
            'string.base': 'Tên danh mục phải là chuỗi ký tự.',
            'string.empty': 'Tên danh mục không được bỏ trống.',
            'string.min': 'Tên danh mục phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên danh mục phải nhỏ hơn {#limit} ký tự.',
            'any.required': 'Tên danh mục là bắt buộc.',
        }),
    }),
    updateCategory: Joi.object({
        name: Joi.string().min(2).max(50).messages({
            'string.base': 'Tên danh mục phải là chuỗi ký tự.',
            'string.empty': 'Tên danh mục không được bỏ trống.',
            'string.min': 'Tên danh mục phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên danh mục phải nhỏ hơn hoặc bằng {#limit} ký tự.',
        }),
    }),
};

export default categorySchema;
