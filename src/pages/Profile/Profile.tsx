import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuthContext } from "../../hooks/useAuthContext";
import { ProfileFormData } from "../../types/user";
import {
  PageLayout,
  Card,
  Button,
  Input,
  Dropdown,
  Checkbox,
  Spinner,
} from "../../components";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuthContext();
  const {
    profile,
    isLoading,
    error,
    updateProfile,
    updatePreferences,
    isUpdating,
  } = useUserProfile();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: profile?.displayName || "",
    theme: profile?.preferences?.theme || "light",
    defaultView: profile?.preferences?.defaultView || "list",
    emailNotifications: profile?.preferences?.emailNotifications || true,
  });

  // Reset form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        theme: profile.preferences?.theme || "light",
        defaultView: profile.preferences?.defaultView || "list",
        emailNotifications: profile.preferences?.emailNotifications || true,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.loading("Updating profile...", { id: "profile-update" });

    try {
      // Create promises array for all updates
      const updatePromises = [];

      // Only update display name if it has changed
      if (formData.displayName !== profile?.displayName) {
        const profilePromise = new Promise((resolve, reject) => {
          updateProfile(
            { displayName: formData.displayName },
            {
              onSuccess: () => resolve(true),
              onError: (error) => reject(error),
            }
          );
        });
        updatePromises.push(profilePromise);
      }

      // Update preferences
      const preferencesPromise = new Promise((resolve, reject) => {
        updatePreferences(
          {
            theme: formData.theme as "light" | "dark",
            defaultView: formData.defaultView as "list" | "board",
            emailNotifications: formData.emailNotifications,
          },
          {
            onSuccess: () => resolve(true),
            onError: (error) => reject(error),
          }
        );
      });
      updatePromises.push(preferencesPromise);

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      setIsEditing(false);
      toast.success("Profile updated successfully!", { id: "profile-update" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", {
        id: "profile-update",
      });
    }
  };

  const headerRightContent = (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <PageLayout
        title="Profile"
        headerProps={{ rightContent: headerRightContent }}
      >
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Profile"
        headerProps={{ rightContent: headerRightContent }}
      >
        <Card>
          <div className="p-4 text-red-500">
            Error loading profile. Please try again later.
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Profile"
      headerProps={{ rightContent: headerRightContent }}
    >
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl text-gray-600">
                  {profile?.displayName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "?"}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            {!isEditing ? (
              <div>
                <h2 className="text-2xl font-bold">
                  {profile?.displayName || "No display name"}
                </h2>
                <p className="text-gray-600">{profile?.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since:{" "}
                  {profile?.createdAt instanceof Date
                    ? profile.createdAt.toLocaleDateString()
                    : profile?.createdAt && "seconds" in profile.createdAt
                    ? new Date(
                        profile.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : "Unknown date"}
                </p>
                <div className="mt-4">
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Display Name"
                  name="displayName"
                  value={formData.displayName || ""}
                  onChange={handleInputChange}
                  fullWidth
                />

                <Dropdown
                  label="Theme"
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                  ]}
                  value={formData.theme}
                  onChange={(value) => handleDropdownChange("theme", value)}
                  fullWidth
                />

                <Dropdown
                  label="Default View"
                  options={[
                    { value: "list", label: "List" },
                    { value: "board", label: "Board" },
                  ]}
                  value={formData.defaultView}
                  onChange={(value) =>
                    handleDropdownChange("defaultView", value)
                  }
                  fullWidth
                />

                <Checkbox
                  label="Email Notifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleInputChange}
                />

                <div className="flex gap-4 pt-2">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" color="white" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default Profile;
