import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useTasks } from "../hooks/useTasks";
import { TaskSection } from "../components/task/TaskSection";
import { BoardView } from "../components/task/BoardView";
import { CreateTaskModal } from "../components/task/CreateTaskModal";
import { Task } from "../types/task";
import {
  BoardIcon,
  ChevronDownIcon,
  ListIcon,
  LogoutIcon,
  MobileDocumentIcon,
  SearchIcon,
  SortIcon,
} from "../utils/icons";
import { formatDate } from "../utils/dateUtils";

const Dashboard = () => {
  const { logout, user } = useAuthContext();
  const { data: userProfile, isLoading: isLoadingProfile } = useCurrentUser();
  const {
    todoTasks,
    inProgressTasks,
    completedTasks,
    isLoading: isLoadingTasks,
    createTask,
    isCreating,
  } = useTasks();

  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "board">("list");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const transformTasks = (tasks: Task[]) => {
    return tasks.map((task) => ({
      id: task.id,
      originalId: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate,
      category: task.category,
    }));
  };

  const taskSections = [
    {
      id: "todo",
      title: `Todo (${todoTasks.length})`,
      color: "bg-[#FAC3FF]",
      tasks: isLoadingTasks ? [] : transformTasks(todoTasks),
    },
    {
      id: "inProgress",
      title: `In-Progress (${inProgressTasks.length})`,
      color: "bg-[#85D9F1]",
      tasks: isLoadingTasks ? [] : transformTasks(inProgressTasks),
    },
    {
      id: "completed",
      title: `Completed (${completedTasks.length})`,
      color: "bg-[#CDFFCC]",
      tasks: isLoadingTasks ? [] : transformTasks(completedTasks),
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
          userId: user.uid,
        },
        attachmentFiles: taskData.attachments,
      });

      // Close the modal
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

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
                  <SortIcon />
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
              <button className="h-8 px-2 py-[5px] rounded-[60px] border border-[#000000]/20 flex items-center">
                <span className="text-[#000000]/60 text-xs font-semibold">
                  Category
                </span>
                <ChevronDownIcon className="w-[18px] h-[18px] ml-1" />
              </button>
              <button className="h-8 px-2 py-[5px] rounded-[60px] border border-[#000000]/20 flex items-center">
                <span className="text-[#000000]/60 text-xs font-semibold">
                  Due Date
                </span>
                <ChevronDownIcon className="w-[18px] h-[18px] ml-1" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:flex-none">
              <input
                className="w-full md:w-[206px] h-[38px] pl-9 pr-3 py-1.5 rounded-[60px] border border-[#000000]/42"
                placeholder="Search"
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
            {taskSections.map((section) => (
              <TaskSection
                key={section.id}
                title={section.title}
                color={section.color}
                tasks={section.tasks}
                defaultOpen={section.id !== "completed"}
              />
            ))}
          </div>
        ) : (
          <BoardView taskSections={taskSections} />
        )}
      </div>

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleCreateTask}
      />
    </div>
  );
};

export default Dashboard;
