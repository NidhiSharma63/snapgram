import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import { createContext, useContext, useState } from "react";

type userProviderProps = {
  children: React.ReactNode;
};

type UserDetailsProviderState = {
  userDetails: {
    email: string;
    password: string;
    _id: string;
    username: string;
    __v: number;
    tokens: { token: string; uniqueBrowserId: string; _id: string }[];
  } | null;
  setUserDetail: React.Dispatch<React.SetStateAction<undefined>>;
};

const initialState: UserDetailsProviderState = {
  userDetails: null,
  setUserDetail: () => null,
};

const UserDetailsProviderContext = createContext<UserDetailsProviderState>(initialState);

export function UserDetailsProvider({ children }: userProviderProps) {
  const storedUserData = getValueFromLS(AppConstants.USER_DETAILS);
  const [userDetails, setUserDetail] = useState((storedUserData && JSON.parse(storedUserData)) || null);

  return (
    <UserDetailsProviderContext.Provider
      value={{
        userDetails,
        setUserDetail,
      }}>
      {children}
    </UserDetailsProviderContext.Provider>
  );
}

export const useUserDetail = () => {
  const context = useContext(UserDetailsProviderContext);

  if (context === undefined) throw new Error("useUserDetail must be used within a UserDetailsProvider");

  return context;
};
