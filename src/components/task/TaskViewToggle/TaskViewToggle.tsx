import React from "react";
import { ListIcon, BoardIcon } from "../../../utils/icons";

export interface TaskViewToggleProps {
  view: "list" | "board";
  onChange: (view: "list" | "board") => void;
  className?: string;
}

const TaskViewToggle: React.FC<TaskViewToggleProps> = ({
  view,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex ${className}`}>
      <button
        onClick={() => onChange("list")}
        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm relative ${
          view === "list"
            ? "text-black border-b-1 border-black"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <ListIcon width={16} height={16} />
        <span>List</span>
      </button>
      <button
        onClick={() => onChange("board")}
        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm relative ${
          view === "board"
            ? "text-black border-b-1 border-black"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <BoardIcon width={18} height={18} />
        <span>Board</span>
      </button>
    </div>
  );
};

export default TaskViewToggle;
