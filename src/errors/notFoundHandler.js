import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from './customError.js';

const notFoundHandler = (req, res, next) => {
    const err = new NotFoundError('This route does not exist.');
    err.status = StatusCodes.NOT_FOUND;
    next(err);
};

export default notFoundHandler;
