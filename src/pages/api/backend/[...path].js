import { createApp, initializeBackendServices } from '../../../../server/app.js';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const app = createApp();
let backendReadyPromise = null;

const buildExpressUrl = (req) => {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
  const queryIndex = req.url.indexOf('?');
  const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
  const routePath = pathParts.join('/');

  return `/api/${routePath}${queryString}`;
};

export default async function handler(req, res) {
  try {
    if (!backendReadyPromise) {
      backendReadyPromise = initializeBackendServices();
    }
    await backendReadyPromise;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Backend initialization failed',
      error: error.message,
    });
  }

  const expressUrl = buildExpressUrl(req);
  req.url = expressUrl;
  req.originalUrl = expressUrl;

  return app(req, res);
}
