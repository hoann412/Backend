export const customResponse = ({ data, success, message, status }) => {
    return {
        success,
        message,
        status,
        data,
    };
};

export default customResponse;
