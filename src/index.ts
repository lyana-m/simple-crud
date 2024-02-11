import http, {IncomingMessage, ServerResponse} from 'http';

const PORT = 4000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  console.log(req, res)
  console.log('Server request');
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
