import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Get the token value from local storage if token is present that's means user is autheticated

const AuthLayout = ({ children }: { children: ReactNode }) => {
	const storedValue = getValueFromLS(AppConstants.USER_DETAILS);
	const location = useLocation();
	// if (storedValue) {
	const parsedValue = JSON.parse(storedValue as string);
	const isAuthenticated = parsedValue?.tokens?.[0].token;
	if (isAuthenticated) {
		return children;
	}
	return <Navigate to="/sign-in" replace state={{ from: location }} />;
};

export default AuthLayout;
