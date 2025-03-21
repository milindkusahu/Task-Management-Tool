import React, { useState } from "react";
import { Task } from "../../../types/task";
import { MoreIcon, EditIcon, DeleteIcon, DragIcon } from "../../../utils/icons";

export interface TaskCardProps {
  task: Task;
  variant?: "list" | "board";
  onStatusChange?: (taskId: string | number, newStatus: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string | number) => void;
  onClick?: (task: Task) => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  isMultiSelectActive?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  variant = "list",
  onStatusChange,
  onEdit,
  onDelete,
  onClick,
  isDraggable = true,
  onDragStart,
  isMultiSelectActive = false,
  isSelected = false,
  onToggleSelect,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(task.id!, e.target.checked ? "COMPLETED" : "TO-DO");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(task);
    }
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && task.id) {
      onDelete(task.id);
    }
    setShowMenu(false);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleCardClick = () => {
    if (isMultiSelectActive && onToggleSelect && task.id) {
      onToggleSelect(task.id.toString());
    } else if (onClick) {
      onClick(task);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-700";

    if (status === "COMPLETED") {
      bgColor = "bg-green-100";
      textColor = "text-green-700";
    } else if (status === "IN-PROGRESS") {
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {status === "IN-PROGRESS" ? "IN-PROGRESS" : status}
      </span>
    );
  };

  const CategoryBadge = ({ category }: { category?: string }) => {
    const bgColor = category === "WORK" ? "bg-purple-100" : "bg-orange-100";
    const textColor =
      category === "WORK" ? "text-purple-700" : "text-orange-700";

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {category || "Personal"}
      </span>
    );
  };

  if (variant === "board") {
    // Board variant
    return (
      <div
        className={`bg-white border border-gray-200 rounded-md p-3 mb-2 cursor-pointer hover:bg-gray-50 ${
          isSelected ? "bg-purple-50 border-purple-300" : ""
        }`}
        onClick={handleCardClick}
        draggable={isDraggable && !isMultiSelectActive}
        onDragStart={(e) =>
          onDragStart && !isMultiSelectActive && onDragStart(e, task)
        }
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2 flex-1">
            {isMultiSelectActive ? (
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                checked={isSelected}
                onChange={() =>
                  onToggleSelect &&
                  task.id &&
                  onToggleSelect(task.id.toString())
                }
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  checked={task.status === "COMPLETED"}
                  onChange={handleStatusChange}
                  onClick={(e) => e.stopPropagation()}
                />
                {isDraggable && (
                  <span className="cursor-move mt-1">
                    <DragIcon className="w-4 h-4 text-gray-400" />
                  </span>
                )}
              </div>
            )}
            <span
              className={`text-sm text-gray-800 font-medium ${
                task.status === "COMPLETED" ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className="relative">
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={handleMenuToggle}
            >
              <MoreIcon className="w-4 h-4 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={handleEdit}
                  >
                    <EditIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                    onClick={handleDelete}
                  >
                    <DeleteIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p
            className={`text-xs text-gray-600 mb-2 ml-6 line-clamp-2 ${
              task.status === "COMPLETED" ? "line-through text-gray-500" : ""
            }`}
          >
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 ml-6">
          <span>{task.dueDate || "No date"}</span>
          <CategoryBadge category={task.category} />
        </div>
      </div>
    );
  }

  // List variant
  return (
    <div
      className={`bg-white border-b border-gray-200 px-4 py-3 grid grid-cols-5 gap-4 hover:bg-gray-50 cursor-pointer ${
        isSelected ? "bg-purple-50" : ""
      }`}
      onClick={handleCardClick}
      draggable={isDraggable && !isMultiSelectActive}
      onDragStart={(e) =>
        onDragStart && !isMultiSelectActive && onDragStart(e, task)
      }
    >
      {/* Task Name Column */}
      <div className="flex items-center gap-2">
        {isMultiSelectActive ? (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            checked={isSelected}
            onChange={() =>
              onToggleSelect && task.id && onToggleSelect(task.id.toString())
            }
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={task.status === "COMPLETED"}
              onChange={handleStatusChange}
              onClick={(e) => e.stopPropagation()}
            />
            {isDraggable && (
              <span className="cursor-move">
                <DragIcon className="w-4 h-4 text-gray-400" />
              </span>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm text-gray-800 font-medium truncate ${
                task.status === "COMPLETED" ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
          </div>
          {task.description && (
            <p
              className={`text-xs text-gray-500 mt-1 line-clamp-1 ${
                task.status === "COMPLETED" ? "line-through" : ""
              }`}
            >
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
        <StatusBadge status={task.status} />
      </div>

      {/* Task Category Column */}
      <div className="flex items-center">
        <CategoryBadge category={task.category} />
      </div>

      {/* Tags Column */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1 mr-2 max-w-[150px]">
          {task.tags && task.tags.length > 0 ? (
            task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No tags</span>
          )}
        </div>

        {/* Task Actions */}
        <div className="relative">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={handleMenuToggle}
          >
            <MoreIcon className="w-5 h-5 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  onClick={handleEdit}
                >
                  <EditIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  onClick={handleDelete}
                >
                  <DeleteIcon className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
