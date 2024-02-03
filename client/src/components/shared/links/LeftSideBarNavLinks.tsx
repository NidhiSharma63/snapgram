"use client";

import { Button } from "@/src/components/ui/button";
import { sidebarLinks } from "@/src/constant/link";
import ToastError from "@/src/lib/toastError";
import logout from "@/src/server/authActions/logout";
import { User } from "@/src/types/user";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
function NavLinks({ userDetails }: { userDetails: User }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClickOnLogo = () => {
    router.push("/");
  };

  const handleClickOnProfile = () => {
    router.push(`/profile/${userDetails?._id}`);
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res?.message) {
      router.push("/");
    } else {
      ToastError({ msg: res?.error });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-11">
        <img
          // src={theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"}
          alt="logo"
          width={170}
          onClick={handleClickOnLogo}
          height={36}
          src="/assets/images/logo-light.svg"
        />
        <div onClick={handleClickOnProfile} className="flex gap-3 items-center">
          <img
            alt="profile"
            src={(userDetails && userDetails?.avatar) || "/assets/icons/profile-placeholder.svg"}
            className="h-8 w-8 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">@{userDetails?.username}</p>
            <p className="small-regular text-light-3">@{userDetails?.email}</p>
          </div>
        </div>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}>
                <Link href={link.route} className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && "invert-white"}`}
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-center mt-2 items-center relative">
        {/* <ThemeComponent isDisplayedOnTopBar={false} /> */}
        <Button variant="ghost" className="shad-button_ghost" onClick={handleLogout}>
          <img className="" src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Logout</p>
        </Button>
      </div>
    </>
  );
}

export default NavLinks;
