import { Button } from "@/components/ui/button";
import { AppConstants } from "@/constant/keys";
import { useTheme } from "@/context/themeProviders";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import { setValueToLS } from "@/lib/utils";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TopBar() {
  const { theme } = useTheme();
  const { useLogout } = useAuth();
  const { mutate, isSuccess } = useLogout();
  const { userDetails } = useUserDetail();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!userDetails) return;
    mutate({
      userId: userDetails._id,
      token: userDetails.tokens[0].token,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
      setValueToLS(AppConstants.USER_DETAILS, JSON.stringify(null));
    }
  }, [navigate, isSuccess]);

  return (
    <section className="topbar">
      <div className="flex justify-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src={theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"}
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" className="shad-button_ghost" onClick={handleClick}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/`} className="flex-center gap-3">
            <img alt="profile" src={"/assets/icons/profile-placeholder.svg"} className="h-8 w-8 rounded-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}
