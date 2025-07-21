import Joi from 'joi';

const colorSchema = {
    createColor: Joi.object({
        name: Joi.string().min(2).max(50).required().messages({
            'string.base': 'Tên màu phải là chuỗi ký tự.',
            'string.empty': 'Tên màu không được bỏ trống.',
            'string.min': 'Tên màu phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên màu phải nhỏ hơn {#limit} ký tự.',
            'any.required': 'Tên màu là bắt buộc.',
        }),
        hex: Joi.string().min(4).max(7).required().messages({
            'string.base': 'Tên màu phải là chuỗi ký tự.',
            'string.empty': 'Tên màu không được bỏ trống.',
            'string.min': 'Tên màu phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên màu phải nhỏ hơn {#limit} ký tự.',
            'any.required': 'Tên màu là bắt buộc.',
        }),
    }),
    updateColor: Joi.object({
        name: Joi.string().min(2).max(50).messages({
            'string.base': 'Tên màu phải là chuỗi ký tự.',
            'string.empty': 'Tên màu không được bỏ trống.',
            'string.min': 'Tên màu phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên màu phải nhỏ hơn hoặc bằng {#limit} ký tự.',
        }),
        hex: Joi.string().min(3).max(7).required().messages({
            'string.base': 'Tên màu phải là chuỗi ký tự.',
            'string.empty': 'Tên màu không được bỏ trống.',
            'string.min': 'Tên màu phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên màu phải nhỏ hơn {#limit} ký tự.',
        }),
    }),
};

export default colorSchema;
