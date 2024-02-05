import { multiFormatDateString } from "@/src/lib/utils";
import { useEffect, useState } from "react";

function ShowTime({ createdAt }: { createdAt: Date }) {
  const [time, setTime] = useState(createdAt.toString());

  useEffect(() => {
    setTime(multiFormatDateString(createdAt.toString()));
  }, [createdAt]);

  return <p className="subtle-semibold lg:small-reguler">{time}</p>;
}

export default ShowTime;
