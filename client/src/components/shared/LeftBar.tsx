import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constant/links";
import { useTheme } from "@/context/themeProviders";
// import { useAuthContext } from "@/context/AuthContext";
// import { sidebarLinks } from "@/lib/constant/sidebar";
// import { useSignOutAccount } from "@/lib/react-query/queryAndMutations";
// import { INavLink } from "@/types";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function LeftBar() {
  //   const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { pathname } = useLocation();
  //   const { user } = useAuthContext();

  //   useEffect(() => {
  //     if (isSuccess) {
  //       navigate("/sign-in");
  //     }
  //   }, [navigate, isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src={theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"}
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/`} className="flex gap-3 items-center">
          <img alt="profile" src={"/assets/icons/profile-placeholder.svg"} className="h-8 w-8 rounded-full" />
          <div className="flex flex-col">
            <p className="body-bold">Nidhi</p>
            <p className="small-regular text-light-3">@nidhisharma</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            console.log(pathname, isActive);
            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}>
                <NavLink to={link.route} className="flex gap-4 items-center p-4">
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
      <Button variant="ghost" className="shad-button_ghost">
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
}
