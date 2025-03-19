import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useTasks } from "../hooks/useTasks";
import { TaskSection } from "../components/task/TaskSection";
import { BoardView } from "../components/task/BoardView";
import { CreateTaskModal } from "../components/task/CreateTaskModal";
import { Task } from "../types/task";
import { formatDate } from "../utils/dateUtils";
import {
  BoardIcon,
  ChevronDownIcon,
  ListIcon,
  LogoutIcon,
  MobileDocumentIcon,
  SearchIcon,
} from "../utils/icons";
import { TaskDetailModal } from "../components/task/TaskDetailModal";

const Dashboard = () => {
  const { logout, user } = useAuthContext();
  const { data: userProfile, isLoading: isLoadingProfile } = useCurrentUser();
  const {
    todoTasks,
    inProgressTasks,
    completedTasks,
    isLoading: isLoadingTasks,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
  } = useTasks();

  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "board">("list");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    dueDate: "",
    searchText: "",
  });
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const handleTaskUpdate = async ({ taskId, updates }) => {
    try {
      await updateTask({ taskId, updates });
      setIsTaskDetailModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Transform tasks for UI display
  const transformTasks = (tasks: Task[]) => {
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate:
        typeof task.dueDate === "string"
          ? task.dueDate
          : formatDate(task.dueDate),
      category: task.category,
      description: task.description,
    }));
  };

  // Filter function
  const filterTasks = (tasks: any[]) => {
    return tasks.filter((task) => {
      // Filter by category
      if (filters.category && task.category !== filters.category) {
        return false;
      }

      // Filter by due date
      if (filters.dueDate && task.dueDate !== filters.dueDate) {
        return false;
      }

      // Filter by search text
      if (
        filters.searchText &&
        !task.title.toLowerCase().includes(filters.searchText.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  // Get status from section ID
  const getStatusFromSectionId = (sectionId: string) => {
    switch (sectionId) {
      case "todo":
        return "TO-DO";
      case "inProgress":
        return "IN-PROGRESS";
      case "completed":
        return "COMPLETED";
      default:
        return "TO-DO";
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask({ id: task.id, status: task.status });
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id: task.id, status: task.status })
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();

    if (!draggedTask) return;

    const { id, status } = draggedTask;

    // If dropped in the same section, do nothing
    if (status === targetStatus) return;

    // Update the task status
    updateTask({
      taskId: String(id),
      updates: { status: targetStatus },
    });

    setDraggedTask(null);
  };

  // Filter handlers
  const handleCategoryFilter = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    setShowCategoryFilter(false);
  };

  const handleDueDateFilter = (dueDate: string) => {
    setFilters((prev) => ({ ...prev, dueDate }));
    setShowDateFilter(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchText: e.target.value }));
  };

  // Apply filters and create task sections
  const filteredTaskSections = [
    {
      id: "todo",
      title: `Todo (${filterTasks(transformTasks(todoTasks)).length})`,
      color: "bg-[#FAC3FF]",
      tasks: filterTasks(transformTasks(todoTasks)),
      status: "TO-DO",
    },
    {
      id: "inProgress",
      title: `In-Progress (${
        filterTasks(transformTasks(inProgressTasks)).length
      })`,
      color: "bg-[#85D9F1]",
      tasks: filterTasks(transformTasks(inProgressTasks)),
      status: "IN-PROGRESS",
    },
    {
      id: "completed",
      title: `Completed (${
        filterTasks(transformTasks(completedTasks)).length
      })`,
      color: "bg-[#CDFFCC]",
      tasks: filterTasks(transformTasks(completedTasks)),
      status: "COMPLETED",
    },
  ];

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    category: string;
    dueDate: string;
    status: string;
    attachments?: File[];
  }) => {
    try {
      // Create the task
      await createTask({
        taskData: {
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          status: taskData.status,
          dueDate: taskData.dueDate,
        },
        attachmentFiles: taskData.attachments,
      });

      // Close the modal
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      // You could show an error notification here
    }
  };

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCategoryFilter || showDateFilter) {
        const target = event.target as HTMLElement;
        if (!target.closest(".filter-dropdown")) {
          setShowCategoryFilter(false);
          setShowDateFilter(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryFilter, showDateFilter]);

  const ProfileDropdown = ({ isMobile = false }) => (
    <div
      className={`relative flex items-center gap-3 cursor-pointer ${
        isMobile ? "" : "mb-2"
      }`}
    >
      <div
        className="flex items-center gap-2"
        onClick={() => navigate("/profile")}
      >
        {userProfile?.photoURL && (
          <img
            src={userProfile.photoURL}
            alt="Profile"
            className="h-9 w-9 rounded-full"
          />
        )}
        {!isMobile && (
          <span className="font-bold text-[#000000]/60">
            {isLoadingProfile
              ? "Loading..."
              : userProfile?.displayName || "Profile"}
          </span>
        )}
      </div>

      {!isMobile && (
        <button
          onClick={logout}
          className="flex items-center gap-2 ml-4 py-2 px-3 bg-[#FFF9F9] border border-[#7B1984]/15 rounded-xl text-xs text-black font-semibold hover:bg-gray-50"
        >
          <LogoutIcon className="w-[15px] h-[13px]" />
          Logout
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-[1402px] mx-auto">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#FAC3FF] p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MobileDocumentIcon width={29} height={29} color="#2F2F2F" />
            <h1 className="font-semibold text-[#2F2F2F] text-2xl">TaskBuddy</h1>
          </div>
          <ProfileDropdown isMobile />
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-start p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-1.5">
            <MobileDocumentIcon width={29} height={29} color="#2F2F2F" />
            <h1 className="font-semibold text-[#2F2F2F] text-2xl">TaskBuddy</h1>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1 font-semibold ${
                view === "list" ? "text-black" : "text-[#231F20] opacity-80"
              }`}
            >
              <ListIcon className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setView("board")}
              className={`flex items-center gap-1 font-semibold ${
                view === "board" ? "text-black" : "text-[#231F20] opacity-80"
              }`}
            >
              <BoardIcon className="w-4 h-4" />
              Board
            </button>
          </div>

          <div className="w-[47px] h-px bg-black rounded-sm ml-2" />
        </div>

        <div className="flex flex-col items-end">
          <ProfileDropdown />
        </div>
      </header>

      <div className="p-4 md:p-8">
        {/* Mobile Add Task Button */}
        <div className="md:hidden mb-4">
          <button
            className="w-full bg-[#7B1984] text-white rounded-[41px] py-3 font-bold"
            onClick={() => setIsTaskModalOpen(true)}
          >
            ADD TASK
          </button>
        </div>

        {/* Task List Headers */}
        {view === "list" && (
          <div className="mb-2 hidden md:block">
            <div className="grid grid-cols-4 gap-4 px-4 py-2">
              <div className="font-bold text-[#000000]/60 text-sm">
                Task name
              </div>
              <div className="font-bold text-[#000000]/60 text-sm flex items-center">
                Due on
                <div className="ml-2 flex flex-col h-4 justify-between">
                  <div className="w-2 h-1 bg-black"></div>
                  <div className="w-2 h-1 bg-black"></div>
                </div>
              </div>
              <div className="font-bold text-[#000000]/60 text-sm">
                Task Status
              </div>
              <div className="font-bold text-[#000000]/60 text-sm">
                Task Category
              </div>
            </div>
            <hr className="my-2" />
          </div>
        )}

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#000000]/60 text-xs font-semibold">
              Filter by:
            </span>
            <div className="flex gap-2.5">
              <div className="relative filter-dropdown">
                <button
                  className="h-8 px-2 py-[5px] rounded-[60px] border border-[#000000]/20 flex items-center"
                  onClick={() => {
                    setShowCategoryFilter(!showCategoryFilter);
                    setShowDateFilter(false);
                  }}
                >
                  <span className="text-[#000000]/60 text-xs font-semibold">
                    {filters.category || "Category"}
                  </span>
                  <ChevronDownIcon className="w-[18px] h-[18px] ml-1" />
                </button>
                {showCategoryFilter && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-md z-10 w-32">
                    <div className="py-1">
                      <button
                        className="w-full px-3 py-1 text-left hover:bg-gray-100 text-sm"
                        onClick={() => handleCategoryFilter("")}
                      >
                        All
                      </button>
                      <button
                        className="w-full px-3 py-1 text-left hover:bg-gray-100 text-sm"
                        onClick={() => handleCategoryFilter("WORK")}
                      >
                        Work
                      </button>
                      <button
                        className="w-full px-3 py-1 text-left hover:bg-gray-100 text-sm"
                        onClick={() => handleCategoryFilter("PERSONAL")}
                      >
                        Personal
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative filter-dropdown">
                <button
                  className="h-8 px-2 py-[5px] rounded-[60px] border border-[#000000]/20 flex items-center"
                  onClick={() => {
                    setShowDateFilter(!showDateFilter);
                    setShowCategoryFilter(false);
                  }}
                >
                  <span className="text-[#000000]/60 text-xs font-semibold">
                    {filters.dueDate || "Due Date"}
                  </span>
                  <ChevronDownIcon className="w-[18px] h-[18px] ml-1" />
                </button>
                {showDateFilter && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-md z-10 w-40 p-2">
                    <input
                      type="date"
                      value={filters.dueDate}
                      onChange={(e) => handleDueDateFilter(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {filters.dueDate && (
                      <button
                        className="w-full mt-1 text-xs text-blue-600 hover:underline text-left"
                        onClick={() => handleDueDateFilter("")}
                      >
                        Clear date filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:flex-none">
              <input
                className="w-full md:w-[206px] h-[38px] pl-9 pr-3 py-1.5 rounded-[60px] border border-[#000000]/42"
                placeholder="Search"
                value={filters.searchText}
                onChange={handleSearchChange}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[18px] h-[18px]" />
            </div>

            <button
              className="hidden md:flex bg-[#7B1984] text-white rounded-[41px] px-10 py-3.5 font-bold items-center"
              onClick={() => setIsTaskModalOpen(true)}
            >
              ADD TASK
            </button>
          </div>
        </div>

        {/* Task Views */}
        {view === "list" ? (
          <div className="space-y-6">
            {filteredTaskSections.map((section) => (
              <TaskSection
                key={section.id}
                title={section.title}
                color={section.color}
                tasks={section.tasks}
                defaultOpen={section.id !== "completed"}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section.status)}
                onDragStart={handleDragStart}
                updateTask={updateTask}
                deleteTask={deleteTask}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        ) : (
          <BoardView
            taskSections={filteredTaskSections}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        )}
      </div>

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleCreateTask}
      />

      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={() => setIsTaskDetailModalOpen(false)}
        onUpdate={handleTaskUpdate}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
