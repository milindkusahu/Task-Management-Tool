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
  onTaskClick?: (task: Task) => void;
  onAddTaskClick?: () => void;
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
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

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
                onDelete={onTaskDelete}
                onClick={onTaskClick}
                onDragStart={onDragStart}
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
