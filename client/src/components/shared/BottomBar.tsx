"use client";
import { bottombarLinks } from "@/src/constant/link";
import Link from "next/link";
import { usePathname } from "next/navigation";

function BottomBar() {
  const pathname = usePathname();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            href={link.route}
            key={link.label}
            className={`${isActive && "bg-primary-500 rounded-[10px]"} flex-center flex-col gap-1 p-2 transition`}>
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

export default BottomBar;
