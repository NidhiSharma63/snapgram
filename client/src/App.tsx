import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/themeProviders";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

const darkModeValueInLocalStorage = localStorage.getItem("theme-for-snapgram");

function App() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    darkModeValueInLocalStorage ? JSON.parse(darkModeValueInLocalStorage) : false
  );
  const { setTheme } = useTheme();

  useEffect(() => {
    if (darkModeEnabled) {
      window.document.documentElement.classList.add("dark");
      localStorage.setItem("theme-for-snapgram", "true");
    } else {
      window.document.documentElement.classList.remove("dark");
      localStorage.setItem("theme-for-snapgram", "false");
    }
  }, [darkModeEnabled]);

  return (
    <Routes>
      {/* <Route element={<AuthLayout />}>
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
      </Route> */}
      <Route
        path="/"
        element={
          <>
            <p onClick={() => setDarkModeEnabled((prev: boolean) => !prev)}>dark mode add</p>
            <h1 className="text-2xl font-light text-cyan-800 underline">Hello world!</h1>
            <Button variant="outline" onClick={() => setTheme("dark")}>
              Change the theme plz to Dark
            </Button>
            <Button variant="outline" onClick={() => setTheme("light")}>
              Change the theme plz to light
            </Button>
          </>
        }
      />
    </Routes>
  );
}

export default App;
