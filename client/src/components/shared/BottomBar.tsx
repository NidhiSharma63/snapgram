import { bottombarLinks } from "@/constant/links";
import { Link, useLocation } from "react-router-dom";

export default function BottomBar() {
  const { pathname } = useLocation();

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            to={link.route}
            key={link.label}
            className={`${
              isActive && "bg-primary-500 rounded-[10px]"
            } flex-center flex-col gap-1 p-2 transition relative`}
          >
            <img
              width={16}
              height={16}
              src={link.imgURL}
              alt={link.label}
              className={`${isActive && "invert-white"}`}
            />
            <p className="tiny-medium text-xs">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
}
