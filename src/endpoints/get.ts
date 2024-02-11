import { IncomingMessage, ServerResponse } from 'http';
import { users } from '../db';
import { isUuidValid } from '../helpers/isUuidValid';

export const get = (req: IncomingMessage, res: ServerResponse) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathSegments = requestUrl.pathname.split('/').filter(Boolean);
  const url = pathSegments[0];
  const id = pathSegments[1];

  switch (url) {
    case 'users':
      if (id) {
        if (isUuidValid(id)) {
          const user = users.find((user) => user.id === id);

          if (user) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify(`User with ${id} does not exist`));
          }
        } else {
          res.statusCode = 400;
          res.end(JSON.stringify(`Id ${id} is not valid uuid`));
        }
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(users));
      }
      break;

    default:
      res.statusCode = 404;
      res.end(`Endpoint ${req.url} does not exist`);
      break;
  }
};
