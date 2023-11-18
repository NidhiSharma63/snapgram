import AuthLayout from "@/components/auth/AuthLayout";
import { CreatePost, EditPost, Home, Layout, NotFound, Profile, SignInForm, SignUpForm } from "@/pages";

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
