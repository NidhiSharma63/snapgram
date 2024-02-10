"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type useUserPostIdForSaveAndLikeProviderProps = {
  children: React.ReactNode;
};

type useUserPostIdForSaveAndLikeProviderState = {
  postsWhichUserLiked: string[];
  setPostsWhichUserLiked: Dispatch<SetStateAction<string[]>>;
  userSavePostId: string;
  setSavePostId: (val: string) => void;
};

const initialState: useUserPostIdForSaveAndLikeProviderState = {
  postsWhichUserLiked: [],
  setPostsWhichUserLiked: () => {},
  userSavePostId: "",
  setSavePostId: () => null,
};

const useUserPostIdProvider = createContext<useUserPostIdForSaveAndLikeProviderState>(initialState);

export function UserPostIdSaveAndLikeProvider({ children }: useUserPostIdForSaveAndLikeProviderProps) {
  const [postsWhichUserLiked, setPostsWhichUserLiked] = useState<string[]>([]);
  const [userSavePostId, setSavePostId] = useState<string>("");

  return (
    <useUserPostIdProvider.Provider
      value={{
        postsWhichUserLiked,
        setPostsWhichUserLiked,
        userSavePostId,
        setSavePostId,
      }}>
      {children}
    </useUserPostIdProvider.Provider>
  );
}

export const useUserPostIdForSaveAndLike = () => {
  const context = useContext(useUserPostIdProvider);

  if (context === undefined) throw new Error("useUserPostId context must be used within a useUserPostIdProvider");

  return context;
};
