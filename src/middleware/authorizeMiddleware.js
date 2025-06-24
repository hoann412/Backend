import { UnAuthorizedError } from '../errors/customError.js';

export const authorsize = (...allowedRoles) => {
    return (req, res, next) => {
        if (req.role && allowedRoles.includes(req.role)) {
            return next();
        } else {
            return next(new UnAuthorizedError('No permission to access!'));
        }
    };
};
