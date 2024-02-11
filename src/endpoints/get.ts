import { IncomingMessage, ServerResponse } from 'http';
import { UserDB } from '../db';
import { isUuidValid } from '../helpers/isUuidValid';
import { getPathSegments } from '../helpers/getPathSegments';
import { sendError } from '../helpers/sendError';

export const get = (req: IncomingMessage, res: ServerResponse, users: UserDB) => {
  const [url, id] = getPathSegments(req);

  switch (url) {
    case 'users':
      if (id) {
        if (isUuidValid(id)) {
          const user = users.getUser(id);

          if (user) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
          } else {
            sendError(res, 404, `User with ${id} does not exist`);
          }
        } else {
          sendError(res, 400, `Id ${id} is not valid uuid`);
        }
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(users.getUsers()));
      }
      break;

    default:
      sendError(res, 404, `Endpoint ${req.url} does not exist`);
      break;
  }
};
