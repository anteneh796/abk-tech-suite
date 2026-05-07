/**
 * Wraps an async function to catch any errors and pass them to the express error handler.
 * Eliminates the need for repeated try/catch blocks in controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
