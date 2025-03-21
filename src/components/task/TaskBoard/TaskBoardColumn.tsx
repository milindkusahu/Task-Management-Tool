import React from "react";
import { TaskCard } from "../TaskCard";
import { Task } from "../../../types/task";
import { PlusIcon, ChevronUpIcon } from "../../../utils/icons";

export interface TaskBoardColumnProps {
  id: string;
  title: string;
  color: string;
  status: string;
  tasks: Task[];
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onTaskUpdate?: (data: { taskId: string; updates: Partial<Task> }) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
  onAddTaskClick?: () => void;
  isMultiSelectActive?: boolean;
  selectedTaskIds?: Set<string>;
  onToggleTaskSelection?: (taskId: string) => void;
}

const TaskBoardColumn: React.FC<TaskBoardColumnProps> = ({
  title,
  color,
  tasks,
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

  const handleStatusChange = (taskId: string | number, newStatus: string) => {
    if (onTaskUpdate) {
      onTaskUpdate({
        taskId: String(taskId),
        updates: { status: newStatus },
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div
        className={`${color} rounded-t-md px-4 py-3 flex justify-between items-center`}
      >
        <h3 className="font-medium text-black text-base">{renderTitle()}</h3>
        <button className="focus:outline-none">
          <ChevronUpIcon className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Column Content */}
      <div
        className="flex-1 bg-gray-100 rounded-b-md p-2 overflow-y-auto"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {/* Add task button */}
        <button
          className="w-full bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer text-left"
          onClick={() => onAddTaskClick && onAddTaskClick()}
        >
          <PlusIcon className="w-4 h-4" />
          <span className="font-medium text-gray-700 text-sm">ADD TASK</span>
        </button>

        {/* Tasks */}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            variant="board"
            onStatusChange={handleStatusChange}
            onDelete={(taskId: string | number) =>
              onTaskDelete && onTaskDelete(String(taskId))
            }
            onClick={onTaskClick}
            onDragStart={onDragStart}
            isMultiSelectActive={isMultiSelectActive}
            isSelected={
              task.id ? selectedTaskIds.has(task.id.toString()) : false
            }
            onToggleSelect={onToggleTaskSelection}
          />
        ))}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">
            No Tasks in {title.split(" ")[0]}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBoardColumn;
