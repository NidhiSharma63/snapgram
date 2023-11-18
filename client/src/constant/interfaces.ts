export interface ICreatePost {
  caption: string;
  file: string;
  location: string;
  tags: string;
  userId: string | null;
  userAvatar: string | null;
}
