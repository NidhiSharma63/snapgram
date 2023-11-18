import AuthLayout from "@/components/auth/AuthLayout";
import { Layout, NotFound, SignInForm, SignUpForm } from "@/pages";
import Home from "@/pages/Home";
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
