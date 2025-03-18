import { useState, useRef } from "react";
import { useTasks } from "../../hooks/useTasks";
import { MoreIcon, EditIcon, DeleteIcon, PlusIcon } from "../../utils/icons";

interface BoardViewProps {
  taskSections: {
    id: string;
    title: string;
    color: string;
    tasks: Array<{
      id: number;
      title: string;
      status: string;
      category?: string;
      dueDate?: string;
    }>;
  }[];
}

export function BoardView({ taskSections }: BoardViewProps) {
  const { updateTask, deleteTask, createTask } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "WORK",
    dueDate: new Date().toISOString().split("T")[0],
  });
  const [draggedTask, setDraggedTask] = useState<{
    id: number;
    sectionId: string;
  } | null>(null);

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

  const handleDragStart = (
    e: React.DragEvent,
    taskId: number,
    sectionId: string
  ) => {
    setDraggedTask({ id: taskId, sectionId });
    // Set data for drag operation
    e.dataTransfer.setData("text/plain", taskId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();

    if (!draggedTask) return;

    const sourceSection = draggedTask.sectionId;

    // If dropped in the same section, do nothing
    if (sourceSection === targetSectionId) return;

    const taskId = draggedTask.id;
    const newStatus = getStatusFromSectionId(targetSectionId);

    // Update the task status in Firestore
    updateTask({
      taskId: String(taskId),
      updates: { status: newStatus },
    });

    setDraggedTask(null);
  };

  const handleAddTask = async (sectionId: string) => {
    if (!newTask.title.trim()) return;

    try {
      await createTask({
        taskData: {
          title: newTask.title,
          description: "",
          category: newTask.category,
          status: getStatusFromSectionId(sectionId),
          dueDate: newTask.dueDate,
        },
      });

      setIsAddingTask(null);
      setNewTask({
        title: "",
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

  const TaskCard = ({
    task,
    sectionId,
  }: {
    task: BoardViewProps["taskSections"][0]["tasks"][0];
    sectionId: string;
  }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-2 cursor-move"
        draggable
        onDragStart={(e) => handleDragStart(e, task.id, sectionId)}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-2 flex-1">
            <input
              type="checkbox"
              className="mt-1.5 rounded border-gray-300"
              checked={task.status === "COMPLETED"}
              onChange={(e) => {
                updateTask({
                  taskId: String(task.id),
                  updates: { status: e.target.checked ? "COMPLETED" : "TO-DO" },
                });
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-sm text-gray-800 font-medium">
              {task.title}
            </span>
          </div>
          <div className="relative">
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreIcon className="w-4 h-4 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  >
                    <EditIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
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
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{task.dueDate || "Today"}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {task.category || "Work"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {taskSections.map((section) => (
        <div key={section.id} className="flex flex-col">
          <div className={`${section.color} rounded-t-xl px-4 py-3`}>
            <h3 className="font-semibold text-black text-base">
              {section.title}
            </h3>
          </div>

          <div
            className="flex-1 bg-[#F1F1F1] rounded-b-xl border border-solid border-[#FFFAEA] p-2"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, section.id)}
          >
            {isAddingTask === section.id ? (
              <div className="bg-white rounded-lg p-3 mb-2">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="p-2 border border-gray-300 rounded"
                  />
                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    className="p-2 border border-gray-300 rounded"
                  >
                    <option value="WORK">Work</option>
                    <option value="PERSONAL">Personal</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => setIsAddingTask(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 bg-[#7B1984] text-white rounded"
                    onClick={() => handleAddTask(section.id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="p-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer mb-2"
                onClick={() => setIsAddingTask(section.id)}
              >
                <PlusIcon className="w-[18px] h-[18px]" />
                <span className="font-bold text-[#000000]/80 text-sm uppercase">
                  ADD TASK
                </span>
              </div>
            )}

            <div>
              {section.tasks.map((task) => (
                <TaskCard key={task.id} task={task} sectionId={section.id} />
              ))}
            </div>

            {section.tasks.length === 0 && !isAddingTask && (
              <div className="py-16 text-center font-medium text-[#2F2F2F] text-[15px]">
                No Tasks in {section.title.split(" ")[0]}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
