import AuthLayout from "@/components/auth/AuthLayout";
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

import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInForm />,
  },

  {
    path: "/sign-up",
    element: (
      <>
        <SignUpForm />
      </>
    ),
  },
  {
    path: "/",
    element: (
      <AuthLayout>
        <Layout />
      </AuthLayout>
    ),
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
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
