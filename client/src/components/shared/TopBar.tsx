import { Button } from "@/components/ui/button";
import { AppConstants } from "@/constant/keys";
import { useTheme } from "@/context/themeProviders";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import { setValueToLS } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import ThemeComponent from "./ThemeComponent";

export default function TopBar() {
  const { theme } = useTheme();
  const { useLogout } = useAuth();
  const { mutate } = useLogout();
  const { userDetails, setUserDetail } = useUserDetail();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!userDetails) return;
    mutate({
      userId: userDetails._id,
      token: userDetails.tokens[0].token,
    });
    setValueToLS(AppConstants.USER_DETAILS, null);
    setUserDetail(null);
		navigate("/sign-in");
  };



		return (
			<section className="topbar">
				<div className="flex justify-between py-4 px-5">
					<Link to="/" className="flex gap-3 items-center">
						<img src={"/assets/icons/small-logo.svg"} alt="logo" width={30} />
					</Link>
					<div className="flex gap-4 relative items-center justify-center">
						<Button
							variant="ghost"
							className="shad-button_ghost"
							onClick={handleClick}
						>
							<img src="/assets/icons/logout.svg" alt="logout" />
						</Button>
						<Link
							to={`/profile/${userDetails?._id}`}
							className="flex-center gap-3"
						>
							<img
								alt="profile"
								src={
									userDetails?.avatar || "/assets/icons/profile-placeholder.svg"
								}
								className="h-8 w-8 rounded-full object-cover"
							/>
						</Link>
						<ThemeComponent isDisplayedOnTopBar={true} />
					</div>
				</div>
			</section>
		);
}
