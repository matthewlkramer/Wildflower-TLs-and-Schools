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
    // Red pills for closed/disaffiliated statuses and denied
    case "permanently closed":
    case "disaffiliated":
    case "disaffiliating":
    case "denied":
      return "bg-red-100 text-red-800";
    
    // Pink for paused
    case "paused":
      return "bg-pink-100 text-pink-800";
    
    // Yellow for awaiting start of cohort
    case "awaiting start of cohort":
      return "bg-yellow-100 text-yellow-800";
    
    // Green gradient from light to dark for progression stages
    case "application submitted":
      return "bg-green-50 text-green-600"; // Lightest green
    case "approved - year 0":
      return "bg-green-100 text-green-700"; // Light green
    case "visioning":
      return "bg-green-100 text-green-700";
    case "planning":
      return "bg-green-200 text-green-800";
    case "startup":
      return "bg-green-200 text-green-800";
    case "open":
      return "bg-green-300 text-green-900"; // Darkest green
    
    // Other statuses
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
    
    // Placeholder/empty values
    case "":
    case "placeholder":
    case "tbd":
    case "to be determined":
    case "pending":
    case "unknown":
      return "bg-gray-100 text-gray-600";
    
    default:
      return "bg-gray-100 text-gray-600";
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
