import AuthLayout from "@/components/auth/AuthLayout";
// import { SocketProvider } from "@/context/socketProviders";
import { PostProvider } from "@/context/postsProvider";
import { UserDetailsProvider } from "@/context/userContext";
import { UserPostIdSaveAndLikeProvider } from "@/context/userPostIdForSaveAndLike";
import {
  AllUser,
  CreatePost,
  EditPost,
  Explore,
  Home,
  Layout,
  NotFound,
  Post,
  Profile,
  SavePost,
  SignInForm,
  SignUpForm,
  UpdateProfile,
} from "@/pages";
import type { ComponentType } from "react";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInForm />,
  },

  {
    path: "/sign-up",
    element: <SignUpForm />,
  },
  {
    path: "/",
    element: wrapProviders(Layout),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/create-post",
        element: <CreatePost />,
      },
      {
        path: "/update-post/:id",
        element: <EditPost />,
      },

      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/update-profile/:id",
        element: <UpdateProfile />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/posts/:id",
        element: <Post />,
      },
      {
        path: "/all-users",
        element: <AllUser />,
      },
      {
        path: "/saved",
        element: <SavePost />,
      },
      // {
      //   path: "/inbox",
      //   element: <Inbox />,
      // },
      // {
      // 	path: "/inbox/:userId",
      // 	element: <Chat />,
      // },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
function wrapProviders(Component: ComponentType) {
	return (
    <AuthLayout>
      <UserDetailsProvider>
        {/* <SocketProvider> */}
        <UserPostIdSaveAndLikeProvider>
          <PostProvider>
            <Component />
          </PostProvider>
        </UserPostIdSaveAndLikeProvider>
        {/* </SocketProvider> */}
      </UserDetailsProvider>
    </AuthLayout>
  );
}

function App() {
	return <RouterProvider router={router} />;
}

export default App;
