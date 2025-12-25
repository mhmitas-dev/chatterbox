import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatShortDateTimeLocal(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);

  const day = date.getDate();                    // ← local
  const month = date.toLocaleString('en-US', { month: 'short' });
  const hours = date.getHours();                   // ← local
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${hours}:${minutes}`;
}