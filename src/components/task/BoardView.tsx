import { useState } from "react";
import { MoreIcon, PlusIcon } from "../../utils/icons";

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
  const [newTask, setNewTask] = useState({
    title: "",
    status: "TO-DO",
    category: "WORK",
    dueDate: new Date(),
  });

  const handleAddTask = () => {
    setNewTask({
      title: "",
      status: "TO-DO",
      category: "WORK",
      dueDate: new Date(),
    });
  };

  const TaskCard = ({
    task,
  }: {
    task: BoardViewProps["taskSections"][0]["tasks"][0];
  }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2 flex-1">
          <input
            type="checkbox"
            className="mt-1.5 rounded border-gray-300"
            checked={task.status === "COMPLETED"}
            readOnly
          />
          <span className="text-sm text-gray-800 font-medium">
            {task.title}
          </span>
        </div>
        <div className="relative">
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreIcon className="w-4 h-4 text-gray-500" />
          </button>
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

  const AddTaskButton = () => (
    <button
      className="fixed bottom-4 right-4 md:hidden bg-[#7B1984] text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
      onClick={() => {
        /* Show add task modal */
      }}
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {taskSections.map((section) => (
        <div key={section.id} className="flex flex-col">
          <div className={`${section.color} rounded-t-xl px-4 py-3`}>
            <h3 className="font-semibold text-black text-base">
              {section.title}
            </h3>
          </div>

          <div className="flex-1 bg-[#F1F1F1] rounded-b-xl border border-solid border-[#FFFAEA] p-2">
            <div className="p-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer mb-2">
              <PlusIcon className="w-[18px] h-[18px]" />
              <span className="font-bold text-[#000000]/80 text-sm uppercase">
                ADD TASK
              </span>
            </div>

            <div className="space-y-2">
              {section.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {section.tasks.length === 0 && (
              <div className="py-16 text-center font-medium text-[#2F2F2F] text-[15px]">
                No Tasks in {section.title.split(" ")[0]}
              </div>
            )}
          </div>
        </div>
      ))}

      <AddTaskButton />
    </div>
  );
}
