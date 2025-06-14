import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function Profile({ url }: { url: string }) {
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  return (
    <>
      {!isProfileLoaded && (
        <Skeleton className="rounded-full w-12 h-12 object-cover" />
      )}
      <img
        className="rounded-full w-10 h-10 object-cover"
        alt="creator"
        src={url || "/assets/icons/profile-placeholder.svg"}
        onLoad={() => setIsProfileLoaded(true)}
        style={{
          display: isProfileLoaded ? "block" : "none",
        }}
      />
    </>
  );
}
