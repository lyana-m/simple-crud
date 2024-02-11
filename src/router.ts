import { IncomingMessage, ServerResponse } from 'http';
import { get } from './endpoints/get';
import { post } from './endpoints/post';

export const router = (req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case 'GET':
      get(req, res);
      break;

    case 'POST':
      post(req, res);
      break;

    case 'PUT':
      // put(req, res);
      break;

    case 'DELETE':
      // delete(req, res);
      break;

    default:
      res.statusCode = 404;
      res.end(`${req.method} ${req.url} not found`);
      break;
  }
};
