import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import { getUserProfile } from "../services/userService";

export function useCurrentUser() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["currentUser", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      return getUserProfile(user.uid);
    },
    enabled: !!user?.uid,
    staleTime: 60 * 1000, // 1 minute
  });
}
