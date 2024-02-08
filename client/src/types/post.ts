import { User } from "@/src/types/user";

export type PostType = {
  file: string;
  userId: string;
  tags: string;
  caption: string;
  location: string;
  createdAt: Date;
  userAvatar: string;
  likes: string[];
  _id: string;
};

export type PostTypeRes = {
  posts?: PostType[];
  error?: string;
};

export type PostTypeForCreatingPost = {
  caption: string;
  file: string;
  location: string;
  tags: string;
  userId: string | null;
  userAvatar: string | null;
  createdAt: Date;
  _id?: string;
};
// export type PostTypeForCreatingPostFromClientSide = Omit<PostType, "_id">;

export type PostFormProps = {
  post?: PostTypeForCreatingPost;
  action: "Create" | "Update";
  userDetails: User;
};

export type UpdatePostType = {
  _id: string;
  tags: string;
  caption: string;
  location: string;
};
