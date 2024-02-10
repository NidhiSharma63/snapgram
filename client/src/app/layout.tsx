import BottomBar from "@/src/components/shared/BottomBar";
import LeftBar from "@/src/components/shared/LeftSidebar";
import TopBar from "@/src/components/shared/TopSidebar";
import { Toaster } from "@/src/components/ui/toaster";
import "@/src/styles/global.css";
import getUserDetails from "../lib/getUserDetails";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // await connectToMongoDB();
  // await connectDB();

  const { token, userId, uniqueBrowserId } = getUserDetails();
  // console.log({ user });
  return (
    <html lang="en">
      <head>
        <title content="Todo's"></title>
        <metadata />
      </head>
      <body>
        <div className="w-full md:flex  h-screen md:overflow-hidden overflow-y-scroll overflow-x-hidden">
          {!token || !userId || !uniqueBrowserId ? (
            <section className="flex flex-1 h-full overflow-x-hidden">{children}</section>
          ) : (
            <>
              <TopBar />
              <LeftBar />
              <section className="flex flex-1 h-full overflow-x-hidden">{children}</section>
              <BottomBar />
            </>
          )}
        </div>

        <Toaster />
      </body>
    </html>
  );
}
