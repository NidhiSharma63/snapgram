import { AppConstants } from "@/constant/keys";
import useAuth from "@/hooks/query/useAuth";
import { getValueFromLS } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";

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
		followers: string[];
		followings: string[];
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


export function UserDetailsProvider({ children }: userProviderProps) {
	const [userDetails, setUserDetail] = useState<null | UserDetails>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const storedUserData = getValueFromLS(AppConstants.USER_DETAILS);
	const { useGetUserById } = useAuth();
	const { data } = useGetUserById(userId || "");

	/**
	 * on load re-fetch user details form DB
	 */
	useEffect(() => {
		setUserDetail(data);
	}, [data]);

	/**
	 * set User id from local storage to state
	 */
	useEffect(() => {
		if (storedUserData) {
			setUserId(JSON.parse(storedUserData)?._id);
		}
	}, [storedUserData]);

		return (
			<UserDetailsProviderContext.Provider
				value={{
					userDetails,
					setUserDetail,
				}}
			>
				{children}
			</UserDetailsProviderContext.Provider>
		);
}

export const useUserDetail = () => {
  const context = useContext(UserDetailsProviderContext);

  if (context === undefined) throw new Error("useUserDetail must be used within a UserDetailsProvider");

  return context;
};
