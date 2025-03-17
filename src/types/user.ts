import { User } from "firebase/auth";

export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Date | FirestoreTimestamp;
  lastLogin: Date | FirestoreTimestamp;
  preferences?: {
    theme?: "light" | "dark";
    defaultView?: "list" | "board";
    emailNotifications?: boolean;
  };
}

export interface ProfileFormData {
  displayName: string;
  theme: "light" | "dark";
  defaultView: "list" | "board";
  emailNotifications: boolean;
}

export function createUserProfileFromFirebase(user: User): UserProfile {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: new Date(),
    lastLogin: new Date(),
    preferences: {
      theme: "light",
      defaultView: "list",
      emailNotifications: true,
    },
  };
}
