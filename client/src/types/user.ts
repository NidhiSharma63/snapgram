export type User = {
  email: string;
  password: string;
  username: string;
  avatar: string;
  tokens: { token: string; uniqueBrowserId: string }[];
  bio: string;
  _id: string;
};
export type UserType = {
  user?: User;
  error?: string;
};

export type UserTypeArray = {
  users?: User[];
  error?: string;
};

export type UserUpdateProfileValues = {
  userId: string;
  file: string;
  username: string;
  bio: string;
};
