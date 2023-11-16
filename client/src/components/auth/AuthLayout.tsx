import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Get the token value from local storage if token is present that's means user is autheticated

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = getValueFromLS(AppConstants.TOKEN_VALUE_IN_LS);
  const location = useLocation();
  console.log({ isAuthenticated });
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }
  if (isAuthenticated) {
    return children;
  }
};

export default AuthLayout;
