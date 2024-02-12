import { User, UserData } from '../types';

export const isDataValid = (data: UserData): data is Omit<User, 'id'> => {
  const { username, age, hobbies } = data || {};

  if (username && age && hobbies) {
    if (typeof username === 'string' && typeof age === 'number' && Array.isArray(hobbies)) {
      return true;
    }
    return false;
  }
  return false;
};
