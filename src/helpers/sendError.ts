import { ServerResponse } from 'http';

export const sendError = (res: ServerResponse, code: ServerResponse['statusCode'], message: string) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({message}));
};
