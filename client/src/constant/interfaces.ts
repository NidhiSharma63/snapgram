export interface ICreatePost {
  caption: string;
  file: File[];
  location: string;
  tags: string;
  userId: string | null;
}
