import chalk from 'chalk';

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const method = req.method;
    const path = req.originalUrl;
    const status = res.statusCode;

    let statusColor;
    if (status >= 400) {
      statusColor = chalk.red;
    } else if (status >= 300) {
      statusColor = chalk.yellow;
    } else {
      statusColor = chalk.green;
    }

    console.log(
      `${statusColor(status)} ${chalk.blue(method.padEnd(6))} ${path} - ${duration}ms`
    );
  });

  next();
};
