import { useState, useEffect } from "react";
import { CrossIcon, DateIcon } from "../../utils/icons";
import { formatDate } from "../../utils/dateUtils";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: {
    taskId: string;
    updates: {
      title: string;
      description: string;
      category: string;
      status: string;
      dueDate: string;
    };
  }) => void;
  task: {
    id: string | number;
    title: string;
    description?: string;
    status: string;
    category?: string;
    dueDate?: string;
  } | null;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  onUpdate,
  task,
}: TaskDetailModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "WORK",
    status: "TO-DO",
    dueDate: new Date().toISOString().split("T")[0],
  });
  const [activityLog, setActivityLog] = useState([
    {
      action: "created this task",
      timestamp: new Date().toISOString(),
      previousValue: null,
      newValue: null,
    },
    {
      action: "changed status from in-progress to complete",
      timestamp: new Date().toISOString(),
      previousValue: "IN-PROGRESS",
      newValue: "COMPLETED",
    },
    {
      action: "uploaded file",
      timestamp: new Date().toISOString(),
      previousValue: null,
      newValue: null,
    },
  ]);

  // Load task data when modal opens or task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "WORK",
        status: task.status || "TO-DO",
        dueDate: task.dueDate || new Date().toISOString().split("T")[0],
      });
    }
  }, [task]);

  const handleSubmit = () => {
    if (!task || !formData.title.trim()) return;

    onUpdate({
      taskId: String(task.id),
      updates: {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        dueDate: formData.dueDate,
      },
    });
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl flex h-[80vh]">
        {/* Main content area */}
        <div className="flex-1 overflow-auto p-6 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="text-xl font-semibold border-none focus:outline-none focus:ring-1 focus:ring-purple-300 rounded p-1 w-full"
            />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <CrossIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add a description..."
              className="w-full border border-gray-300 rounded-md p-3 min-h-[120px] focus:ring-1 focus:ring-purple-300 focus:border-purple-300"
            />
            <div className="flex gap-2 mt-2 border-t border-gray-100 pt-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="font-bold">B</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="italic">I</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="underline">S</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span>•</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span>1.</span>
              </button>
              <div className="ml-auto text-xs text-gray-500">
                {formData.description.length}/300 characters
              </div>
            </div>
          </div>

          {/* Task metadata */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Category*
              </label>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 border rounded-full ${
                    formData.category === "WORK"
                      ? "bg-purple-100 border-purple-300"
                      : "border-gray-300"
                  }`}
                  onClick={() => setFormData({ ...formData, category: "WORK" })}
                >
                  Work
                </button>
                <button
                  className={`px-4 py-2 border rounded-full ${
                    formData.category === "PERSONAL"
                      ? "bg-purple-100 border-purple-300"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, category: "PERSONAL" })
                  }
                >
                  Personal
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due on*
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded pr-10"
                />
                <DateIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Status*
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="TO-DO">TO-DO</option>
                <option value="IN-PROGRESS">IN-PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">
                Drop your files here or{" "}
                <span className="text-blue-500">Upload</span>
              </p>
              {task.id === 71 && (
                <div className="mt-2">
                  <div className="relative inline-block w-24 h-24 m-2">
                    <img
                      src="/colorful-abstract.jpg"
                      alt="Attachment"
                      className="w-full h-full object-cover rounded"
                    />
                    <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                      <CrossIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity sidebar */}
        <div className="w-72 border-l border-gray-200 bg-gray-50 p-4 overflow-auto">
          <h3 className="font-medium text-gray-700 mb-4">Activity</h3>

          <div className="space-y-4">
            {activityLog.map((activity, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between text-gray-500 mb-1">
                  <span>You {activity.action}</span>
                  <span>{formatDate(activity.timestamp)}</span>
                </div>
                {activity.previousValue && activity.newValue && (
                  <div className="mt-1 text-xs">
                    <span className="bg-red-100 px-1 py-0.5 rounded">
                      {activity.previousValue}
                    </span>
                    {" → "}
                    <span className="bg-green-100 px-1 py-0.5 rounded">
                      {activity.newValue}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="fixed bottom-4 right-4 space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
        >
          CANCEL
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#7B1984] text-white rounded-md"
        >
          UPDATE
        </button>
      </div>
    </div>
  );
}
