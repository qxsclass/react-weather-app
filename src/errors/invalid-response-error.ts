export class InvalidResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidResponseError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidResponseError);
    }
  }
}
