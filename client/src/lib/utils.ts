import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getValueFromLS(key: string): string | null {
  const storedValue = localStorage.getItem(key);
  console.log({ storedValue });
  if (typeof storedValue === "string") {
    return storedValue;
  }

  // Return a default value or null if the key doesn't exist or parsing fails
  return null;
}

export function setValueToLS(key: string, value: string) {
  localStorage.setItem(key, value);
}
