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
