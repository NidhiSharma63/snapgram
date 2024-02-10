"use client";

import { UserPostIdSaveAndLikeProvider } from "@/src/context/userSaveAndLikeContext";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserPostIdSaveAndLikeProvider>{children}</UserPostIdSaveAndLikeProvider>
    </div>
  );
}

export default Provider;
