import { useAuthContext } from "../hooks/useAuthContext";

const Dashboard = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <div className="flex items-center gap-4">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            )}
            <span>{user?.displayName}</span>
            <button
              onClick={logout}
              className="py-1 px-3 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p>Your tasks will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
