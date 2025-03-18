import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DateIcon,
  DragIcon,
  MoreIcon,
  PlusIcon,
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
    status: "TO-DO",
    category: "WORK",
    dueDate: new Date(),
  });

  const handleAddTask = () => {
    setIsAddingTask(false);
    setNewTask({
      title: "",
      status: "TO-DO",
      category: "WORK",
      dueDate: new Date(),
    });
  };

  const TaskActions = ({ task }: { task: (typeof tasks)[0] }) => (
    <div className="relative">
      <button className="p-1 hover:bg-gray-100 rounded">
        <MoreIcon className="w-6 h-6 text-gray-500" />
      </button>
    </div>
  );

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

                  <button className="flex items-center gap-2 h-9 px-3 py-2 border border-gray-300 rounded-md bg-white">
                    <DateIcon className="w-4 h-4" />
                    Add date
                  </button>

                  <div className="relative">
                    <button className="min-w-[100px] h-9 px-3 py-2 border border-gray-300 rounded-md bg-white">
                      {newTask.status}
                    </button>
                  </div>

                  <div className="relative">
                    <button className="min-w-[100px] h-9 px-3 py-2 border border-gray-300 rounded-md bg-white">
                      {newTask.category}
                    </button>
                  </div>
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
                  checked={task.status === "completed"}
                  readOnly
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
                    {task.status || "TO-DO"}
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
