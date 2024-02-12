import 'dotenv/config';
import http, { IncomingMessage, ServerResponse } from 'http';
import { router } from './router';
import { sendError } from './helpers/sendError';
import { errors } from './constants/errors';

const PORT = process.env.PORT || 4000;

export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  try {
    router(req, res);
  } catch {
    sendError(res, 500, errors.INTERNAL_SERVER_ERROR);
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
