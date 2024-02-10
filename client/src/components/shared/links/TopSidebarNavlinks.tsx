"use client";

import { Button } from "@/src/components/ui/button";
import ToastError from "@/src/lib/toastError";
import { logout } from "@/src/server/auth";
import { User } from "@/src/types/user";
import Link from "next/link";
import { useRouter } from "next/navigation";

function TopSidebarNavlinks({ userDetails }: { userDetails: User }) {
  const router = useRouter();
  const handleClick = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      const e = error instanceof Error ? error : new Error("Something went wrong");
      ToastError({ msg: e?.message });
    }
  };
  return (
    <>
      <div className="flex justify-between py-4 px-5">
        <Link href="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo-light.svg"
            // src={theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"}
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4 relative items-center justify-center">
          <Button variant="ghost" className="shad-button_ghost" onClick={handleClick}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link href={`/profile/${userDetails?._id}`} className="flex-center gap-3">
            <img
              alt="profile"
              src={(userDetails && userDetails?.avatar) || "/assets/icons/profile-placeholder.svg"}
              className="h-8 w-8 rounded-full"
            />
          </Link>
          {/* <ThemeComponent isDisplayedOnTopBar={true} /> */}
        </div>
      </div>
    </>
  );
}

export default TopSidebarNavlinks;
