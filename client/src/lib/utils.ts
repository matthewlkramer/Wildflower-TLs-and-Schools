import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    // Red pills for closed/disaffiliated statuses
    case "permanently closed":
    case "disaffiliated":
    case "disaffiliating":
      return "bg-red-100 text-red-800";
    
    // Green gradient from light to dark for progression stages
    case "visioning":
      return "bg-green-50 text-green-600"; // Lightest green
    case "planning":
      return "bg-green-100 text-green-700";
    case "startup":
      return "bg-green-200 text-green-800";
    case "open":
      return "bg-green-300 text-green-900"; // Darkest green
    
    // Other statuses
    case "paused":
      return "bg-yellow-100 text-yellow-800";
    case "year 1":
    case "year 2":
    case "year 3":
      return "bg-blue-100 text-blue-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "on leave":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getRandomColor(): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
