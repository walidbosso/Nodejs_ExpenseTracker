const errorHandler = (error, req, res, next) => {
  if (error) {
    if (error.message) {
      res.status(400).json({
        status: "failed",
        error: error.message,
      });
    } else {
      res.status(400).json({
        status: "failed",
        error: error,
      });
    }
    return;
  } else {
    next();
  }
};

module.exports = errorHandler;
