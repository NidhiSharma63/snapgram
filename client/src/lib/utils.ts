import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getValueFromLS(key: string): string | null {
  const storedValue = localStorage.getItem(key);
  if (typeof storedValue === "string") {
    return storedValue;
  }

  // Return a default value or null if the key doesn't exist or parsing fails
  return null;
}

export function setValueToLS(key: string, value: string | null) {
  if (value !== null) {
    localStorage.setItem(key, value);
  } else {
    // Optionally handle the case where value is null, e.g., removing the item from localStorage
    localStorage.removeItem(key);
  }
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

// export const getUnreadCountBasesOnUserId = (messages) => {
//   let unreadMessages = 0;
//   const tempArr = [];
//   // if current roomId is present in the tempArr then don't increase the unreadmessages
//   // else increase it by 1
//   messages.forEach((message) => {
//     if (!tempArr.includes(message.roomId)) {
//       tempArr.push(message.roomId);
//       unreadMessages++;
//     }
//   });

//   return unreadMessages;
// };