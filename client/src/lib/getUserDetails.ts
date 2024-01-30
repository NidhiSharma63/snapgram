import { cookies } from "next/headers";
function getUserDetails() {
  const token = cookies().get("token");
  const userId = cookies().get("userId");
  const uniqueBrowserId = cookies().get("browserId");
  return { userId, token, uniqueBrowserId };
}

export default getUserDetails;
