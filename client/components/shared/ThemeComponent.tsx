import { useTheme } from "@/context/themeProviders";
import { useState } from "react";

function ThemeComponent({ isDisplayedOnTopBar }: { isDisplayedOnTopBar: boolean }) {
  const { theme, setTheme } = useTheme();
  const [isDisplayBlockForThemeIcon, setDisplayBlockForThemeIcon] = useState<string>(theme);

  const setThemeToDark = () => {
    setTheme("dark");
    setDisplayBlockForThemeIcon("dark");
  };

  const setThemeToLight = () => {
    setTheme("light");
    setDisplayBlockForThemeIcon("light");
  };

  return (
    <>
      <img
        src="/assets/images/moonIcon.png"
        className={`w-6 cursor-pointer transform visible  ${
          isDisplayBlockForThemeIcon === "dark"
            ? "transition-transform  opacity-100 translate-y-[0px] ease-in duration-300"
            : "opacity-0 translate-y-[10px] invisible"
        }`}
        onClick={setThemeToLight}
      />
      <img
        src="/assets/icons/sun.svg"
        className={`w-6 cursor-pointer transition-transform duration-300 transform visible absolute ${
          isDisplayedOnTopBar ? "left-[84%]" : "left-[18%]"
        } ${
          isDisplayBlockForThemeIcon === "light"
            ? "transition-opacity opacity-100 translate-y-[0px]  "
            : `opacity-0 translate-y-[10px] invisible  `
        }`}
        onClick={setThemeToDark}
      />
    </>
  );
}

export default ThemeComponent;
