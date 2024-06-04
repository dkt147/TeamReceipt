function errorHandler(statusMessage, statusCode) {
  const error = new Error(statusMessage);
  error.status = statusMessage;
  error.statusCode = statusCode;
  return error;
}
export default errorHandler;
