import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Get the token value from local storage if token is present that's means user is autheticated

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const storedValue = getValueFromLS(AppConstants.USER_DETAILS);
  const location = useLocation();

  if (storedValue) {
    const parsedValue = JSON.parse(storedValue);
    const isAuthenticated = parsedValue && parsedValue.tokens && parsedValue.tokens[0].token;
    if (isAuthenticated) {
      console.log("children");
      return children;
    } else {
      return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }
  } else {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }
};

export default AuthLayout;
