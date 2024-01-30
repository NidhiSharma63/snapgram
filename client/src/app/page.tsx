"use client";

// import logout from "@/src/server/authActions/logout";
import getUserDetails from "../lib/getUserDetails";

function Page() {
  const handleLogout = async () => {
    const { userId, token } = getUserDetails();
    console.log({ userId, token });
    // await logout({ userId, token });
  };
  return (
    <div>
      <h1>Pageis </h1>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}

export default Page;
