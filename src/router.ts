import { IncomingMessage, ServerResponse } from 'http';
import { UserDB } from './db';
import { get } from './endpoints/get';
import { post } from './endpoints/post';
import { put } from './endpoints/put';

const users = new UserDB();

export const router = (req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case 'GET':
      get(req, res, users);
      break;

    case 'POST':
      post(req, res, users);
      break;

    case 'PUT':
      put(req, res, users);
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
