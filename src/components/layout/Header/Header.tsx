import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { MobileDocumentIcon, LogoutIcon } from "../../../utils/icons";
import { Button } from "../../common/Button";

export interface HeaderProps {
  showAddTaskButton?: boolean;
  onAddTaskClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showAddTaskButton = true,
  onAddTaskClick,
}) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 bg-white py-4 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and title */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <MobileDocumentIcon width={24} height={24} color="#2F2F2F" />
          <h1 className="font-semibold text-[#2F2F2F] text-xl">TaskBuddy</h1>
        </Link>

        {/* Right side content */}
        <div className="flex items-center gap-4">
          {/* Add Task button */}
          {showAddTaskButton && (
            <button
              onClick={onAddTaskClick}
              className="bg-[#7B1984] text-white px-4 py-2 rounded-md font-medium text-sm"
            >
              ADD TASK
            </button>
          )}

          {/* User profile */}
          {user && (
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.displayName?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "?"}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">
                  {user.displayName || "Profile"}
                </span>
              </div>

              {/* Logout link */}
              <Link
                to="/"
                onClick={logout}
                className="text-sm font-medium text-gray-600 flex items-center gap-1"
              >
                <LogoutIcon className="w-4 h-4" />
                <span>Logout</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
