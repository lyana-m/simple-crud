import { User } from './types';

export class UserDB {
  constructor(private _users: User[] = []) {}

  add(newUser: User) {
    this._users.push(newUser);
  }

  update(updatedUser: User) {
    this._users = this._users.map((user) => {
      if (user.id === updatedUser.id) {
        return { ...user, ...updatedUser };
      }
      return user;
    });
  }

  delete(id: string) {
    this._users = this._users.filter((user) => user.id !== id);
  }

  getUser(id: string) {
    return this._users.find((user) => user.id === id);
  }

  getUsers() {
    return this._users;
  }
}
