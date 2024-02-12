import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { isUuidValid } from '../helpers/isUuidValid';
import { server } from '../index';

jest.mock('uuid');
jest.mock('../helpers/isUuidValid');

const users = [
  {
    username: 'natasha',
    age: 22,
    hobbies: ['js'],
  },
  {
    username: 'vanya',
    age: 32,
    hobbies: ['nodejs'],
  },
];

afterEach(() => {
  request(server.close());
})

it('should respond with empty array of users', async () => {
  const res = await request(server).get('/users');

  expect(res.status).toBe(200);
  expect(res.body).toEqual([]);
});

it('should create user', async () => {
  (uuidv4 as jest.Mock).mockReturnValueOnce('1');
  const res = await request(server).post('/users').send(users[0]);

  expect(res.status).toBe(201);
  expect(res.body).toEqual({ ...users[0], id: '1' });
});

it('should respond with array of users', async () => {
  (uuidv4 as jest.Mock).mockReturnValueOnce('2');
  await request(server).post('/users').send(users[1]);
  const res = await request(server).get('/users');

  expect(res.status).toBe(200);
  expect(res.body).toEqual([
    { ...users[0], id: '1' },
    { ...users[1], id: '2' },
  ]);
});

it('should respond with one user', async () => {
  (isUuidValid as jest.Mock).mockReturnValueOnce(true);
  (uuidv4 as jest.Mock).mockReturnValueOnce('1').mockReturnValueOnce('2');
  const res = await request(server).get('/users/1');

  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ...users[0], id: '1' });
});

it('should respond with error if user not found', async () => {
  (isUuidValid as jest.Mock).mockReturnValueOnce(true);
  (uuidv4 as jest.Mock).mockReturnValueOnce('1').mockReturnValueOnce('2');
  const res = await request(server).get('/users/3');

  expect(res.status).toBe(404);
  expect(res.body).toEqual({ message: 'User with id 3 does not exist' });
});

it('should respond with error if uuis is not valid', async () => {
  (isUuidValid as jest.Mock).mockReturnValueOnce(false);
  (uuidv4 as jest.Mock).mockReturnValueOnce('1').mockReturnValueOnce('2');
  const res = await request(server).get('/users/1');

  expect(res.status).toBe(400);
  expect(res.body).toEqual({ message: 'Id 1 is not valid uuid' });
});

it('should update user', async () => {
  (isUuidValid as jest.Mock).mockReturnValueOnce(true);
  await request(server).put('/users/1').send({username: 'natasha-updated'});

  const res = await request(server).get('/users');

  expect(res.body).toEqual([
    { ...users[0], id: '1', username: 'natasha-updated' },
    { ...users[1], id: '2' },
  ]);
});

it('should delete user', async () => {
  (isUuidValid as jest.Mock).mockReturnValueOnce(true);
  await request(server).delete('/users/1');

  const res = await request(server).get('/users');

  expect(res.body).toEqual([
    { ...users[1], id: '2' },
  ]);
});
