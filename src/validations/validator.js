import { BadRequestError } from '../errors/customError.js';

const validator = async (schemaName, body, next) => {
    const value = schemaName.validate(body, {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    });

    try {
        value.error ? next(new BadRequestError(value.error.details?.[0].message)) : next();
    } catch (error) {
        console.log(error);
    }
};

export default validator;
