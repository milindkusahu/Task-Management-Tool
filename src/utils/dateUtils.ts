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
