import { bottombarLinks } from "@/constant/links";
import { useSocket } from "@/context/socketProviders";
import { getUnreadCountBasesOnUserId } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function BottomBar() {
  const { pathname } = useLocation();
  const { unSeenMsgs } = useSocket();
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  useEffect(() => {
    setUnreadMsgCount(getUnreadCountBasesOnUserId(unSeenMsgs));
  }, [unSeenMsgs]);

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
            {link.label === "Inbox" && unreadMsgCount > 0 && (
              <span className="absolute right-[10px] top-[1px] w-4 h-4 bg-red rounded-full flex items-center justify-center">
                <p className="text-white text-xs">{unreadMsgCount}</p>
              </span>
            )}
            <p className="tiny-medium text-xs">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
}
