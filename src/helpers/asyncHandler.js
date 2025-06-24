const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        } finally {
            if (req.session) {
                req.session.endSession();
            }
        }
    };
};

export default asyncHandler;
