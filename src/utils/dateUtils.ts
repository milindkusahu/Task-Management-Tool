import { FirestoreTimestamp } from "../types/user";

export function formatDate(
  dateValue: string | Date | FirestoreTimestamp | undefined | null
): string {
  if (!dateValue) return "Not set";

  // If it's a Firestore timestamp
  if (dateValue && typeof dateValue === "object" && "seconds" in dateValue) {
    return new Date(dateValue.seconds * 1000).toLocaleDateString();
  }

  // If it's already a string
  if (typeof dateValue === "string") {
    // Check if it's a valid date string
    if (isNaN(Date.parse(dateValue))) {
      return dateValue;
    }
    return new Date(dateValue).toLocaleDateString();
  }

  // If it's a Date object
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString();
  }

  return "Invalid date";
}

export function formatTimestamp(
  timestamp: FirestoreTimestamp | undefined | null
): Date {
  if (!timestamp) return new Date();

  if (typeof timestamp === "object" && "seconds" in timestamp) {
    return new Date(timestamp.seconds * 1000);
  }

  return new Date();
}

export function getRelativeDateLabel(dateString: string): string {
  if (!dateString) return "No date";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time portion for comparison
  const dateWithoutTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayWithoutTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const tomorrowWithoutTime = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate()
  );
  const yesterdayWithoutTime = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

  if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
    return "Today";
  } else if (dateWithoutTime.getTime() === tomorrowWithoutTime.getTime()) {
    return "Tomorrow";
  } else if (dateWithoutTime.getTime() === yesterdayWithoutTime.getTime()) {
    return "Yesterday";
  }

  // For other dates, return formatted date
  return date.toLocaleDateString();
}
