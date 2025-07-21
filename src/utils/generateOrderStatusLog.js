const generateOrderStatusLog = ({ statusChangedBy, orderStatus, reason = '' }) => {
    const createAt = new Date();
    return {
        statusChangedBy,
        orderStatus,
        reason,
        createAt: createAt.toISOString(),
    };
};

export default generateOrderStatusLog;
