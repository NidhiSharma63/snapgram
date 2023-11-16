import AuthLayout from "@/components/auth/AuthLayout";
import { Layout, NotFound, SignInForm, SignUpForm } from "@/pages";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/signIn",
    element: <SignInForm />,
  },

  {
    path: "/signUp",
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
    // children: [
    //   {
    //     path: "Dashboard",
    //     element: <ProjectPage />,
    //     children: [
    //       {
    //         path: "activeProject/board/:active_project",
    //         element: <Board />,
    //       },
    //     ],
    //   },
    // ],
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
