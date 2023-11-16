import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// Get the token value from local storage if token is present that's means user is autheticated

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = getValueFromLS(AppConstants.GET_TOKEN_FROM_LS);
  console.log({ isAuthenticated });
  if (!isAuthenticated) {
    return <Navigate to="/signIn" />;
  }
  if (isAuthenticated) {
    return children;
  }
};

export default AuthLayout;
