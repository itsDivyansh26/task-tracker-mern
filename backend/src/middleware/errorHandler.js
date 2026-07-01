export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Mongoose CastError (e.g., invalid ObjectId structure)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format for: ${err.value}`;
  }

  res.status(statusCode).json({
    error: message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
