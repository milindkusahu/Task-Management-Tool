import React, { useState } from "react";
import { TaskCard } from "../TaskCard";
import { Task } from "../../../types/task";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "../../../utils/icons";

export interface TaskListProps {
  title: string;
  color: string;
  tasks: Task[];
  defaultOpen?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onTaskUpdate?: (data: { taskId: string; updates: Partial<Task> }) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskCreate?: (taskData: Omit<Task, "id" | "userId">) => void;
  onTaskClick?: (task: Task) => void;
  onAddTaskClick?: () => void;
  isMultiSelectActive?: boolean;
  selectedTaskIds?: Set<string>;
  onToggleTaskSelection?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  title,
  color,
  tasks,
  defaultOpen = true,
  onDragOver,
  onDrop,
  onDragStart,
  onTaskUpdate,
  onTaskDelete,
  onTaskClick,
  onAddTaskClick,
  isMultiSelectActive = false,
  selectedTaskIds = new Set(),
  onToggleTaskSelection,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Status to use for new tasks in this list
  const getStatusFromTitle = (title: string): string => {
    if (title.includes("Todo")) return "TO-DO";
    if (title.includes("In-Progress")) return "IN-PROGRESS";
    if (title.includes("Completed")) return "COMPLETED";
    return "TO-DO";
  };

  const handleTaskCreate = (taskData: Omit<Task, "id" | "userId">) => {
    if (onTaskCreate) {
      onTaskCreate(taskData);
    }
    setIsAddingTask(false);
  };

  const handleTaskUpdate = (taskData: Omit<Task, "id" | "userId">) => {
    if (onTaskUpdate && editingTask?.id) {
      onTaskUpdate({
        taskId: String(editingTask.id),
        updates: taskData,
      });
    }
    setEditingTask(null);
    setIsAddingTask(false);
  };

  const handleTaskStatusChange = (
    taskId: string | number,
    newStatus: string
  ) => {
    if (onTaskUpdate) {
      onTaskUpdate({
        taskId: String(taskId),
        updates: { status: newStatus },
      });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsAddingTask(true);
  };

  const handleCancel = () => {
    setIsAddingTask(false);
    setEditingTask(null);
  };

  // Extract count from title if it has a format like "Todo (3)"
  const renderTitle = () => {
    const match = title.match(/(.*)\s*\((\d+)\)/);
    if (match) {
      return (
        <>
          {match[1]} <span className="text-gray-500">({match[2]})</span>
        </>
      );
    }
    return title;
  };

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div
        className={`${color} rounded-t-md px-4 py-3 flex justify-between items-center`}
      >
        <h3 className="font-medium text-black text-base">{renderTitle()}</h3>
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
          className="bg-gray-100 rounded-b-md"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {/* Add task button */}
          <button
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200 text-left"
            onClick={onAddTaskClick}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="font-medium text-gray-700 text-sm">ADD TASK</span>
          </button>

          {/* Task list */}
          <div>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                variant="list"
                onStatusChange={handleTaskStatusChange}
                onEdit={handleEdit}
                onDelete={onTaskDelete}
                onClick={onTaskClick}
                onDragStart={onDragStart}
                isMultiSelectActive={isMultiSelectActive}
                isSelected={
                  task.id ? selectedTaskIds.has(task.id.toString()) : false
                }
                onToggleSelect={onToggleTaskSelection}
              />
            ))}
          </div>

          {/* Empty state */}
          {tasks.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">
              No Tasks in {title.split(" ")[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
