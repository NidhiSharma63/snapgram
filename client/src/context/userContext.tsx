// import { createContext, useContext, useState } from "react";

// type userProviderProps = {
//   children: React.ReactNode;
// };

// type UserDetailsProviderState = {
//   userDetail: Record<string, never> | null;
//   setUserDetail: React.Dispatch<React.SetStateAction<undefined>>;
// };

// const initialState: UserDetailsProviderState = {
//   userDetail: null,
//   setUserDetail: () => null,
// };

// const UserDetailsProviderContext = createContext<UserDetailsProviderState>(initialState);

// export function UserDetailsProvider({ children }: userProviderProps) {
//   const [userDetail, setUserDetail] = useState();

//   return (
//     <UserDetailsProviderContext.Provider
//       value={{
//         userDetail,
//         setUserDetail,
//       }}>
//       {children}
//     </UserDetailsProviderContext.Provider>
//   );
// }

// export const useUserDetail = () => {
//   const context = useContext(UserDetailsProviderContext);

//   if (context === undefined) throw new Error("useUserDetail must be used within a UserDetailsProvider");

//   return context;
// };
