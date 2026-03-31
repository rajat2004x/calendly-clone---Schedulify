function notFoundHandler(req, res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.path}`);
  err.status = 404;
  next(err);
}

function globalErrorHandler(err, req, res, next) {
  const status = err.status || 500;

  if (status >= 500) {
    console.error("Unhandled server error:", err);
  }

  res.status(status).json({
    error: err.message || "Internal server error",
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
