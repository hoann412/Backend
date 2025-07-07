export class HttpException extends Error {
    message;

    constructor(message) {
        super(message);
        this.message = message;
    }
}
