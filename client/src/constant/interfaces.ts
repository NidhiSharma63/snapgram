export interface ICreatePost {
  caption: string;
  file: string;
  location: string;
  tags: string;
  userId: string | null;
  userAvatar: string | null;
  createdAt: Date;
}

export interface IUpdatePost extends ICreatePost {
  _id: string;
}

export interface IPost {
  caption: string[];
  createdAt: Date;
  file: string;
  location: string[];
  tags: string[];
  userId: string;
  __v: number;
  _id: string;
  userAvatar: string;
  likes: string[];
}

export interface IUser {
  avatar: string;
  bio: string;
  email: string;
  password: string;
  tokens: {
    token: string;
    _id: string;
    uniqueBrowserId: string;
  }[];
  username: string;
  __v: number;
  _id: string;
}

export interface ErrorResponse {
  status: number;
  error: string;
  // Other properties...
}
