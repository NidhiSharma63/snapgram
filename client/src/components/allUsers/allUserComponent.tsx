"use client";

import { Button } from "@/src/components/ui/button";
import { User } from "@/src/types/user";
import Image from "next/image";
import Link from "next/link";
function AllUserComponent({ user }: { user: User }) {
  return (
    <Link href={`/profile/${user._id}`} className="user-card">
      <Image
        width={40}
        height={40}
        priority
        style={{ height: "40px !important", objectFit: "cover", borderRadius: "50%" }}
        src={user.avatar || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
      />

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
