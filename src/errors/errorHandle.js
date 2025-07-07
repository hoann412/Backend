import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
    const name = err.name;

    res.status(status).json({
        data: null,
        success: false,
        status: status,
        name: name,
        message: message,
    });
};

export default errorHandler;
