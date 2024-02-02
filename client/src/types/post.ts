export type PostType = {
  posts?: {
    file: string;
    userId: string;
    tags: string[];
    caption: string[];
    location: string[];
    createdAt: Date;
    userAvatar: string;
    likes: string[];
  }[];
  error?: string;
};
