import { useState, useRef } from "react";
import { CrossIcon, DateIcon, ChevronDownIcon } from "../../utils/icons";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    category: string;
    dueDate: string;
    status: string;
    attachments?: File[];
  }) => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSave,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("TO-DO");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
    status?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: {
      title?: string;
      dueDate?: string;
      status?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave({
      title,
      description,
      category,
      dueDate,
      status,
      attachments,
    });
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Work");
    setDueDate("");
    setStatus("TO-DO");
    setAttachments([]);
    setErrors({});
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Create Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Task Title */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <div className="border border-gray-300 rounded">
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full p-2 rounded"
                maxLength={300}
              />
              <div className="flex gap-2 border-t p-2 bg-gray-50">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <span className="font-bold">B</span>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <span className="italic">I</span>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <span className="underline">S</span>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <span>•</span>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <span>1.</span>
                </button>
                <div className="ml-auto text-xs text-gray-500">
                  {description.length}/300 characters
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Task Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Category*
              </label>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 border rounded-full ${
                    category === "Work"
                      ? "bg-purple-100 border-purple-300"
                      : "border-gray-300"
                  }`}
                  onClick={() => setCategory("Work")}
                >
                  Work
                </button>
                <button
                  className={`px-4 py-2 border rounded-full ${
                    category === "Personal"
                      ? "bg-purple-100 border-purple-300"
                      : "border-gray-300"
                  }`}
                  onClick={() => setCategory("Personal")}
                >
                  Personal
                </button>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due on*
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full p-2 border ${
                    errors.dueDate ? "border-red-500" : "border-gray-300"
                  } rounded pr-10`}
                />
                <DateIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {errors.dueDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Task Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Status*
              </label>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className={`w-full p-2 border ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  } rounded text-left flex justify-between items-center`}
                >
                  <span>{status || "Choose"}</span>
                  <ChevronDownIcon className="w-5 h-5" />
                </button>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}

                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 border border-gray-200 bg-white rounded shadow-lg z-10">
                    <button
                      className="w-full p-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setStatus("TO-DO");
                        setStatusDropdownOpen(false);
                      }}
                    >
                      TO-DO
                    </button>
                    <button
                      className="w-full p-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setStatus("IN-PROGRESS");
                        setStatusDropdownOpen(false);
                      }}
                    >
                      IN-PROGRESS
                    </button>
                    <button
                      className="w-full p-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setStatus("COMPLETED");
                        setStatusDropdownOpen(false);
                      }}
                    >
                      COMPLETED
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
              onClick={triggerFileInput}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <p className="text-gray-500">
                Drop your files here or{" "}
                <span className="text-blue-500">Update</span>
              </p>
              {attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">
                    {attachments.length} file(s) selected
                  </p>
                  <ul className="mt-2 text-left max-h-32 overflow-y-auto">
                    {Array.from(attachments).map((file, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 truncate"
                      >
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md mr-2"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#7B1984] text-white rounded-md"
          >
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
}
