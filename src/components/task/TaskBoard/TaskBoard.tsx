import React from "react";
import TaskBoardColumn from "./TaskBoardColumn";
import { Task } from "../../../types/task";

export interface TaskColumn {
  id: string;
  title: string;
  color: string;
  status: string;
  tasks: Task[];
}

export interface TaskBoardProps {
  columns: TaskColumn[];
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetStatus: string) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onTaskUpdate?: (data: { taskId: string; updates: Partial<Task> }) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
  onTaskCreate?: (taskData: Omit<Task, "id" | "userId">) => void;
  isMultiSelectActive?: boolean;
  selectedTaskIds?: Set<string>;
  onToggleTaskSelection?: (taskId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  columns,
  onDragOver,
  onDrop,
  onDragStart,
  onTaskUpdate,
  onTaskDelete,
  onTaskClick,
  onTaskCreate,
  isMultiSelectActive = false,
  selectedTaskIds = new Set(),
  onToggleTaskSelection,
}) => {
  const handleColumnDrop = (e: React.DragEvent, status: string) => {
    if (onDrop) {
      onDrop(e, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <TaskBoardColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          status={column.status}
          tasks={column.tasks}
          onDragOver={onDragOver}
          onDrop={(e) => handleColumnDrop(e, column.status)}
          onDragStart={onDragStart}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
          onTaskClick={onTaskClick}
          onAddTaskClick={() =>
            onTaskCreate &&
            onTaskCreate({
              title: "",
              description: "",
              status: column.status,
              category: "WORK",
              dueDate: new Date().toISOString().split("T")[0],
            })
          }
          isMultiSelectActive={isMultiSelectActive}
          selectedTaskIds={selectedTaskIds}
          onToggleTaskSelection={onToggleTaskSelection}
        />
      ))}
    </div>
  );
};

export default TaskBoard;
