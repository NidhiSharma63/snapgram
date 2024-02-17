"use client";

import { Button } from "@/src/components/ui/button";
import { User } from "@/src/types/user";
import Image from "next/image";
import Link from "next/link";
function AllUserComponent({ user }: { user: User }) {
  return (
    <Link href={`/profile/${user._id}`} className="user-card">
      <div className="w-[40px] h-[40px] relative">
        <Image
          priority={true}
          fill
          // style={{ width: "100%", height: "100%", objectFit: "cover" }}
          className="w-full h-full object-cover rounded-full"
          src={user.avatar || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
        />
      </div>

      <div className="flex-center flex-col gap-1">
        <p className="base-medium dark:text-light-1 text-center line-clamp-1">@{user.username}</p>
        <p className="small-regular text-light-3 text-center line-clamp-1 flex-wrap">@{user.email}</p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
}

export default AllUserComponent;
