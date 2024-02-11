import { IncomingMessage } from 'http';

export const getPathSegments = (req: IncomingMessage) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  return requestUrl.pathname.split('/').filter(Boolean);
}
