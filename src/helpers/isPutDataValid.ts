import { User, UserData } from '../types';

export const isPutDataValid = (data: UserData): data is Omit<User, 'id'> => {
  const { username, age, hobbies } = data || {};

  if (
    ((username && typeof username === 'string') || typeof username === 'undefined') &&
    ((age && typeof age === 'number') || typeof age === 'undefined') &&
    (Array.isArray(hobbies) || typeof hobbies === 'undefined')
  ) {
    return true;
  }
  return false;
};
