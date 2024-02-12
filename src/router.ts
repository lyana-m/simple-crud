import { IncomingMessage, ServerResponse } from 'http';
import { UserDB } from './db';
import { get } from './endpoints/get';
import { post } from './endpoints/post';
import { put } from './endpoints/put';
import { remove } from './endpoints/remove';

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
      remove(req, res, users);
      break;

    default:
      res.statusCode = 404;
      res.end(`${req.method} ${req.url} not found`);
      break;
  }
};
