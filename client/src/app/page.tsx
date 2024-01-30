"use client";

import { toast } from "@/src/components/ui/use-toast";
import logout from "@/src/server/authActions/logout";
import { useRouter } from "next/navigation";
function Page() {
  const router = useRouter();
  const handleLogout = async () => {
    console.log("first");
    const res = await logout();
    if (res?.message) {
      router.push("/");
    } else {
      toast({
        title: res?.error,
      });
    }
  };
  return (
    <div>
      <h1>Pageis </h1>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}

export default Page;
