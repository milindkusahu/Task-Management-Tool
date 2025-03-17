import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { UserProfile } from "../types/user";

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function createUserProfile(
  userProfile: UserProfile
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userProfile.uid);
    await setDoc(userDocRef, {
      ...userProfile,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: UserProfile["preferences"]
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      preferences,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
}
