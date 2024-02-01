import { createContext, useContext, useState } from "react";

type useUserPostIdForSaveAndLikeProviderProps = {
  children: React.ReactNode;
};

type useUserPostIdForSaveAndLikeProviderState = {
  userLikePostId: string;
  setLikePostId: (val: string) => void;
  userSavePostId: string;
  setSavePostId: (val: string) => void;
};

const initialState: useUserPostIdForSaveAndLikeProviderState = {
  userLikePostId: "",
  setLikePostId: () => null,
  userSavePostId: "",
  setSavePostId: () => null,
};

const useUserPostIdProvider = createContext<useUserPostIdForSaveAndLikeProviderState>(initialState);

export function UserPostIdSaveAndLikeProvider({ children }: useUserPostIdForSaveAndLikeProviderProps) {
  const [userLikePostId, setLikePostId] = useState<string>("");
  const [userSavePostId, setSavePostId] = useState<string>("");

  return (
    <useUserPostIdProvider.Provider
      value={{
        userLikePostId,
        setLikePostId,
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
