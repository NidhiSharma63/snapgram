"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type useUserPostIdForSaveAndLikeProviderProps = {
  children: React.ReactNode;
};

type useUserPostIdForSaveAndLikeProviderState = {
  postsWhichUserLiked: string[];
  setPostsWhichUserLiked: Dispatch<SetStateAction<string[]>>;
  userSavePostId: string[];
  setUserSavePostId: (val: string[]) => void;
  initialRender: boolean;
  setInitialRender: Dispatch<SetStateAction<boolean>>;
};

const initialState: useUserPostIdForSaveAndLikeProviderState = {
  postsWhichUserLiked: [],
  setPostsWhichUserLiked: () => {},
  userSavePostId: [],
  setUserSavePostId: () => null,
  initialRender: false,
  setInitialRender: () => null,
};

const useUserPostIdProvider = createContext<useUserPostIdForSaveAndLikeProviderState>(initialState);

export function UserPostIdSaveAndLikeProvider({ children }: useUserPostIdForSaveAndLikeProviderProps) {
  const [postsWhichUserLiked, setPostsWhichUserLiked] = useState<string[]>([]);
  const [userSavePostId, setUserSavePostId] = useState<string[]>([]);
  const [initialRender, setInitialRender] = useState<boolean>(false);

  return (
    <useUserPostIdProvider.Provider
      value={{
        postsWhichUserLiked,
        setPostsWhichUserLiked,
        userSavePostId,
        setUserSavePostId,
        initialRender,
        setInitialRender,
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
