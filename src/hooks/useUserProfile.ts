import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  updateUserPreferences,
} from "../services/userService";
import { UserProfile, createUserProfileFromFirebase } from "../types/user";

export function useUserProfile() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const userProfileQuery = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;

      const profile = await getUserProfile(user.uid);

      // If profile doesn't exist yet, create one from Firebase user
      if (!profile && user) {
        const newProfile = createUserProfileFromFirebase(user);
        await createUserProfile(newProfile);
        return newProfile;
      }

      return profile;
    },
    enabled: !!user?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return await updateUserProfile(user.uid, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.uid] });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: UserProfile["preferences"]) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return await updateUserPreferences(user.uid, preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.uid] });
    },
  });

  return {
    profile: userProfileQuery.data,
    isLoading: userProfileQuery.isLoading,
    error: userProfileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating:
      updateProfileMutation.isPending || updatePreferencesMutation.isPending,
  };
}
