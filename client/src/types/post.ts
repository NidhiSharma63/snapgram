export type PostType = {
  file: string;
  userId: string;
  tags: string[];
  caption: string[];
  location: string[];
  createdAt: Date;
  userAvatar: string;
  likes: string[];
  _id: string;
};

export type PostTypeRes = {
  posts?: PostType[];
  error?: string;
};
