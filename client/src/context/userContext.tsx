import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import { createContext, useContext, useState } from "react";

interface userProviderProps {
  children: React.ReactNode;
}

export interface UserDetails {
	email: string;
	password: string;
	_id: string;
	username: string;
	__v: number;
	tokens: { token: string; uniqueBrowserId: string; _id: string }[];
	avatar: string;
}

interface UserDetailsProviderState {
  userDetails: UserDetails | null;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}

const initialState: UserDetailsProviderState = {
  userDetails: null,
  setUserDetail: () => null,
};

const UserDetailsProviderContext = createContext<UserDetailsProviderState>(initialState);

const storedUserData = getValueFromLS(AppConstants.USER_DETAILS);
export function UserDetailsProvider({ children }: userProviderProps) {
  const [userDetails, setUserDetail] = useState<null | UserDetails>(
    (storedUserData && JSON.parse(storedUserData)) || null
  );

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
