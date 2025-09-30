function globalErrorHandler(err, req, res, next) {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || null,
  });
};

export default globalErrorHandler;