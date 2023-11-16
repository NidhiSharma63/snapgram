import { useEffect, useState } from "react";

const darkModeValueInLocalStorage = localStorage.getItem("theme-for-snapgram");

function App() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    darkModeValueInLocalStorage ? JSON.parse(darkModeValueInLocalStorage) : false
  );

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
    <>
      <p onClick={() => setDarkModeEnabled((prev: boolean) => !prev)}>dark mode add</p>
      <h1 className="text-2xl font-light text-cyan-800 underline">Hello world!</h1>
    </>
  );
}

export default App;
