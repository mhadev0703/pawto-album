export class SSTError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
