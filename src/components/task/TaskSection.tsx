import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
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
    id: number;
    title: string;
    status: string;
    dueDate?: string;
    category?: string;
  }>;
  defaultOpen?: boolean;
}

export function TaskSection({
  title,
  color,
  tasks,
  defaultOpen = true,
}: TaskSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    status: title.includes("Todo")
      ? "TO-DO"
      : title.includes("In-Progress")
      ? "IN-PROGRESS"
      : "COMPLETED",
    category: "WORK",
    dueDate: new Date().toISOString().split("T")[0],
  });
  const { createTask, deleteTask, updateTask } = useTasks();

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await createTask({
        taskData: {
          title: newTask.title,
          description: "",
          category: newTask.category,
          status: newTask.status,
          dueDate: newTask.dueDate,
        },
      });

      setIsAddingTask(false);
      setNewTask({
        title: "",
        status: title.includes("Todo")
          ? "TO-DO"
          : title.includes("In-Progress")
          ? "IN-PROGRESS"
          : "COMPLETED",
        category: "WORK",
        dueDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(String(taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleTaskStatusChange = async (taskId: number, newStatus: string) => {
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
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreIcon className="w-6 h-6 text-gray-500" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  // Edit task logic (you can implement this later)
                  setShowMenu(false);
                }}
              >
                <EditIcon className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                onClick={() => {
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
        <div className="bg-[#F1F1F1] rounded-b-xl border border-solid border-[#FFFAEA] pt-0 px-0">
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
                <div className="flex items-center gap-4">
                  <input
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />

                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />

                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="WORK">WORK</option>
                    <option value="PERSONAL">PERSONAL</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    className="bg-[#7B1984] text-white px-6 py-2 rounded-md font-semibold"
                    onClick={handleAddTask}
                  >
                    ADD
                  </button>
                  <button
                    className="px-6 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsAddingTask(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 p-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg p-3 flex items-center gap-4"
              >
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
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <DragIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-800">{task.title}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {task.dueDate || "Today"}
                </div>
                <div className="min-w-[100px]">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    {task.status}
                  </span>
                </div>
                <div className="min-w-[100px]">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    {task.category || "Work"}
                  </span>
                </div>
                <TaskActions task={task} />
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
