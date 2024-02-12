import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { URL } from 'url';
import { UserDB } from '../db';
import { UserData } from '../types';
import { isDataValid } from '../helpers/isDataValid';
import { errors } from '../constants/errors';
import { sendError } from '../helpers/sendError';

export const post = (req: IncomingMessage, res: ServerResponse, users: UserDB) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  switch (url.pathname) {
    case '/users':
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

          if (isDataValid(parsedData)) {
            const newUser = {
              id: uuidv4(),
              username: parsedData.username,
              age: parsedData.age,
              hobbies: parsedData.hobbies,
            };
            users.add(newUser);

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newUser));
          } else {
            sendError(res, 400, errors.INVALID_INPUT_FORMAT);
          }
        })
        .on('error', () => {
          sendError(res, 500, errors.INTERNAL_SERVER_ERROR);
        });
      break;

    default:
      sendError(res, 404, `Endpoint ${req.url} does not exist`);
      break;
  }
};
