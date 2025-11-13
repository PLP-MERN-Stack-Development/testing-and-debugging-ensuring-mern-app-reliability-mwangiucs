function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1_000_000;
    // Simple server-side logging
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms.toFixed(1)}ms`);
  });
  next();
}

function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
}

module.exports = { requestLogger, notFound, errorHandler };
