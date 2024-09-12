export class APIException<T extends APIExceptionCode> extends Error {
    constructor(
        readonly code: T,
        message: string,
    ) {
        super(message);
        this.name = 'APIException';
    }
}
