class ErrorHandler extends Error {
  statusCode: Number;

  constructor(message: any, statusCode: Number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;

/*
const ErrorHandler = (message: any, statusCode: Number) => {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  Error.captureStackTrace(error);
  return error;
};

export default ErrorHandler
 */
