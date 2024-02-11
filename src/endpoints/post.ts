import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { URL } from 'url';
import { users } from '../db';
import { UserData } from '../types';
import { isDataValid } from '../helpers/isDataValid';
import { errors } from '../constants/errors';

export const post = (req: IncomingMessage, res: ServerResponse) => {
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
            users.push(newUser);

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newUser));
          } else {
            res.statusCode = 400;
            res.end(JSON.stringify(errors.INVALID_INPUT_FORMAT));
          }
        })
        .on('error', () => {
          res.statusCode = 500;
          res.end(JSON.stringify(errors.INTERNAL_SERVER_ERROR));
        });
      break;

    default:
      res.statusCode = 404;
      res.end(`Endpoint ${req.url} does not exist`);
      break;
  }
};
