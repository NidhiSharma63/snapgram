import Provider from "@/src/app/Provider";
import BottomBar from "@/src/components/shared/BottomBar";
import LeftBar from "@/src/components/shared/LeftSidebar";
import TopBar from "@/src/components/shared/TopSidebar";
import { Toaster } from "@/src/components/ui/toaster";
import getUserDetails from "@/src/lib/getUserDetails";
import "@/src/styles/global.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // await connectToMongoDB();
  // await connectDB();

  const { token, userId, uniqueBrowserId } = getUserDetails();
  // console.log({ user });
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Snapgram - Share Your Moments</title>
        <meta
          name="description"
          content="Snapgram - A place to capture and share your moments. Join our community and start exploring, sharing, and connecting with friends."
        />
        <meta
          name="keywords"
          content="Snapgram, social media, photo sharing, video sharing, Instagram clone, connect, moments, memories"
        />
        <meta name="author" content="Nidhi Sharma" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://snapgram.example.com/" />
        <meta property="og:title" content="Snapgram - Share Your Moments" />
        <meta
          property="og:description"
          content="Snapgram - A place to capture and share your moments. Join our community and start exploring, sharing, and connecting with friends."
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://snapgram.example.com/" />
        <meta property="twitter:title" content="Snapgram - Share Your Moments" />
        <meta
          property="twitter:description"
          content="Snapgram - A place to capture and share your moments. Join our community and start exploring, sharing, and connecting with friends."
        />
        {/* <metadata /> */}
      </head>
      <body>
        <Provider>
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
        </Provider>
        {/* </UserPostIdSaveAndLikeProvider> */}
        <Toaster />
      </body>
    </html>
  );
}
