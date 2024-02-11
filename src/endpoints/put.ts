import { IncomingMessage, ServerResponse } from 'http';
import { UserDB } from '../db';
import { UserData } from '../types';
import { errors } from '../constants/errors';
import { getPathSegments } from '../helpers/getPathSegments';
import { isUuidValid } from '../helpers/isUuidValid';
import { sendError } from '../helpers/sendError';
import { isPutDataValid } from '../helpers/isPutDataValid';

export const put = (req: IncomingMessage, res: ServerResponse, users: UserDB) => {
  const [url, id] = getPathSegments(req);

  switch (url) {
    case 'users':
      if (id) {
        if (isUuidValid(id)) {
          const user = users.getUser(id);

          if (user) {
            const body = [];
            req
              .on('data', (chunk) => {
                body.push(chunk);
              })
              .on('end', () => {
                const data = Buffer.concat(body).toString();
                let parsedData: UserData;

                if (req.headers['content-type'] === 'application/json') {
                  parsedData = JSON.parse(data);
                }

                if (isPutDataValid(parsedData)) {
                  const updatedUser = {
                    id,
                    username: parsedData.username || user.username,
                    age: parsedData.age || user.age,
                    hobbies: parsedData.hobbies || user.hobbies,
                  };
                  users.update(updatedUser);

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(updatedUser));
                } else {
                  sendError(res, 400, errors.INVALID_INPUT_FORMAT);
                }
              })
              .on('error', () => {
                sendError(res, 500, errors.INTERNAL_SERVER_ERROR);
              });
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
