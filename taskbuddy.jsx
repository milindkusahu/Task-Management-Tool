import React, { useState } from "react";
import { ChevronUp, ChevronDown, Search, LogOut } from "lucide-react";

const TaskBuddy = () => {
  const [view, setView] = useState("list");
  const [todoExpanded, setTodoExpanded] = useState(true);
  const [inProgressExpanded, setInProgressExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
          <h1 className="text-xl font-medium text-gray-800">TaskBuddy</h1>
        </div>
        <div className="flex items-center">
          <div
            className="flex items-center relative cursor-pointer"
            onClick={() => setShowLogout(!showLogout)}
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
              A
            </div>
            <span className="ml-2 text-gray-700">Aravind</span>

            {showLogout && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white shadow-lg rounded-lg py-1 z-10">
                <button className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100">
                  <LogOut size={16} className="mr-2" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* View Toggle */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex items-center space-x-4">
          <button
            className={`flex items-center pb-1 ${
              view === "list"
                ? "text-gray-800 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
            onClick={() => setView("list")}
          >
            <span className="mr-2">☰</span> List
          </button>
          <button
            className={`flex items-center pb-1 ${
              view === "board"
                ? "text-gray-800 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
            onClick={() => setView("board")}
          >
            <span className="mr-2">⊞</span> Board
          </button>
        </div>
      </div>

      {/* Filters, Search and Add Task */}
      <div className="px-6 pb-4 flex items-center justify-between">
        <div className="flex items-center text-sm">
          <span className="mr-2 text-gray-600">Filter by:</span>
          <div className="relative inline-block">
            <button className="flex items-center border rounded px-3 py-1 text-gray-700">
              <span>Category</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
          <div className="relative inline-block ml-2">
            <button className="flex items-center border rounded px-3 py-1 text-gray-700">
              <span>Due Date</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 border rounded-lg text-sm focus:outline-none"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            ADD TASK
          </button>
        </div>
      </div>

      {view === "list" ? (
        <>
          {/* Task List Header */}
          <div className="px-6 py-2 grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 border-b">
            <div className="col-span-5">Task name</div>
            <div className="col-span-2">Due on</div>
            <div className="col-span-3">Task Status</div>
            <div className="col-span-2">Task Category</div>
          </div>

          {/* Task Lists */}
          <div className="flex-1 overflow-auto px-6 py-2">
            {/* Todo Section */}
            <div className="mb-4 border rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center px-4 py-3 bg-pink-100 cursor-pointer"
                onClick={() => setTodoExpanded(!todoExpanded)}
              >
                <h3 className="font-medium text-gray-800">Todo (3)</h3>
                {todoExpanded ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </div>

              {todoExpanded && (
                <div>
                  <div className="px-4 py-3 bg-white border-t text-center">
                    <button className="flex items-center text-purple-600 mx-auto">
                      <span className="mr-1">+</span> ADD TASK
                    </button>
                  </div>

                  <div className="flex items-center justify-center h-40 bg-gray-50 text-gray-500">
                    No Tasks in To-Do
                  </div>
                </div>
              )}
            </div>

            {/* In-Progress Section */}
            <div className="mb-4 border rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center px-4 py-3 bg-blue-100 cursor-pointer"
                onClick={() => setInProgressExpanded(!inProgressExpanded)}
              >
                <h3 className="font-medium text-gray-800">In-Progress (3)</h3>
                {inProgressExpanded ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </div>

              {inProgressExpanded && (
                <div className="flex items-center justify-center h-40 bg-gray-50 text-gray-500">
                  No Tasks In Progress
                </div>
              )}
            </div>

            {/* Completed Section */}
            <div className="mb-4 border rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center px-4 py-3 bg-green-100 cursor-pointer"
                onClick={() => setCompletedExpanded(!completedExpanded)}
              >
                <h3 className="font-medium text-gray-800">Completed (3)</h3>
                {completedExpanded ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </div>

              {completedExpanded && (
                <div className="flex items-center justify-center h-40 bg-gray-50 text-gray-500">
                  {/* Completed tasks would go here */}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Kanban Board View */
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="flex h-full space-x-4">
            {/* Todo Column */}
            <div className="flex-1 flex flex-col bg-gray-100 rounded-lg shadow-sm">
              <div className="px-3 py-2 mb-4">
                <span className="px-3 py-1 bg-pink-200 rounded-md text-sm font-medium">
                  TO-DO
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center text-gray-500">
                No Tasks in To-Do
              </div>
            </div>

            {/* In Progress Column */}
            <div className="flex-1 flex flex-col bg-gray-100 rounded-lg shadow-sm">
              <div className="px-3 py-2 mb-4">
                <span className="px-3 py-1 bg-blue-200 rounded-md text-sm font-medium">
                  IN-PROGRESS
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center text-gray-500">
                No Tasks In Progress
              </div>
            </div>

            {/* Completed Column */}
            <div className="flex-1 flex flex-col bg-gray-100 rounded-lg shadow-sm">
              <div className="px-3 py-2 mb-4">
                <span className="px-3 py-1 bg-green-200 rounded-md text-sm font-medium">
                  COMPLETED
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center text-gray-500">
                No Completed Tasks
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBuddy;
