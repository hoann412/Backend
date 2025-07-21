import Joi from 'joi';

const SizeSchema = {
    createSize: Joi.object({
        name: Joi.string().min(2).max(50).required().messages({
            'string.base': 'Tên kích thước phải là chuỗi ký tự.',
            'string.empty': 'Tên kích thước không được bỏ trống.',
            'string.min': 'Tên kích thước phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên kích thước phải nhỏ hơn {#limit} ký tự.',
            'any.required': 'Tên kích thước là bắt buộc.',
        }),
    }),
    updateSize: Joi.object({
        name: Joi.string().min(2).max(50).messages({
            'string.base': 'Tên kích thước phải là chuỗi ký tự.',
            'string.empty': 'Tên kích thước không được bỏ trống.',
            'string.min': 'Tên kích thước phải lớn hơn hoặc bằng {#limit} ký tự.',
            'string.max': 'Tên kích thước phải nhỏ hơn hoặc bằng {#limit} ký tự.',
        }),
    }),
};

export default SizeSchema;
