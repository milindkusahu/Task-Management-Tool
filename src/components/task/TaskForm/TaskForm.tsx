import React, { useState } from "react";
import { Button, Input, Dropdown } from "../../common";
import { Task } from "../../../types/task";

export interface TaskFormProps {
  task?: Task | null;
  initialStatus?: string;
  onSubmit: (taskData: Omit<Task, "id" | "userId">) => void;
  onCancel: () => void;
  includeAttachments?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  initialStatus = "TO-DO",
  onSubmit,
  onCancel,
  includeAttachments = false,
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || initialStatus,
    category: task?.category || "WORK",
    dueDate: task?.dueDate || new Date().toISOString().split("T")[0],
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      dueDate?: string;
    } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      category: formData.category,
      dueDate: formData.dueDate,
      ...(includeAttachments && attachments.length > 0 && { attachments }),
    });
  };

  const categoryOptions = [
    { value: "WORK", label: "Work" },
    { value: "PERSONAL", label: "Personal" },
  ];

  const statusOptions = [
    { value: "TO-DO", label: "To Do" },
    { value: "IN-PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task Title"
        error={errors.title}
        fullWidth
        autoFocus
      />

      <div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px] focus:outline-none focus:ring-1 focus:ring-[#7B1984] focus:border-[#7B1984]"
        />
        <div className="flex justify-end text-xs text-gray-500 mt-1">
          {formData.description.length}/300 characters
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dropdown
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
          fullWidth
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
            fullWidth
          />
        </div>

        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
          fullWidth
        />
      </div>

      {includeAttachments && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-gray-500"
            >
              Drop your files here or{" "}
              <span className="text-blue-500">Upload</span>
            </label>
            {attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">
                  {attachments.length} file(s) selected
                </p>
                <ul className="mt-2 text-left max-h-32 overflow-y-auto">
                  {Array.from(attachments).map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 truncate">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2">
        <Button type="submit">{task ? "UPDATE" : "ADD"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          CANCEL
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
