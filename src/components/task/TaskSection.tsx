import { useState } from "react";
import { formatDate } from "../../utils/dateUtils";
import {
  PlusIcon,
  DateIcon,
  MoreIcon,
  DragIcon,
  EditIcon,
  DeleteIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../../utils/icons";

interface TaskSectionProps {
  title: string;
  color: string;
  tasks: Array<{
    id: string | number;
    title: string;
    status: string;
    dueDate?: string;
    category?: string;
    description?: string;
    onTaskClick?: (task: any) => void;
  }>;
  defaultOpen?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragStart?: (e: React.DragEvent, task: any) => void;
  updateTask?: (data: { taskId: string; updates: any }) => void;
  deleteTask?: (taskId: string) => void;
}

export function TaskSection({
  title,
  color,
  tasks,
  defaultOpen = true,
  onDragOver,
  onDrop,
  onDragStart,
  updateTask,
  deleteTask,
  onTaskClick,
}: TaskSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | number | null>(
    null
  );
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: title.includes("Todo")
      ? "TO-DO"
      : title.includes("In-Progress")
      ? "IN-PROGRESS"
      : "COMPLETED",
    category: "WORK",
    dueDate: new Date().toISOString().split("T")[0],
  });

  // Start editing a task
  const handleEditTask = (task: any) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      category: task.category || "WORK",
      dueDate: task.dueDate || new Date().toISOString().split("T")[0],
    });
    setIsAddingTask(true);
  };

  // Handle form submission (create or update)
  const handleTaskSubmit = async () => {
    if (!newTask.title.trim()) return;

    try {
      if (editingTaskId && updateTask) {
        // Update existing task
        await updateTask({
          taskId: String(editingTaskId),
          updates: {
            title: newTask.title,
            description: newTask.description,
            status: newTask.status,
            category: newTask.category,
            dueDate: newTask.dueDate,
          },
        });

        setEditingTaskId(null);
      }

      // Reset form state
      setIsAddingTask(false);
      setNewTask({
        title: "",
        description: "",
        status: title.includes("Todo")
          ? "TO-DO"
          : title.includes("In-Progress")
          ? "IN-PROGRESS"
          : "COMPLETED",
        category: "WORK",
        dueDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleTaskDelete = async (taskId: number | string) => {
    if (!deleteTask) return;

    if (confirm("Are you sure you want to delete this task?")) {
      try {
        // Convert to string and log the ID
        const taskIdStr = String(taskId);
        console.log("Task ID for deletion:", taskIdStr);

        // Try the deletion
        await deleteTask(taskIdStr);
      } catch (error) {
        console.error("Error deleting task:", error);
        // Show error to user
        alert("Could not delete task. Please try again later.");
      }
    }
  };

  const handleTaskStatusChange = async (
    taskId: number | string,
    newStatus: string
  ) => {
    if (!updateTask) return;

    try {
      await updateTask({
        taskId: String(taskId),
        updates: { status: newStatus },
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const TaskActions = ({ task }: { task: (typeof tasks)[0] }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="relative">
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={(e) => {
            e.stopPropagation(); // Stop event propagation
            setShowMenu(!showMenu);
          }}
        >
          <MoreIcon className="w-6 h-6 text-gray-500" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  handleEditTask(task);
                  setShowMenu(false);
                }}
              >
                <EditIcon className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  handleTaskDelete(task.id);
                  setShowMenu(false);
                }}
              >
                <DeleteIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-none">
      {/* Section Header */}
      <div
        className={`${color} rounded-t-xl px-4 py-3 flex justify-between items-center`}
      >
        <h3 className="font-semibold text-black text-base">{title}</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-black" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-black" />
          )}
        </button>
      </div>

      {/* Section Content */}
      {isOpen && (
        <div
          className="bg-[#F1F1F1] rounded-b-xl border border-solid border-[#FFFAEA] pt-0 px-0"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="border-t border-solid border-[#FFFAEA]">
            {!isAddingTask ? (
              <div
                className="p-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => setIsAddingTask(true)}
              >
                <PlusIcon className="w-[18px] h-[18px]" />
                <span className="font-bold text-[#000000]/80 text-sm uppercase">
                  ADD TASK
                </span>
              </div>
            ) : (
              <div className="p-4 bg-white border-b">
                <div className="flex flex-col gap-4">
                  <input
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    autoFocus
                  />

                  <textarea
                    placeholder="Description (optional)"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
                  />

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={newTask.status}
                        onChange={(e) =>
                          setNewTask({ ...newTask, status: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="TO-DO">To Do</option>
                        <option value="IN-PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newTask.category}
                        onChange={(e) =>
                          setNewTask({ ...newTask, category: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="WORK">Work</option>
                        <option value="PERSONAL">Personal</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) =>
                          setNewTask({ ...newTask, dueDate: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    className="bg-[#7B1984] text-white px-6 py-2 rounded-md font-semibold"
                    onClick={handleTaskSubmit}
                  >
                    {editingTaskId ? "UPDATE" : "ADD"}
                  </button>
                  <button
                    className="px-6 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsAddingTask(false);
                      setEditingTaskId(null);
                      setNewTask({
                        title: "",
                        description: "",
                        status: title.includes("Todo")
                          ? "TO-DO"
                          : title.includes("In-Progress")
                          ? "IN-PROGRESS"
                          : "COMPLETED",
                        category: "WORK",
                        dueDate: new Date().toISOString().split("T")[0],
                      });
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 p-2">
            {tasks.map((task, index) => (
              <div
                key={
                  typeof task.id === "string" || typeof task.id === "number"
                    ? task.id
                    : `task-${index}`
                }
                className="bg-white rounded-lg p-3 grid grid-cols-4 gap-4 hover:bg-gray-50 cursor-pointer"
                draggable={true}
                onDragStart={(e) => onDragStart && onDragStart(e, task)}
                onClick={() => onTaskClick && onTaskClick(task)}
              >
                {/* Task Name Column */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={task.status === "COMPLETED"}
                    onChange={(e) => {
                      handleTaskStatusChange(
                        task.id,
                        e.target.checked ? "COMPLETED" : "TO-DO"
                      );
                    }}
                    onClick={(e) => e.stopPropagation()} // Stop event propagation
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <DragIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-800 truncate">
                        {task.title}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1 ml-6">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Due Date Column */}
                <div className="text-sm text-gray-500 flex items-center">
                  {task.dueDate}
                </div>

                {/* Task Status Column */}
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      task.status === "COMPLETED"
                        ? "bg-green-100"
                        : task.status === "IN-PROGRESS"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Task Category Column */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      task.category === "WORK"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {task.category || "Work"}
                  </span>

                  {/* Task Actions */}
                  <TaskActions task={task} />
                </div>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="py-16 text-center font-medium text-[#2F2F2F] text-[15px]">
              No Tasks in {title.split(" ")[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
