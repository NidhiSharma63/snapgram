import { Button } from "@/components/ui/button";
import { AppConstants } from "@/constant/keys";
import { sidebarLinks } from "@/constant/links";
import { useTheme } from "@/context/themeProviders";
import { useUserDetail } from "@/context/userContext";
import { setValueToLS } from "@/lib/utils";
import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeComponent from "./ThemeComponent";

const LOGOUT_USER = gql`
	mutation AddUser($userInput: logoutUser!) {
		logoutUser(userInput: $userInput)
	}
`;

export default function LeftBar() {
	// const { useLogout } = useAuth();
	// const { mutate, isSuccess } = useLogout();
	const { userDetails, setUserDetail } = useUserDetail();
	const navigate = useNavigate();
	const { theme } = useTheme();
	const { pathname } = useLocation();
	const [logoutUser, { data }] = useMutation(LOGOUT_USER);

	const handleClick = () => {
		if (!userDetails) return;
		logoutUser({
			variables: {
				userInput: { userId: userDetails._id, token: userDetails.tokens[0].token },
			},
		});
		setUserDetail(null);
	};

	useEffect(() => {
		if (data) {
			navigate("/sign-in");
			setValueToLS(AppConstants.USER_DETAILS, null);
		}
	}, [navigate, data]);

	return (
		<nav className="leftsidebar">
			<div className="flex flex-col gap-11">
				<Link
					to="/"
					className="flex gap-3 items-center"
				>
					<img
						src={theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"}
						alt="logo"
						width={170}
						height={36}
					/>
				</Link>
				<Link
					to={`/profile/${userDetails && userDetails._id}`}
					className="flex gap-3 items-center"
				>
					<img
						alt="profile"
						src={(userDetails && userDetails?.avatar) || "/assets/icons/profile-placeholder.svg"}
						className="h-8 w-8 rounded-full"
					/>
					<div className="flex flex-col">
						<p className="body-bold">@{userDetails?.username}</p>
						<p className="small-regular text-light-3">@{userDetails?.email}</p>
					</div>
				</Link>
				<ul className="flex flex-col gap-6">
					{sidebarLinks.map((link) => {
						const isActive = pathname === link.route;
						return (
							<li
								key={link.label}
								className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}
							>
								<NavLink
									to={link.route}
									className="flex gap-4 items-center p-4"
								>
									<img
										src={link.imgURL}
										alt={link.label}
										className={`group-hover:invert-white ${isActive && "invert-white"}`}
									/>
									{link.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="flex justify-center mt-2 items-center relative">
				<ThemeComponent isDisplayedOnTopBar={false} />
				<Button
					variant="ghost"
					className="shad-button_ghost"
					onClick={handleClick}
				>
					<img
						className=""
						src="/assets/icons/logout.svg"
						alt="logout"
					/>
					<p className="small-medium lg:base-medium">Logout</p>
				</Button>
			</div>
		</nav>
	);
}
