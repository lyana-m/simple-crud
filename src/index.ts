import 'dotenv/config';
import http, { IncomingMessage, ServerResponse } from 'http';
import { router } from './router';

const PORT = process.env.PORT || 4000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
