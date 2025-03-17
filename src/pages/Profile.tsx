import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuthContext } from "../hooks/useAuthContext";
import { ProfileFormData } from "../types/user";

const Profile = () => {
  const { user, logout } = useAuthContext();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading profile
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update display name if changed
      if (formData.displayName !== profile?.displayName) {
        updateProfile({ displayName: formData.displayName });
      }

      // Update preferences
      updatePreferences({
        theme: formData.theme,
        defaultView: formData.defaultView,
        emailNotifications: formData.emailNotifications,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="py-1 px-3 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
            <button
              onClick={logout}
              className="py-1 px-3 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
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
                    <button
                      onClick={() => setIsEditing(true)}
                      className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="theme"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Theme
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="defaultView"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Default View
                    </label>
                    <select
                      id="defaultView"
                      name="defaultView"
                      value={formData.defaultView}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="list">List</option>
                      <option value="board">Board</option>
                    </select>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={formData.emailNotifications}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="emailNotifications"
                        className="font-medium text-gray-700"
                      >
                        Email Notifications
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
