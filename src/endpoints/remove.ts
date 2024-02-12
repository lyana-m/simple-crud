import { IncomingMessage, ServerResponse } from 'http';
import { UserDB } from '../db';
import { isUuidValid } from '../helpers/isUuidValid';
import { getPathSegments } from '../helpers/getPathSegments';
import { sendError } from '../helpers/sendError';

export const remove = (req: IncomingMessage, res: ServerResponse, users: UserDB) => {
  const [url, id] = getPathSegments(req);

  switch (url) {
    case 'users':
      if (id) {
        if (isUuidValid(id)) {
          const user = users.getUser(id);

          if (user) {
            users.delete(id);
            res.statusCode = 204;
            res.end();
          } else {
            sendError(res, 404, `User with id ${id} does not exist`);
          }
        } else {
          sendError(res, 400, `Id ${id} is not valid uuid`);
        }
      } else {
        sendError(res, 404, `Endpoint ${req.url} does not exist`);
      }
      break;

    default:
      sendError(res, 404, `Endpoint ${req.url} does not exist`);
      break;
  }
};
