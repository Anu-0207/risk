export function errorHandler(err, req, res, next) {
  console.error('[RiskVault Server Error]:', err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.clientMessage || err.message || 'An unexpected error occurred while processing your request.';

  res.status(statusCode).json({
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: statusCode === 500 ? 'An internal error occurred. Please try again shortly.' : message,
  });
}
